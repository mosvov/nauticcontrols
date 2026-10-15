#!/usr/bin/env node
/**
 * Upload Nautic Controls brand files to Shopify Files and (optionally) apply
 * checkout branding. Brand kit fields (Settings → General → Branding) have no
 * public write API — paste values from the printed checklist in Admin.
 *
 * Requires `.env.live.local` with SHOPIFY_SHOP, SHOPIFY_CLIENT_ID,
 * SHOPIFY_CLIENT_SECRET, and SHOPIFY_STOREFRONT_ACCESS_TOKEN.
 *
 * Checkout branding needs scopes:
 *   read_checkout_branding_settings, write_checkout_branding_settings
 * Add them on the custom app, then re-run with --checkout.
 *
 * Usage:
 *   node scripts/apply-brand-assets.mjs
 *   node scripts/apply-brand-assets.mjs --checkout
 *   node scripts/apply-brand-assets.mjs --verify
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const API_VERSION = "2025-10";

const BRAND = {
  slogan: "US stock marine and RV electronics for Signal K and NMEA 2000.",
  shortDescription:
    "Marine and RV electronics: Signal K kits, boards, HALPI2, and NMEA 2000 parts. US stock. Free ground shipping $75+.",
  colors: {
    primary: { background: "#2F6FED", foreground: "#FFFFFF" },
    secondary: { background: "#1A2330", foreground: "#FFFFFF" },
    secondaryShelf: { background: "#F5F7FA", foreground: "#1A2330" },
  },
  logoFile: resolve(root, "public/images/logo.png"),
  coverFile: resolve(root, "public/images/brand/cover-1920x1080.jpg"),
  logoFilename: "nautic-controls-logo.png",
  coverFilename: "nautic-controls-brand-cover.jpg",
  brandingAdminUrl:
    "https://admin.shopify.com/store/nautic-controls-bh11vkhs/settings/general/branding",
  checkoutAdminUrl:
    "https://admin.shopify.com/store/nautic-controls-bh11vkhs/settings/checkout",
  notificationsAdminUrl:
    "https://admin.shopify.com/store/nautic-controls-bh11vkhs/settings/notifications",
};

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

const env = loadEnv(resolve(root, ".env.live.local"));
const SHOP = env.SHOPIFY_SHOP;
const CLIENT_ID = env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = env.SHOPIFY_CLIENT_SECRET;
const SF_TOKEN = env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
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
    const err = new Error(json.errors.map((e) => e.message).join("; "));
    err.graphqlErrors = json.errors;
    throw err;
  }
  return json.data;
}

async function sfGql(query) {
  if (!SF_TOKEN) return null;
  const res = await fetch(
    `https://${SHOP}.myshopify.com/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SF_TOKEN,
      },
      body: JSON.stringify({ query }),
    },
  );
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json.data;
}

async function findFileByFilename(filename) {
  const data = await gql(`{
    files(first: 10, query: "filename:${filename}", sortKey: CREATED_AT, reverse: true) {
      nodes {
        ... on MediaImage {
          id
          alt
          fileStatus
          image { url width height }
        }
      }
    }
  }`);
  return data.files.nodes.find((n) => n?.image) || data.files.nodes[0] || null;
}

async function uploadLocalFile(filePath, mimeType, filename, alt) {
  const existing = await findFileByFilename(filename);
  if (existing?.fileStatus === "READY" && existing.image) {
    console.log(`  reuse ${filename} (${existing.image.width}x${existing.image.height})`);
    return existing;
  }

  const buf = readFileSync(filePath);
  const staged = await gql(
    `mutation($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets { url resourceUrl parameters { name value } }
        userErrors { field message }
      }
    }`,
    {
      input: [
        {
          filename,
          mimeType,
          httpMethod: "POST",
          resource: "FILE",
          fileSize: String(buf.length),
        },
      ],
    },
  );
  if (staged.stagedUploadsCreate.userErrors?.length) {
    throw new Error(JSON.stringify(staged.stagedUploadsCreate.userErrors));
  }
  const target = staged.stagedUploadsCreate.stagedTargets[0];
  const form = new FormData();
  for (const p of target.parameters) form.append(p.name, p.value);
  form.append("file", new Blob([buf], { type: mimeType }), filename);
  const up = await fetch(target.url, { method: "POST", body: form });
  if (!up.ok) throw new Error(`upload HTTP ${up.status}: ${await up.text()}`);

  const created = await gql(
    `mutation($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          id
          fileStatus
          alt
          ... on MediaImage { image { url width height } }
        }
        userErrors { field message }
      }
    }`,
    {
      files: [
        {
          originalSource: target.resourceUrl,
          contentType: "IMAGE",
          filename,
          alt,
          duplicateResolutionMode: "REPLACE",
        },
      ],
    },
  );
  if (created.fileCreate.userErrors?.length) {
    throw new Error(JSON.stringify(created.fileCreate.userErrors));
  }

  for (let i = 0; i < 12; i++) {
    const file = await findFileByFilename(filename);
    if (file?.fileStatus === "READY" && file.image) return file;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return created.fileCreate.files[0];
}

function printAdminChecklist(logo, cover) {
  console.log(`
=== Brand kit (Admin UI — no public write API) ===
Open: ${BRAND.brandingAdminUrl}

Logos (Content → Files already has these):
  Default logo:  ${BRAND.logoFilename}${logo?.image ? `  ${logo.image.url}` : ""}
  Square logo:   same file (638×638)

Colors:
  Primary:            ${BRAND.colors.primary.background}  contrast ${BRAND.colors.primary.foreground}
  Secondary:          ${BRAND.colors.secondary.background}  contrast ${BRAND.colors.secondary.foreground}
  Optional secondary: ${BRAND.colors.secondaryShelf.background}  contrast ${BRAND.colors.secondaryShelf.foreground}

Slogan (≤80):
  ${BRAND.slogan}

Description (≤150):
  ${BRAND.shortDescription}

Cover image:
  ${BRAND.coverFilename}${cover?.image ? `  ${cover.image.url}` : ""}

Social links: skip until accounts exist

=== Checkout ===
Open: ${BRAND.checkoutAdminUrl}
  Customize → apply logo + accent ${BRAND.colors.primary.background}
  Or: node scripts/apply-brand-assets.mjs --checkout
    (needs read/write_checkout_branding_settings on the custom app)

=== Notification emails ===
Open: ${BRAND.notificationsAdminUrl}
  After Brand kit is saved, confirm order emails show the logo.
  If blank: customize Customer notifications → logo = ${BRAND.logoFilename}
`);
}

async function verifyBrand() {
  const data = await sfGql(`{
    shop {
      name
      brand {
        slogan
        shortDescription
        logo { image { url width height } }
        squareLogo { image { url width height } }
        coverImage { image { url width height } }
        colors {
          primary { background foreground }
          secondary { background foreground }
        }
      }
    }
  }`);
  console.log("Storefront brand:", JSON.stringify(data?.shop?.brand, null, 2));
  const b = data?.shop?.brand;
  const filled = Boolean(
    b?.slogan ||
      b?.shortDescription ||
      b?.logo?.image ||
      b?.squareLogo?.image ||
      b?.coverImage?.image ||
      (b?.colors?.primary?.length ?? 0) > 0,
  );
  if (!filled) {
    console.log(
      "Brand kit still empty on Storefront API. Fill Settings → Branding in Admin, then re-run --verify.",
    );
  } else {
    console.log("Brand kit is populated.");
  }
  return filled;
}

async function applyCheckoutBranding(logoMediaImageId) {
  const profiles = await gql(`{
    checkoutProfiles(first: 5) {
      nodes { id name isPublished }
    }
  }`);
  const published =
    profiles.checkoutProfiles.nodes.find((n) => n.isPublished) ||
    profiles.checkoutProfiles.nodes[0];
  if (!published) throw new Error("No checkout profile found");
  console.log(`Checkout profile: ${published.name} (${published.id})`);

  const accent = BRAND.colors.primary.background;
  const ink = BRAND.colors.secondary.background;
  const shelf = BRAND.colors.secondaryShelf.background;
  const line = "#DDE3EB";
  const white = "#FFFFFF";

  const input = {
    designSystem: {
      colors: {
        global: {
          accent,
          brand: ink,
        },
        schemes: {
          scheme1: {
            base: {
              background: shelf,
              text: ink,
              accent,
              border: line,
            },
            control: {
              background: white,
              border: line,
              text: ink,
              accent,
            },
            primaryButton: {
              background: accent,
              text: white,
              border: accent,
              accent: white,
              hover: {
                background: "#2560D4",
                text: white,
                border: "#2560D4",
              },
            },
            secondaryButton: {
              background: white,
              text: ink,
              border: line,
              accent,
            },
          },
        },
      },
      cornerRadius: { base: 6, large: 8, small: 4 },
    },
    customizations: {
      primaryButton: { cornerRadius: "BASE" },
    },
  };

  if (logoMediaImageId) {
    input.customizations.header = {
      logo: {
        image: { mediaImageId: logoMediaImageId },
        maxWidth: 120,
      },
    };
  }

  try {
    const result = await gql(
      `mutation($id: ID!, $input: CheckoutBrandingInput!) {
        checkoutBrandingUpsert(checkoutProfileId: $id, checkoutBrandingInput: $input) {
          checkoutBranding {
            designSystem {
              colors {
                global { accent brand }
              }
            }
            customizations {
              header {
                logo {
                  image { id }
                  maxWidth
                }
              }
            }
          }
          userErrors { field message code }
        }
      }`,
      { id: published.id, input },
    );
    const errors = result.checkoutBrandingUpsert.userErrors;
    if (errors?.length) {
      console.error("Checkout branding userErrors:", errors);
      return false;
    }
    console.log("Checkout branding applied.");
    return true;
  } catch (e) {
    console.error("Checkout branding failed:", e.message);
    console.error(
      "Add scopes read_checkout_branding_settings + write_checkout_branding_settings to the custom app, reinstall/approve, then retry --checkout.",
    );
    console.error(`Or customize manually: ${BRAND.checkoutAdminUrl}`);
    return false;
  }
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const doCheckout = args.has("--checkout");
  const doVerifyOnly = args.has("--verify");

  console.log("Shop:", SHOP);

  if (doVerifyOnly) {
    await verifyBrand();
    return;
  }

  if (!existsSync(BRAND.logoFile)) throw new Error(`Missing ${BRAND.logoFile}`);
  if (!existsSync(BRAND.coverFile)) {
    throw new Error(
      `Missing ${BRAND.coverFile}. Generate cover first (see docs/admin-setup-checklist.md § I).`,
    );
  }

  console.log("Uploading brand files…");
  const logo = await uploadLocalFile(
    BRAND.logoFile,
    "image/png",
    BRAND.logoFilename,
    "Nautic Controls logo",
  );
  const cover = await uploadLocalFile(
    BRAND.coverFile,
    "image/jpeg",
    BRAND.coverFilename,
    "Nautic Controls brand cover — HALPI2 on shelf",
  );

  printAdminChecklist(logo, cover);

  if (doCheckout) {
    await applyCheckoutBranding(logo.id);
  }

  await verifyBrand();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
