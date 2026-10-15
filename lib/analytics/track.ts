import { gaAddToCart, gaBeginCheckout, gaViewItem } from "./ga";
import {
  metaAddToCart,
  metaBeginCheckout,
  metaPageView,
  metaViewContent,
} from "./meta";
import {
  shopifyAddToCart,
  shopifyPageView,
  shopifyProductView,
} from "./shopify";
import type { AnalyticsProduct, CartAnalyticsPayload } from "./types";

export type { AnalyticsProduct, CartAnalyticsPayload } from "./types";

export function trackPageView(options?: { shopify?: boolean }) {
  metaPageView();
  if (options?.shopify !== false) {
    void shopifyPageView();
  }
}

export function trackViewItem(product: AnalyticsProduct) {
  metaViewContent(product);
  gaViewItem(product);
  void shopifyProductView(product);
}

export function trackAddToCart(payload: CartAnalyticsPayload) {
  metaAddToCart(payload);
  gaAddToCart(payload);
  void shopifyAddToCart(payload);
}

export function trackBeginCheckout(payload: CartAnalyticsPayload) {
  metaBeginCheckout(payload);
  gaBeginCheckout(payload);
}
