import { analyticsConfig, hasMeta } from "./config";
import type { AnalyticsProduct, CartAnalyticsPayload } from "./types";

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

function fbq(...args: unknown[]) {
  if (
    typeof window === "undefined" ||
    !hasMeta() ||
    typeof window.fbq !== "function"
  ) {
    return;
  }
  window.fbq(...args);
}

function contentIds(products: AnalyticsProduct[]): string[] {
  return products.map((p) => p.variantId || p.productId);
}

function contents(products: AnalyticsProduct[]) {
  return products.map((p) => ({
    id: p.variantId || p.productId,
    quantity: p.quantity ?? 1,
    item_price: Number(p.price),
  }));
}

function valueOf(products: AnalyticsProduct[], fallback?: number): number {
  if (typeof fallback === "number") return fallback;
  return products.reduce(
    (sum, p) => sum + Number(p.price) * (p.quantity ?? 1),
    0,
  );
}

export function metaPageView() {
  fbq("track", "PageView");
}

export function metaViewContent(product: AnalyticsProduct) {
  fbq("track", "ViewContent", {
    content_ids: contentIds([product]),
    content_name: product.name,
    content_type: "product",
    contents: contents([product]),
    currency: product.currency || analyticsConfig.currency,
    value: valueOf([product]),
  });
}

export function metaAddToCart(payload: CartAnalyticsPayload) {
  fbq("track", "AddToCart", {
    content_ids: contentIds(payload.products),
    content_type: "product",
    contents: contents(payload.products),
    currency: payload.currency || analyticsConfig.currency,
    value: valueOf(payload.products, payload.value),
  });
}

export function metaBeginCheckout(payload: CartAnalyticsPayload) {
  fbq("track", "InitiateCheckout", {
    content_ids: contentIds(payload.products),
    content_type: "product",
    contents: contents(payload.products),
    currency: payload.currency || analyticsConfig.currency,
    value: valueOf(payload.products, payload.value),
    num_items: payload.products.reduce((sum, p) => sum + (p.quantity ?? 1), 0),
  });
}
