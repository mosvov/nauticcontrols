import { ensureStartsWith } from "lib/utils";
import { headers } from "next/headers";

const UNSTABLE_GRAPHQL_PATH = "/api/unstable/graphql.json";
const MAX_BODY_BYTES = 8_192;

/** Header names used by @shopify/hydrogen-react useShopifyCookies. */
const H2_VISIT_TOKEN = "X-Shopify-VisitToken";
const H2_UNIQUE_TOKEN = "X-Shopify-UniqueToken";
const CONSENT_MARKER = "Shopify-Storefront-Consent-Management";

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

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    // Same-origin navigations / hydrogen-react fetch often omit Origin; allow
    // when Sec-Fetch-Site is same-origin or absent (older browsers).
    const site = request.headers.get("sec-fetch-site");
    return !site || site === "same-origin" || site === "none";
  }
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function isConsentBootstrapQuery(body: string): boolean {
  return (
    body.includes("consentManagement") &&
    body.includes("cookies") &&
    body.includes("visitorConsent")
  );
}

/**
 * Same-origin Storefront API proxy for hydrogen-react cookie bootstrap.
 * Forwards Set-Cookie and Server-Timing so getTrackingValues() can resolve tokens.
 */
export async function proxyUnstableStorefrontGraphql(
  request: Request,
): Promise<Response> {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

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

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }
  if (!isConsentBootstrapQuery(body)) {
    return Response.json(
      { error: "Only consentManagement cookie bootstrap queries are allowed" },
      { status: 400 },
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

  // hydrogen-react header names (plus legacy spellings if present).
  for (const name of [
    H2_VISIT_TOKEN,
    H2_UNIQUE_TOKEN,
    "Shopify-Visit-Token",
    "Shopify-Unique-Token",
    CONSENT_MARKER,
  ]) {
    const value = request.headers.get(name);
    if (value) upstreamHeaders.set(name, value);
  }

  const cookie = request.headers.get("cookie");
  if (cookie) upstreamHeaders.set("Cookie", cookie);

  try {
    const upstreamResponse = await fetch(upstream, {
      method: "POST",
      headers: upstreamHeaders,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
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

    // Preserve Set-Cookie. Shopify returns host-only cookies (no Domain=) which
    // correctly attach to the storefront origin when proxied.
    const setCookies =
      typeof upstreamResponse.headers.getSetCookie === "function"
        ? upstreamResponse.headers.getSetCookie()
        : [];
    if (setCookies.length) {
      for (const cookieHeader of setCookies) {
        responseHeaders.append("Set-Cookie", cookieHeader);
      }
    } else {
      const single = upstreamResponse.headers.get("set-cookie");
      if (single) responseHeaders.append("Set-Cookie", single);
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { error: "Upstream Storefront API unavailable" },
      { status: 502 },
    );
  }
}
