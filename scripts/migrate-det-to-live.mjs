#!/usr/bin/env node
/**
 * Dump det store catalog/inventory/metafields and upsert onto live Client-transfer store.
 * Tokens via env or /tmp/{det,live}_token.txt from a prior auth step.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const API = "2025-10";
const DET = "dev-store-749237498237499137";
const LIVE = "nautic-controls-bh11vkhs";

function loadEnv(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1);
    out[t.slice(0, i).trim()] = v;
  }
  return out;
}

async function clientToken(shop, clientId, clientSecret) {
  const res = await fetch(`https://${shop}.myshopify.com/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!res.ok) throw new Error(`token ${shop} HTTP ${res.status}`);
  return (await res.json()).access_token;
}

function makeGql(shop, getToken) {
  return async function gql(query, variables = {}) {
    const res = await fetch(
      `https://${shop}.myshopify.com/admin/api/${API}/graphql.json`,
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
      throw new Error(`${shop}: ${JSON.stringify(json.errors)}`);
    }
    return json.data;
  };
}

async function dumpProducts(gql) {
  const products = [];
  let cursor = null;
  for (;;) {
    const data = await gql(
      `query ($cursor: String) {
        products(first: 25, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            id handle title descriptionHtml vendor productType status tags
            seo { title description }
            featuredMedia { preview { image { url altText } } }
            media(first: 20) {
              nodes {
                ... on MediaImage {
                  alt
                  image { url }
                }
              }
            }
            metafields(first: 50) {
              nodes { namespace key type value }
            }
            variants(first: 20) {
              nodes {
                id sku price compareAtPrice
                inventoryPolicy
                inventoryQuantity
                inventoryItem {
                  id tracked
                  measurement { weight { value unit } }
                  unitCost { amount currencyCode }
                }
                selectedOptions { name value }
              }
            }
          }
        }
      }`,
      { cursor },
    );
    products.push(...data.products.nodes);
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }
  return products;
}

async function dumpInventory(gql) {
  const locs = await gql(`{
    locations(first: 20) {
      nodes { id name isActive }
    }
  }`);
  const levels = [];
  for (const loc of locs.locations.nodes) {
    let cursor = null;
    for (;;) {
      const data = await gql(
        `query ($id: ID!, $cursor: String) {
          location(id: $id) {
            id name
            inventoryLevels(first: 50, after: $cursor) {
              pageInfo { hasNextPage endCursor }
              nodes {
                quantities(names: ["available"]) { name quantity }
                item {
                  id
                  sku
                  variant { id product { handle } }
                }
              }
            }
          }
        }`,
        { id: loc.id, cursor },
      );
      for (const n of data.location.inventoryLevels.nodes) {
        const avail = n.quantities.find((q) => q.name === "available")?.quantity ?? 0;
        levels.push({
          locationName: data.location.name,
          locationId: data.location.id,
          inventoryItemId: n.item.id,
          sku: n.item.sku,
          handle: n.item.variant?.product?.handle,
          available: avail,
        });
      }
      if (!data.location.inventoryLevels.pageInfo.hasNextPage) break;
      cursor = data.location.inventoryLevels.pageInfo.endCursor;
    }
  }
  return { locations: locs.locations.nodes, levels };
}

async function dumpMetaDefinitions(gql) {
  const data = await gql(`{
    metafieldDefinitions(first: 100, ownerType: PRODUCT) {
      nodes {
        name namespace key type { name }
        description
      }
    }
  }`);
  return data.metafieldDefinitions.nodes;
}

async function ensureMetaDefinitions(gql, defs) {
  for (const d of defs) {
    const res = await gql(
      `mutation ($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) {
          createdDefinition { id namespace key }
          userErrors { field message code }
        }
      }`,
      {
        definition: {
          name: d.name,
          namespace: d.namespace,
          key: d.key,
          type: d.type.name,
          description: d.description || undefined,
          ownerType: "PRODUCT",
        },
      },
    );
    const errs = res.metafieldDefinitionCreate.userErrors || [];
    const taken = errs.some(
      (e) =>
        /taken|already|exists/i.test(e.message) ||
        e.code === "TAKEN",
    );
    if (errs.length && !taken) {
      console.warn("metafield def", d.namespace, d.key, errs);
    } else {
      console.log(
        "metafield def",
        d.namespace,
        d.key,
        taken ? "(exists)" : "created",
      );
    }
  }
}

async function upsertProduct(gql, p, liveByHandle) {
  const media = (p.media?.nodes || [])
    .filter((m) => m.image?.url)
    .map((m) => ({
      originalSource: m.image.url,
      mediaContentType: "IMAGE",
      alt: m.alt || p.title,
    }));

  const existing = liveByHandle[p.handle];
  let productId = existing?.id;

  if (!productId) {
    const res = await gql(
      `mutation ($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
        productCreate(product: $product, media: $media) {
          product { id handle variants(first: 5) { nodes { id inventoryItem { id } } } }
          userErrors { field message }
        }
      }`,
      {
        product: {
          title: p.title,
          handle: p.handle,
          descriptionHtml: p.descriptionHtml || undefined,
          vendor: p.vendor || undefined,
          productType: p.productType || undefined,
          tags: p.tags || [],
          status: p.status === "ACTIVE" ? "ACTIVE" : "DRAFT",
          seo: p.seo
            ? { title: p.seo.title, description: p.seo.description }
            : undefined,
        },
        media: media.length ? media : undefined,
      },
    );
    if (res.productCreate.userErrors?.length) {
      throw new Error(
        `create ${p.handle}: ${JSON.stringify(res.productCreate.userErrors)}`,
      );
    }
    productId = res.productCreate.product.id;
    liveByHandle[p.handle] = res.productCreate.product;
    console.log("created", p.handle);
  } else {
    const res = await gql(
      `mutation ($product: ProductUpdateInput!) {
        productUpdate(product: $product) {
          product { id handle }
          userErrors { field message }
        }
      }`,
      {
        product: {
          id: productId,
          title: p.title,
          descriptionHtml: p.descriptionHtml || undefined,
          vendor: p.vendor || undefined,
          productType: p.productType || undefined,
          tags: p.tags || [],
          status: p.status === "ACTIVE" ? "ACTIVE" : "ACTIVE",
          seo: p.seo
            ? { title: p.seo.title, description: p.seo.description }
            : undefined,
        },
      },
    );
    if (res.productUpdate.userErrors?.length) {
      console.warn("update", p.handle, res.productUpdate.userErrors);
    } else {
      console.log("updated", p.handle);
    }

    // Append missing media (best-effort: create if live has fewer)
    if (media.length) {
      await gql(
        `mutation ($productId: ID!, $media: [CreateMediaInput!]!) {
          productCreateMedia(productId: $productId, media: $media) {
            media { id }
            mediaUserErrors { message }
            userErrors { message }
          }
        }`,
        { productId, media },
      ).catch((e) => console.warn("media", p.handle, String(e).slice(0, 120)));
    }
  }

  // Refresh variants
  const live = await gql(
    `query ($id: ID!) {
      product(id: $id) {
        id
        variants(first: 20) {
          nodes { id sku inventoryItem { id } }
        }
      }
    }`,
    { id: productId },
  );
  const liveVariants = live.product.variants.nodes;
  const srcVariant = p.variants.nodes[0];
  const destVariant =
    liveVariants.find((v) => v.sku && v.sku === srcVariant?.sku) ||
    liveVariants[0];

  if (srcVariant && destVariant) {
    const cost = srcVariant.inventoryItem?.unitCost?.amount;
    const weight = srcVariant.inventoryItem?.measurement?.weight;
    await gql(
      `mutation ($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          userErrors { field message }
        }
      }`,
      {
        productId,
        variants: [
          {
            id: destVariant.id,
            price: srcVariant.price,
            compareAtPrice: srcVariant.compareAtPrice || undefined,
            inventoryPolicy: srcVariant.inventoryPolicy,
            inventoryItem: {
              sku: srcVariant.sku || undefined,
              tracked: true,
              ...(cost ? { cost } : {}),
              ...(weight
                ? {
                    measurement: {
                      weight: { value: weight.value, unit: weight.unit },
                    },
                  }
                : {}),
            },
          },
        ],
      },
    );
  }

  // Metafields
  const mfs = (p.metafields?.nodes || []).filter((m) => m.value);
  if (mfs.length) {
    const res = await gql(
      `mutation ($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors { field message }
        }
      }`,
      {
        metafields: mfs.map((m) => ({
          ownerId: productId,
          namespace: m.namespace,
          key: m.key,
          type: m.type,
          value: m.value,
        })),
      },
    );
    if (res.metafieldsSet.userErrors?.length) {
      console.warn("metafields", p.handle, res.metafieldsSet.userErrors);
    }
  }

  return {
    handle: p.handle,
    productId,
    inventoryItemId: destVariant?.inventoryItem?.id,
    sku: srcVariant?.sku,
  };
}

async function setInventory(gql, locationId, inventoryItemId, quantity) {
  // Activate stock at location first (required when item not yet stocked there)
  const act = await gql(
    `mutation ($inventoryItemId: ID!, $locationId: ID!, $available: Int) {
      inventoryActivate(inventoryItemId: $inventoryItemId, locationId: $locationId, available: $available) {
        userErrors { field message }
      }
    }`,
    { inventoryItemId, locationId, available: quantity },
  );
  const actErrs = act.inventoryActivate.userErrors || [];
  if (!actErrs.length) return;
  // Already stocked → set quantities
  const res = await gql(
    `mutation ($input: InventorySetQuantitiesInput!) {
      inventorySetQuantities(input: $input) {
        userErrors { field message }
      }
    }`,
    {
      input: {
        name: "available",
        reason: "correction",
        ignoreCompareQuantity: true,
        quantities: [
          {
            inventoryItemId,
            locationId,
            quantity,
          },
        ],
      },
    },
  );
  if (res.inventorySetQuantities.userErrors?.length) {
    throw new Error(JSON.stringify(res.inventorySetQuantities.userErrors));
  }
}

async function publishHeadless(gql, productIds) {
  const pubs = await gql(`{ publications(first: 20) { nodes { id name } } }`);
  const headless = pubs.publications.nodes.find((p) =>
    /headless/i.test(p.name),
  );
  if (!headless) {
    console.warn("No Headless publication on live");
    return;
  }
  for (const id of productIds) {
    await gql(
      `mutation ($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          userErrors { message }
        }
      }`,
      { id, input: [{ publicationId: headless.id }] },
    );
  }
  console.log("published", productIds.length, "products to", headless.name);
}

async function main() {
  const env = loadEnv(resolve(root, ".env.live.local"));
  const clientId = env.SHOPIFY_CLIENT_ID;
  const clientSecret = env.SHOPIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("missing client credentials");

  let detTok = existsSync("/tmp/det_token.txt")
    ? readFileSync("/tmp/det_token.txt", "utf8").trim()
    : "";
  let liveTok = existsSync("/tmp/live_token.txt")
    ? readFileSync("/tmp/live_token.txt", "utf8").trim()
    : "";
  if (!detTok) detTok = await clientToken(DET, clientId, clientSecret);
  if (!liveTok) liveTok = await clientToken(LIVE, clientId, clientSecret);

  const detGql = makeGql(DET, async () => detTok);
  const liveGql = makeGql(LIVE, async () => liveTok);

  console.log("Dumping det…");
  const products = await dumpProducts(detGql);
  const inventory = await dumpInventory(detGql);
  const metaDefs = await dumpMetaDefinitions(detGql);
  const dumpDir = resolve(root, "docs/exports");
  mkdirSync(dumpDir, { recursive: true });
  const dumpPath = resolve(dumpDir, "det-dump.json");
  writeFileSync(
    dumpPath,
    JSON.stringify(
      {
        dumpedAt: new Date().toISOString(),
        shop: DET,
        products,
        inventory,
        metaDefs,
      },
      null,
      2,
    ),
  );
  console.log(
    `Dumped ${products.length} products, ${inventory.levels.length} inventory rows → ${dumpPath}`,
  );

  // Planned qty fallback from seed
  const seed = readFileSync(resolve(root, "docs/shopify-catalog-seed.csv"), "utf8");
  const planned = {};
  for (const line of seed.split("\n").slice(1)) {
    if (!line.trim()) continue;
    // naive CSV split enough for our seed (no commas in fields that matter at end)
    const cols = line.split(",");
    const handle = cols[0];
    const sku = cols[8];
    const pq = cols[cols.length - 1]?.trim();
    if (handle && sku) planned[sku] = Number(pq || 0);
  }

  console.log("Ensuring metafield definitions on live…");
  await ensureMetaDefinitions(liveGql, metaDefs);

  const liveProducts = await dumpProducts(liveGql);
  const liveByHandle = Object.fromEntries(liveProducts.map((p) => [p.handle, p]));

  const locs = await liveGql(`{
    locations(first: 20) { nodes { id name } }
  }`);
  const florida = locs.locations.nodes.find((l) =>
    /florida/i.test(l.name),
  );
  if (!florida) throw new Error("Florida Warehouse missing on live");

  const mapped = [];
  for (const p of products) {
    // skip pure demo snowboard junk if any
    if (/snowboard|example|gift.?card/i.test(p.handle)) {
      console.log("skip demo", p.handle);
      continue;
    }
    const m = await upsertProduct(liveGql, p, liveByHandle);
    mapped.push(m);
  }

  await publishHeadless(
    liveGql,
    mapped.map((m) => m.productId),
  );

  // Inventory: prefer det Florida levels by SKU; else planned
  const detFloridaLevels = inventory.levels.filter((l) =>
    /florida/i.test(l.locationName),
  );
  const qtyBySku = {};
  for (const l of detFloridaLevels) {
    if (l.sku) qtyBySku[l.sku] = l.available;
  }
  // If det used another location name, take max available per sku
  if (!Object.keys(qtyBySku).length) {
    for (const l of inventory.levels) {
      if (!l.sku) continue;
      qtyBySku[l.sku] = Math.max(qtyBySku[l.sku] || 0, l.available);
    }
  }

  console.log("Setting inventory at", florida.name);
  for (const m of mapped) {
    if (!m.inventoryItemId || !m.sku) continue;
    let qty = qtyBySku[m.sku];
    if (qty == null || Number.isNaN(qty)) qty = planned[m.sku] ?? 0;
    await setInventory(liveGql, florida.id, m.inventoryItemId, Number(qty));
    console.log(`  ${m.sku} → ${qty}`);
  }

  console.log("\nMigration complete.");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
