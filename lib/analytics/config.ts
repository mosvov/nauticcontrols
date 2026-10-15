export const analyticsConfig = {
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "",
  shopifyShopId: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID?.trim() || "",
  currency: "USD" as const,
  language: "EN" as const,
  /** US-first storefront: analytics/marketing allowed without a CMP banner. */
  hasUserConsent: true,
};

export function hasGa(): boolean {
  return Boolean(analyticsConfig.gaMeasurementId);
}

export function hasMeta(): boolean {
  return Boolean(analyticsConfig.metaPixelId);
}

export function hasShopifyAnalytics(): boolean {
  return Boolean(analyticsConfig.shopifyShopId);
}
