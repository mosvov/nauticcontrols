import { proxyUnstableStorefrontGraphql } from "lib/shopify/storefront-proxy";

export async function POST(request: Request) {
  return proxyUnstableStorefrontGraphql(request);
}

export function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
