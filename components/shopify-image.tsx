"use client";

import { shopifyLoader } from "lib/shopify/image-loader";
import Image, { type ImageProps } from "next/image";

type ShopifyImageProps = Omit<ImageProps, "loader">;

/** next/image wired to Shopify CDN transforms (width / quality params). */
export function ShopifyImage(props: ShopifyImageProps) {
  return <Image {...props} loader={shopifyLoader} />;
}
