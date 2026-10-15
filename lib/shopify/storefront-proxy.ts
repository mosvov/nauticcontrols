import { ensureStartsWith } from "lib/utils";
import { headers } from "next/headers";

const UNSTABLE_GRAPHQL_PATH = "/api/unstable/graphql.json";

const FORWARD_REQUEST_HEADERS = [
  "Shopify-Visit-Token",
  "Shopify-Unique-Token",
  "Shopify-Storefront-Consent-Management",
] as const;

async function getBuyerIp(): Promise<string | undefined> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0]?.trim() || undefined;
    }
    return (
      h.get("x-real-ip") ||
      h.get("cf-connecting-ip") ||
      h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      undefined
    );
  } catch {
    return undefined;
  }
}

/**
 * Same-origin Storefront API proxy for hydrogen-react cookie bootstrap.
 * Forwards Set-Cookie and Server-Timing so getTrackingValues() can resolve tokens.
 */
export async function proxyUnstableStorefrontGraphql(
  request: Request,
): Promise<Response> {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const publicToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim();

  if (!storeDomain) {
    return Response.json(
      { error: "SHOPIFY_STORE_DOMAIN is not configured" },
      { status: 500 },
    );
  }

  if (!publicToken && !privateToken) {
    return Response.json(
      { error: "Storefront API token is not configured" },
      { status: 500 },
    );
  }

  const upstream = `${ensureStartsWith(storeDomain, "https://").replace(/\/+$/, "")}${UNSTABLE_GRAPHQL_PATH}`;

  const upstreamHeaders = new Headers({
    "Content-Type": "application/json",
  });

  if (privateToken) {
    upstreamHeaders.set("Shopify-Storefront-Private-Token", privateToken);
    const buyerIp = await getBuyerIp();
    if (buyerIp) {
      upstreamHeaders.set("Shopify-Storefront-Buyer-IP", buyerIp);
    }
  } else if (publicToken) {
    upstreamHeaders.set("X-Shopify-Storefront-Access-Token", publicToken);
  }

  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) upstreamHeaders.set(name, value);
  }

  const body = await request.text();

  const upstreamResponse = await fetch(upstream, {
    method: "POST",
    headers: upstreamHeaders,
    body,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  responseHeaders.set(
    "Content-Type",
    upstreamResponse.headers.get("Content-Type") || "application/json",
  );
  responseHeaders.set("Cache-Control", "no-store");

  const serverTiming =
    upstreamResponse.headers.get("server-timing") ||
    upstreamResponse.headers.get("Server-Timing");
  if (serverTiming) {
    responseHeaders.set("Server-Timing", serverTiming);
  }

  // Preserve every Set-Cookie from Shopify (HTTP-only analytics cookies).
  const setCookies =
    typeof upstreamResponse.headers.getSetCookie === "function"
      ? upstreamResponse.headers.getSetCookie()
      : [];
  if (setCookies.length) {
    for (const cookie of setCookies) {
      responseHeaders.append("Set-Cookie", cookie);
    }
  } else {
    const single = upstreamResponse.headers.get("set-cookie");
    if (single) responseHeaders.append("Set-Cookie", single);
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}
