#!/usr/bin/env node
/**
 * Quick Storefront wiring check (no secrets printed).
 * Usage: node --env-file=.env.local scripts/verify-storefront.mjs
 *
 * Keep API_VERSION in sync with lib/constants.ts SHOPIFY_STOREFRONT_API_VERSION.
 */
const API_VERSION = "2026-10";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !token) {
  console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  process.exit(1);
}

const endpoint = `https://${domain.replace(/^https?:\/\//, "")}/api/${API_VERSION}/graphql.json`;

async function shopify(query, variables) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    console.error("Storefront errors:", json.errors);
    process.exit(1);
  }
  return json.data;
}

const shopData = await shopify(`{
  shop { name }
  products(first: 5) {
    edges {
      node {
        handle
        title
        availableForSale
        variants(first: 1) {
          edges {
            node {
              id
              price { amount currencyCode }
            }
          }
        }
      }
    }
  }
}`);

const products = shopData.products.edges.map((e) => e.node);
console.log(
  `OK api=${API_VERSION} shop=${shopData.shop.name} products=${products.length}`,
);
for (const p of products) {
  const variant = p.variants.edges[0]?.node;
  const price = variant?.price
    ? `${variant.price.amount} ${variant.price.currencyCode}`
    : "n/a";
  console.log(` - ${p.handle} avail=${p.availableForSale} price=${price}`);
}

const cartData = await shopify(`mutation {
  cartCreate {
    cart { id checkoutUrl totalQuantity }
    userErrors { field message }
  }
}`);

const cart = cartData.cartCreate?.cart;
const cartErrors = cartData.cartCreate?.userErrors ?? [];
if (cartErrors.length || !cart?.checkoutUrl) {
  console.error("cartCreate failed", cartData.cartCreate);
  process.exit(1);
}
console.log(
  `OK cart created totalQuantity=${cart.totalQuantity} checkoutUrlHost=${new URL(cart.checkoutUrl).host}`,
);

const firstVariantId = products[0]?.variants.edges[0]?.node?.id;
if (firstVariantId) {
  const addData = await shopify(
    `mutation add($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          totalQuantity
          cost { totalAmount { amount currencyCode } }
        }
        userErrors { field message }
      }
    }`,
    {
      cartId: cart.id,
      lines: [{ merchandiseId: firstVariantId, quantity: 1 }],
    },
  );
  const added = addData.cartLinesAdd?.cart;
  const addErrors = addData.cartLinesAdd?.userErrors ?? [];
  if (addErrors.length || !added) {
    console.error("cartLinesAdd failed", addData.cartLinesAdd);
    process.exit(1);
  }
  console.log(
    `OK cartLinesAdd totalQuantity=${added.totalQuantity} total=${added.cost.totalAmount.amount} ${added.cost.totalAmount.currencyCode}`,
  );
}

console.log("Storefront API bump check passed.");
