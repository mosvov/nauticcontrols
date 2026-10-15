import { sendGAEvent } from "@next/third-parties/google";
import { analyticsConfig, hasGa } from "./config";
import type { AnalyticsProduct, CartAnalyticsPayload } from "./types";

function toItems(products: AnalyticsProduct[]) {
  return products.map((p) => ({
    item_id: p.variantId || p.productId,
    item_name: p.name,
    item_brand: p.brand,
    item_category: p.category,
    item_variant: p.variantId,
    price: Number(p.price),
    quantity: p.quantity ?? 1,
  }));
}

function valueOf(products: AnalyticsProduct[], fallback?: number): number {
  if (typeof fallback === "number") return fallback;
  return products.reduce(
    (sum, p) => sum + Number(p.price) * (p.quantity ?? 1),
    0,
  );
}

export function gaViewItem(product: AnalyticsProduct) {
  if (!hasGa()) return;
  sendGAEvent("event", "view_item", {
    currency: product.currency || analyticsConfig.currency,
    value: valueOf([product]),
    items: toItems([product]),
  });
}

export function gaAddToCart(payload: CartAnalyticsPayload) {
  if (!hasGa()) return;
  sendGAEvent("event", "add_to_cart", {
    currency: payload.currency || analyticsConfig.currency,
    value: valueOf(payload.products, payload.value),
    items: toItems(payload.products),
  });
}

export function gaBeginCheckout(payload: CartAnalyticsPayload) {
  if (!hasGa()) return;
  sendGAEvent("event", "begin_checkout", {
    currency: payload.currency || analyticsConfig.currency,
    value: valueOf(payload.products, payload.value),
    items: toItems(payload.products),
  });
}
