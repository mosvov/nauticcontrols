#!/usr/bin/env node
/**
 * Quick Storefront wiring check (no secrets printed).
 * Usage: node --env-file=.env.local scripts/verify-storefront.mjs
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !token) {
  console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  process.exit(1);
}

const endpoint = `https://${domain.replace(/^https?:\/\//, "")}/api/2023-01/graphql.json`;

const res = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": token,
  },
  body: JSON.stringify({
    query: `{
      shop { name }
      products(first: 5) {
        edges { node { handle title availableForSale } }
      }
    }`,
  }),
});

const json = await res.json();
if (json.errors) {
  console.error("Storefront errors:", json.errors);
  process.exit(1);
}

const products = json.data.products.edges.map((e) => e.node);
console.log(`OK shop=${json.data.shop.name} products=${products.length}`);
for (const p of products) {
  console.log(` - ${p.handle} avail=${p.availableForSale}`);
}

const cartRes = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": token,
  },
  body: JSON.stringify({
    query: `mutation { cartCreate { cart { id checkoutUrl } userErrors { message } } }`,
  }),
});
const cartJson = await cartRes.json();
const cart = cartJson.data?.cartCreate?.cart;
if (!cart?.checkoutUrl) {
  console.error("cartCreate failed", cartJson);
  process.exit(1);
}
console.log(`OK cart created checkoutUrlHost=${new URL(cart.checkoutUrl).host}`);
