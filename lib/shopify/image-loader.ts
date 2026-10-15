type ShopifyLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

/**
 * Builds Shopify CDN URLs with width (and optional quality) so transforms
 * happen on Shopify's edge instead of the Next.js Image Optimization API.
 */
export function shopifyLoader({ src, width, quality }: ShopifyLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("width", String(Math.round(width)));
  if (quality) {
    url.searchParams.set("quality", String(quality));
  }
  return url.href;
}
