#!/usr/bin/env node
/**
 * One-shot Admin API setup for nautic-controls-bh11vkhs.
 * Reads .env.live.local (client credentials). Never prints secrets/tokens.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const API_VERSION = "2025-10";

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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (inQuotes) {
      if (c === '"' && n === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cell += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || (c === "\r" && n === "\n")) {
      if (c === "\r") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (c !== "\r") {
      cell += c;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [header, ...data] = rows.filter((r) => r.some((x) => x.trim()));
  return data.map((r) =>
    Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])),
  );
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

function userErrors(path, payload) {
  const errs = payload?.userErrors || payload?.userErrors === undefined
    ? Object.values(payload || {}).find((v) => v?.userErrors)?.userErrors
    : [];
  // normalize
  const ue =
    payload?.userErrors ||
    (payload && typeof payload === "object"
      ? Object.values(payload).flatMap((v) =>
          v && typeof v === "object" && Array.isArray(v.userErrors)
            ? v.userErrors
            : [],
        )
      : []);
  if (ue?.length) {
    throw new Error(`${path}: ${JSON.stringify(ue)}`);
  }
}

async function ensureFloridaLocation() {
  const data = await gql(`{
    locations(first: 50) {
      nodes { id name isActive fulfillsOnlineOrders }
    }
  }`);
  let florida = data.locations.nodes.find((l) => l.name === "Florida Warehouse");
  if (!florida) {
    const created = await gql(
      `mutation ($input: LocationAddInput!) {
        locationAdd(input: $input) {
          location { id name }
          userErrors { field message }
        }
      }`,
      {
        input: {
          name: "Florida Warehouse",
          address: {
            countryCode: "US",
            provinceCode: "FL",
            city: "Tampa",
            zip: "33602",
          },
          fulfillsOnlineOrders: true,
        },
      },
    );
    if (created.locationAdd.userErrors?.length) {
      throw new Error(JSON.stringify(created.locationAdd.userErrors));
    }
    florida = created.locationAdd.location;
    console.log("Created location:", florida.name, florida.id);
  } else {
    console.log("Location exists:", florida.name, florida.id);
  }

  const shopLoc = data.locations.nodes.find((l) => l.name === "Shop location");
  if (shopLoc?.fulfillsOnlineOrders) {
    const upd = await gql(
      `mutation ($id: ID!, $input: LocationEditInput!) {
        locationEdit(id: $id, input: $input) {
          location { id name fulfillsOnlineOrders }
          userErrors { field message }
        }
      }`,
      {
        id: shopLoc.id,
        input: { fulfillsOnlineOrders: false },
      },
    );
    if (upd.locationEdit.userErrors?.length) {
      console.warn("Shop location edit:", upd.locationEdit.userErrors);
    } else {
      console.log("Disabled online fulfillment on Shop location");
    }
  }
  return florida.id;
}

async function ensurePages() {
  const handles = [
    "shipping",
    "returns",
    "about",
    "fcc",
    "privacy",
    "terms",
  ];
  const titles = {
    shipping: "Shipping",
    returns: "Returns & Warranty",
    about: "About",
    fcc: "FCC / Responsible Party",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  };
  const existing = await gql(`{
    pages(first: 50) { nodes { id handle title } }
  }`);
  const byHandle = Object.fromEntries(
    existing.pages.nodes.map((p) => [p.handle, p]),
  );
  for (const handle of handles) {
    const bodyPath = resolve(root, `docs/policy-pages/${handle}.html`);
    const body = readFileSync(bodyPath, "utf8");
    if (byHandle[handle]) {
      console.log("Page exists:", handle);
      continue;
    }
    const res = await gql(
      `mutation ($page: PageCreateInput!) {
        pageCreate(page: $page) {
          page { id handle }
          userErrors { field message }
        }
      }`,
      {
        page: {
          title: titles[handle],
          handle,
          body,
          isPublished: true,
        },
      },
    );
    if (res.pageCreate.userErrors?.length) {
      throw new Error(JSON.stringify(res.pageCreate.userErrors));
    }
    console.log("Created page:", handle, res.pageCreate.page.id);
  }
}

async function ensureMenus() {
  const existing = await gql(`{
    menus(first: 50) { nodes { id handle title } }
  }`);
  const byHandle = Object.fromEntries(
    existing.menus.nodes.map((m) => [m.handle, m]),
  );

  const pages = await gql(`{
    pages(first: 50) { nodes { id handle title } }
  }`);
  const pageByHandle = Object.fromEntries(
    pages.pages.nodes.map((p) => [p.handle, p]),
  );

  async function createMenu(title, handle, items) {
    if (byHandle[handle]) {
      console.log("Menu exists:", handle);
      return byHandle[handle].id;
    }
    const res = await gql(
      `mutation ($title: String!, $handle: String!, $items: [MenuItemCreateInput!]!) {
        menuCreate(title: $title, handle: $handle, items: $items) {
          menu { id handle }
          userErrors { field message }
        }
      }`,
      { title, handle, items },
    );
    if (res.menuCreate.userErrors?.length) {
      throw new Error(JSON.stringify(res.menuCreate.userErrors));
    }
    console.log("Created menu:", handle, res.menuCreate.menu.id);
    return res.menuCreate.menu.id;
  }

  await createMenu("Next.js Frontend Header Menu", "next-js-frontend-header-menu", [
    {
      title: "Shop",
      type: "COLLECTION",
      resourceId: null, // filled after collections — use FRONTPAGE/HTTP for now
      url: "/search",
    },
  ].map((item) => ({
    title: item.title,
    type: "HTTP",
    url: item.url,
  })));

  const footerItems = ["shipping", "returns", "about", "privacy", "terms"]
    .filter((h) => pageByHandle[h])
    .map((h) => ({
      title: pageByHandle[h].title,
      type: "PAGE",
      resourceId: pageByHandle[h].id,
    }));

  await createMenu(
    "Next.js Frontend Footer Menu",
    "next-js-frontend-footer-menu",
    footerItems,
  );
}

async function ensureCollections(productIdsByHandle) {
  const existing = await gql(`{
    collections(first: 50) { nodes { id title handle } }
  }`);
  const byTitle = Object.fromEntries(
    existing.collections.nodes.map((c) => [c.title, c]),
  );

  async function ensureManual(title, handles) {
    let col = byTitle[title];
    if (!col) {
      const res = await gql(
        `mutation ($input: CollectionInput!) {
          collectionCreate(input: $input) {
            collection { id title handle }
            userErrors { field message }
          }
        }`,
        {
          input: {
            title,
            products: handles
              .map((h) => productIdsByHandle[h])
              .filter(Boolean),
          },
        },
      );
      if (res.collectionCreate.userErrors?.length) {
        throw new Error(JSON.stringify(res.collectionCreate.userErrors));
      }
      col = res.collectionCreate.collection;
      console.log("Created collection:", title, col.id);
    } else {
      console.log("Collection exists:", title);
      const ids = handles.map((h) => productIdsByHandle[h]).filter(Boolean);
      if (ids.length) {
        const add = await gql(
          `mutation ($id: ID!, $productIds: [ID!]!) {
            collectionAddProducts(id: $id, productIds: $productIds) {
              userErrors { field message }
            }
          }`,
          { id: col.id, productIds: ids },
        );
        if (add.collectionAddProducts.userErrors?.length) {
          console.warn(add.collectionAddProducts.userErrors);
        } else {
          console.log("  synced products into", title);
        }
      }
    }
    return col.id;
  }

  await ensureManual("Hidden: Homepage Featured Items", [
    "signal-k-gateway-kit",
    "engine-monitoring-kit",
  ]);
  await ensureManual("Hidden: Homepage Carousel", [
    "signal-k-gateway-kit",
    "engine-monitoring-kit",
    "sh-esp32",
    "halmet",
    "sh-rpi",
    "halpi2-4gb-256",
  ]);
}

async function ensureProducts() {
  const csv = parseCsv(
    readFileSync(resolve(root, "docs/shopify-catalog-seed.csv"), "utf8"),
  );
  const existing = await gql(`{
    products(first: 100) { nodes { id handle title } }
  }`);
  const byHandle = Object.fromEntries(
    existing.products.nodes.map((p) => [p.handle, p]),
  );
  const out = { ...byHandle };

  for (const row of csv) {
    const handle = row.Handle;
    if (!handle) continue;
    if (byHandle[handle]) {
      console.log("Product exists:", handle);
      out[handle] = byHandle[handle];
      continue;
    }
    const tags = (row.Tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const status = (row.Status || "draft").toUpperCase();
    const res = await gql(
      `mutation ($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
        productCreate(product: $product, media: $media) {
          product {
            id
            handle
            variants(first: 1) {
              nodes { id inventoryItem { id } }
            }
          }
          userErrors { field message }
        }
      }`,
      {
        product: {
          title: row.Title,
          handle,
          vendor: row.Vendor || "Nautic Controls",
          productType: row.Type || undefined,
          tags,
          status: status === "ACTIVE" ? "ACTIVE" : "DRAFT",
          descriptionHtml: row["SEO Description"]
            ? `<p>${row["SEO Description"]}</p>`
            : undefined,
          seo: {
            title: row["SEO Title"] || undefined,
            description: row["SEO Description"] || undefined,
          },
        },
        media: row["Image Src"]
          ? [
              {
                originalSource: row["Image Src"],
                mediaContentType: "IMAGE",
                alt: row.Title,
              },
            ]
          : undefined,
      },
    );
    if (res.productCreate.userErrors?.length) {
      throw new Error(
        `${handle}: ${JSON.stringify(res.productCreate.userErrors)}`,
      );
    }
    const product = res.productCreate.product;
    console.log("Created product:", handle, product.id);

    const variantId = product.variants.nodes[0]?.id;
    if (variantId) {
      const price = row["Variant Price"] || "0";
      const sku = row["Variant SKU"] || undefined;
      const cost = row["Cost per item"] || undefined;
      const vres = await gql(
        `mutation ($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) {
            productVariants { id sku }
            userErrors { field message }
          }
        }`,
        {
          productId: product.id,
          variants: [
            {
              id: variantId,
              price,
              inventoryItem: {
                sku,
                tracked: true,
                ...(cost
                  ? { cost: cost, requiresShipping: true }
                  : { requiresShipping: true }),
              },
            },
          ],
        },
      );
      if (vres.productVariantsBulkUpdate.userErrors?.length) {
        console.warn(handle, vres.productVariantsBulkUpdate.userErrors);
      }
    }
    out[handle] = product;
  }
  return Object.fromEntries(
    Object.entries(out).map(([h, p]) => [h, p.id]),
  );
}

async function configureShipping(floridaLocationId) {
  const data = await gql(`{
    deliveryProfiles(first: 5) {
      nodes {
        id
        name
        default
        profileLocationGroups {
          locationGroup { id }
          locationGroupZones(first: 20) {
            edges {
              node {
                zone { id name }
                methodDefinitions(first: 20) {
                  edges {
                    node {
                      id
                      name
                      active
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`);
  const general = data.deliveryProfiles.nodes.find((p) => p.default);
  if (!general) {
    console.warn("No default delivery profile found");
    return;
  }
  console.log(
    "Default delivery profile:",
    general.id,
    "- configure US rates in Admin if API update is limited",
  );
  console.log(
    "  Tip: Settings → Shipping → Contiguous US: $9.95 under $75, free $75+",
  );
  console.log("  Origin location should be Florida Warehouse:", floridaLocationId);
}

async function main() {
  console.log("Shop:", SHOP);
  const floridaId = await ensureFloridaLocation();
  const productIds = await ensureProducts();
  await ensureCollections(productIds);
  await ensurePages();
  await ensureMenus();
  await configureShipping(floridaId);

  const pubs = await gql(`{
    publications(first: 20) { nodes { id name } }
  }`);
  const headless = pubs.publications.nodes.find((p) =>
    /headless/i.test(p.name),
  );
  if (!headless) {
    console.log(
      "\nACTION REQUIRED: Install Headless sales channel in Admin (Sales channels → Headless), then publish products/pages to it and create Storefront tokens.",
    );
  } else {
    console.log("Headless publication:", headless.id);
  }
  console.log("\nDone with API-automatable setup.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
