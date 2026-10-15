import { proxyUnstableStorefrontGraphql } from "lib/shopify/storefront-proxy";

export async function POST(request: Request) {
  return proxyUnstableStorefrontGraphql(request);
}
