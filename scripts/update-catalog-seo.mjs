#!/usr/bin/env node
/**
 * Phase C catalog SEO polish for the live store:
 * - Collection SEO title/description + short HTML intros
 * - Tighter product SEO titles/descriptions (intent keywords + US stock)
 * - Descriptive alt text on product media
 *
 * Requires `.env.live.local` with SHOPIFY_SHOP, SHOPIFY_CLIENT_ID,
 * SHOPIFY_CLIENT_SECRET.
 *
 * Usage:
 *   node scripts/update-catalog-seo.mjs
 *   node scripts/update-catalog-seo.mjs --dry-run
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const API_VERSION = "2025-10";
const DRY = process.argv.includes("--dry-run");

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

async function adminGql(query, variables = {}) {
  const access = await getToken();
  const res = await fetch(
    `https://${SHOP}.myshopify.com/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": access,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(
      `GraphQL error: ${JSON.stringify(json.errors || json, null, 2)}`,
    );
  }
  return json.data;
}

const COLLECTIONS = {
  kits: {
    seoTitle: "Signal K Kits US Stock",
    seoDescription:
      "DIY Signal K gateway and engine monitoring kits with enclosure and connectors. Ships from the US. Free ground shipping $75+.",
    descriptionHtml:
      "<p>Ready-to-assemble Signal K / NMEA 2000 kits with board, enclosure, and connectors. Ships from the US.</p>",
  },
  "development-boards": {
    seoTitle: "Marine Dev Boards US Stock",
    seoDescription:
      "SH-ESP32, HALMET, and SH-RPi boards for Signal K and NMEA 2000 DIY installs. US stock, USD checkout.",
    descriptionHtml:
      "<p>Bare Hat Labs development boards for marine and RV Signal K builds. Pair with enclosures and connectors from Accessories.</p>",
  },
  "marine-computers": {
    seoTitle: "Marine Computers US Stock",
    seoDescription:
      "HALPI2 Raspberry Pi CM5 marine computers with NMEA 2000 and Signal K. US stock.",
    descriptionHtml:
      "<p>Factory-assembled marine computers for Signal K, AvNav, and open chartplotter stacks. Ships from the US.</p>",
  },
  accessories: {
    seoTitle: "Marine Enclosures and Connectors",
    seoDescription:
      "Waterproof enclosures, SP13 power pigtails, and NMEA 2000 panel connectors. US stock.",
    descriptionHtml:
      "<p>Enclosures and connectors to finish a kit or board install. Ships from the US.</p>",
  },
  "nmea-2000": {
    seoTitle: "NMEA 2000 Gear US Stock",
    seoDescription:
      "NMEA 2000 boards, kits, and Micro-C panel connectors for boat networks. Ships from the US.",
    descriptionHtml:
      "<p>Hardware that talks to or mounts on an NMEA 2000 backbone: kits, boards, and Micro-C connectors.</p>",
  },
};

const PRODUCT_SEO = {
  "signal-k-gateway-kit": {
    seoTitle: "Signal K Gateway Kit US Stock",
    seoDescription:
      "SH-ESP32 DIY Signal K / NMEA 2000 gateway kit with enclosure and M12 connector. Ships from the US.",
    featuredAlt: "Signal K Gateway Kit with SH-ESP32 board, enclosure, and NMEA 2000 M12 connector",
  },
  "engine-monitoring-kit": {
    seoTitle: "Engine Monitoring Kit US Stock",
    seoDescription:
      "HALMET DIY engine and tank monitoring kit with enclosure and SP13 power. Ships from the US.",
    featuredAlt: "Engine Monitoring Kit with HALMET board, waterproof enclosure, and SP13 power connector",
  },
  "sh-esp32": {
    seoTitle: "SH-ESP32 Board NMEA 2000 US Stock",
    seoDescription:
      "Hat Labs SH-ESP32 development board with isolated NMEA 2000 CAN for Signal K sensors. Ships from the US.",
    featuredAlt: "Hat Labs SH-ESP32 development board with NMEA 2000 CAN terminals",
  },
  halmet: {
    seoTitle: "HALMET Engine Tank Board US Stock",
    seoDescription:
      "Hat Labs HALMET board for analog engine and tank inputs to NMEA 2000 / Signal K. Ships from the US.",
    featuredAlt: "Hat Labs HALMET engine and tank interface board with screw terminals",
  },
  "sh-rpi": {
    seoTitle: "SH-RPi Sailor Hat US Stock",
    seoDescription:
      "Hat Labs SH-RPi power-management HAT with supercap safe shutdown for Raspberry Pi. Ships from the US.",
    featuredAlt: "Hat Labs SH-RPi Sailor Hat power management board for Raspberry Pi",
  },
  "halpi2-4gb-256": {
    seoTitle: "HALPI2 Marine Computer US Stock",
    seoDescription:
      "HALPI2 CM5 marine computer, 4GB/256GB, NMEA 2000 and Signal K ready. Ships from the US.",
    featuredAlt: "HALPI2 marine computer in aluminum enclosure with NMEA 2000 and Ethernet ports",
  },
  "enclosure-pw100": {
    seoTitle: "Waterproof Enclosure PW100 US Stock",
    seoDescription:
      "100x68x50 mm waterproof enclosure with flanges for SH-ESP32 gateway installs. Ships from the US.",
    featuredAlt: "Waterproof plastic enclosure 100x68x50 mm with mounting flanges for SH-ESP32",
  },
  "enclosure-pw158": {
    seoTitle: "Waterproof Enclosure PW158 US Stock",
    seoDescription:
      "158x90x60 mm waterproof enclosure with pre-drilled holes for HALMET installs. Ships from the US.",
    featuredAlt: "Waterproof plastic enclosure 158x90x60 mm sized for HALMET engine kits",
  },
  "n2k-m12-pigtail": {
    seoTitle: "NMEA 2000 M12 Panel Connector US Stock",
    seoDescription:
      "NMEA 2000 Micro-C male panel connector with pigtail wires. IP67. Ships from the US.",
    featuredAlt: "NMEA 2000 M12 Micro-C male panel connector with wire pigtails",
  },
  "sp13-cf2-pigtail": {
    seoTitle: "SP13 2-Pin Power Pigtail US Stock",
    seoDescription:
      "SP13 2-pin power pigtail connector pair for marine enclosure power feeds. Ships from the US.",
    featuredAlt: "SP13 2-pin power pigtail connector pair for marine enclosure installs",
  },
  "sp13-cf5-pigtail": {
    seoTitle: "SP13 5-Pin Female Pigtail US Stock",
    seoDescription:
      "SP13 5-pin female pigtail connector pair for marine sensor cabling. Ships from the US.",
    featuredAlt: "SP13 5-pin female cable plug pigtail connector pair",
  },
  "sp13-cm4-pigtail": {
    seoTitle: "SP13 4-Pin Male Pigtail US Stock",
    seoDescription:
      "SP13 4-pin male pigtail connector pair for marine sensor cabling. Ships from the US.",
    featuredAlt: "SP13 4-pin male cable plug pigtail connector pair",
  },
};

async function updateCollections() {
  const data = await adminGql(`{
    collections(first: 50) {
      nodes { id handle title description seo { title description } }
    }
  }`);

  for (const col of data.collections.nodes) {
    const next = COLLECTIONS[col.handle];
    if (!next) continue;

    console.log(`Collection ${col.handle}`);
    console.log(`  was: ${col.seo?.title || "(none)"}`);
    console.log(`  now: ${next.seoTitle}`);

    if (DRY) continue;

    const result = await adminGql(
      `mutation ($input: CollectionInput!) {
        collectionUpdate(input: $input) {
          collection { id handle seo { title description } }
          userErrors { field message }
        }
      }`,
      {
        input: {
          id: col.id,
          descriptionHtml: next.descriptionHtml,
          seo: {
            title: next.seoTitle,
            description: next.seoDescription,
          },
        },
      },
    );
    const errs = result.collectionUpdate.userErrors;
    if (errs?.length) {
      throw new Error(`collectionUpdate ${col.handle}: ${JSON.stringify(errs)}`);
    }
  }
}

async function updateProducts() {
  const data = await adminGql(`{
    products(first: 50) {
      nodes {
        id
        handle
        title
        seo { title description }
        media(first: 20) {
          nodes {
            ... on MediaImage {
              id
              alt
              image { url }
            }
          }
        }
      }
    }
  }`);

  for (const product of data.products.nodes) {
    const next = PRODUCT_SEO[product.handle];
    if (!next) {
      console.log(`Skip product (no SEO map): ${product.handle}`);
      continue;
    }

    console.log(`Product ${product.handle}`);
    console.log(`  was: ${product.seo?.title || "(none)"}`);
    console.log(`  now: ${next.seoTitle}`);

    if (DRY) continue;

    const result = await adminGql(
      `mutation ($input: ProductInput!) {
        productUpdate(input: $input) {
          product { id handle seo { title description } }
          userErrors { field message }
        }
      }`,
      {
        input: {
          id: product.id,
          seo: {
            title: next.seoTitle,
            description: next.seoDescription,
          },
        },
      },
    );
    const errs = result.productUpdate.userErrors;
    if (errs?.length) {
      throw new Error(`productUpdate ${product.handle}: ${JSON.stringify(errs)}`);
    }

    const mediaNodes = product.media.nodes.filter((m) => m?.id);
    if (!mediaNodes.length) continue;

    const mediaUpdates = mediaNodes.map((media, index) => {
      let alt = `${product.title} product photo ${index + 1}`;
      if (index === 0 && next.featuredAlt) alt = next.featuredAlt;
      else if (product.handle.includes("enclosure")) {
        alt = `${product.title} waterproof enclosure view ${index + 1}`;
      } else if (product.handle.includes("pigtail") || product.handle.includes("m12")) {
        alt = `${product.title} connector detail ${index + 1}`;
      } else if (index > 0) {
        alt = `${product.title} install detail ${index + 1}`;
      }
      return { id: media.id, alt };
    });

    const mediaResult = await adminGql(
      `mutation ($productId: ID!, $media: [UpdateMediaInput!]!) {
        productUpdateMedia(productId: $productId, media: $media) {
          media { ... on MediaImage { id alt } }
          mediaUserErrors { field message code }
        }
      }`,
      { productId: product.id, media: mediaUpdates },
    );
    const mediaErrs = mediaResult.productUpdateMedia.mediaUserErrors;
    if (mediaErrs?.length) {
      throw new Error(
        `productUpdateMedia ${product.handle}: ${JSON.stringify(mediaErrs)}`,
      );
    }
    console.log(`  alts: ${mediaUpdates.length} media updated`);
  }
}

async function main() {
  console.log(`Shop: ${SHOP}${DRY ? " (dry-run)" : ""}`);
  await updateCollections();
  await updateProducts();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
