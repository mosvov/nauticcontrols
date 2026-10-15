type ShopifyLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

const SHOPIFY_CDN_HOSTS = new Set(["cdn.shopify.com"]);

function defaultNextLoader({ src, width, quality }: ShopifyLoaderProps) {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality ?? 75),
  });
  return `/_next/image?${params.toString()}`;
}

/**
 * Builds Shopify CDN URLs with width (and optional quality) so transforms
 * happen on Shopify's edge instead of the Next.js Image Optimization API.
 *
 * Non-Shopify or invalid absolute URLs fall back to the default Next
 * Image Optimization endpoint so callers cannot bypass remotePatterns by
 * accident. Shopify does not need a forced format= param; the CDN
 * negotiates WebP/AVIF via Accept.
 */
export function shopifyLoader({ src, width, quality }: ShopifyLoaderProps) {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return defaultNextLoader({ src, width, quality });
  }

  if (!SHOPIFY_CDN_HOSTS.has(url.hostname)) {
    return defaultNextLoader({ src, width, quality });
  }

  url.searchParams.set("width", String(Math.round(width)));
  if (quality != null) {
    url.searchParams.set("quality", String(quality));
  }
  return url.href;
}
