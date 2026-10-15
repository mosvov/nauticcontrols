#!/usr/bin/env node
/**
 * Push docs/policy-pages copy into Settings → Policies (written policies).
 * Needs Admin API scope: write_legal_policies
 * Reads .env.live.local (client credentials). Never prints secrets/tokens.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const API_VERSION = "2025-10";
const SITE = "https://www.nauticcontrols.com";

function loadEnv(path) {
  if (!existsSync(path)) throw new Error(`Missing ${path}`);
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[t.slice(0, i).trim()] = v;
  }
  return out;
}

function absLinks(html) {
  return html
    .replace(
      /href="\/(shipping|returns|privacy|terms|fcc|about)"/g,
      `href="${SITE}/$1"`,
    )
    .trim();
}

const env = loadEnv(resolve(root, ".env.live.local"));
const SHOP = env.SHOPIFY_SHOP;
const CLIENT_ID = env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = env.SHOPIFY_CLIENT_SECRET;
if (!SHOP || !CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("Need SHOPIFY_SHOP, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET");
}

let token = null;
let tokenExpiresAt = 0;

async function getToken() {
  if (token && Date.now() < tokenExpiresAt - 60_000) return token;
  const res = await fetch(
    `https://${SHOP}.myshopify.com/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    },
  );
  if (!res.ok) throw new Error(`Token HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  token = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in || 86000) * 1000;
  return token;
}

async function gql(query, variables = {}) {
  const res = await fetch(
    `https://${SHOP}.myshopify.com/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": await getToken(),
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(JSON.stringify(json.errors, null, 2));
  }
  return json.data;
}

const CONTACT_HTML = `
<p><strong>Nautic Controls</strong> (operated by Rigsense LLC, Florida, USA)</p>
<p>Email: <a href="mailto:info@nauticcontrols.com">info@nauticcontrols.com</a></p>
<p>Website: <a href="https://www.nauticcontrols.com">www.nauticcontrols.com</a></p>
<p>For orders, shipping, warranty, and product questions, email us and include your order number when you have one.</p>
`.trim();

const updates = [
  [
    "REFUND_POLICY",
    absLinks(readFileSync(resolve(root, "docs/policy-pages/returns.html"), "utf8")),
  ],
  [
    "SHIPPING_POLICY",
    absLinks(
      readFileSync(resolve(root, "docs/policy-pages/shipping.html"), "utf8"),
    ),
  ],
  [
    "TERMS_OF_SERVICE",
    absLinks(readFileSync(resolve(root, "docs/policy-pages/terms.html"), "utf8")),
  ],
  ["CONTACT_INFORMATION", CONTACT_HTML],
];

const mutation = `
mutation shopPolicyUpdate($shopPolicy: ShopPolicyInput!) {
  shopPolicyUpdate(shopPolicy: $shopPolicy) {
    shopPolicy { type title url updatedAt }
    userErrors { field message }
  }
}`;

for (const [type, body] of updates) {
  const data = await gql(mutation, { shopPolicy: { type, body } });
  const result = data.shopPolicyUpdate;
  if (result.userErrors?.length) {
    console.error("FAILED", type, result.userErrors);
    process.exitCode = 1;
    continue;
  }
  const p = result.shopPolicy;
  console.log(`OK ${type}: ${p.title} → ${p.url}`);
}

const after = await gql(`{ shop { shopPolicies { type title url } } }`);
console.log("\nCurrent written policies:");
for (const p of after.shop.shopPolicies) {
  console.log(`- ${p.type}: ${p.title}`);
}
