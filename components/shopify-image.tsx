"use client";

import { shopifyLoader } from "lib/shopify/image-loader";
import Image, { type ImageProps } from "next/image";

/** next/image wired to Shopify CDN transforms (width / quality params). */
export function ShopifyImage(props: ImageProps) {
  return <Image {...props} loader={shopifyLoader} />;
}
