"use client";

import { getTrackingValues, useShopifyCookies } from "@shopify/hydrogen-react";
import { trackPageView } from "lib/analytics";
import { ensureGaQueue } from "lib/analytics/ga";
import { ensureMetaStub } from "lib/analytics/meta";
import { shopifyPageView } from "lib/analytics/shopify";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { MetaPixel } from "./meta-pixel";
import { ShopifyCookiesReadyProvider } from "./shopify-cookies-ready";

type AnalyticsProviderProps = {
  shopDomain?: string;
  storefrontToken?: string;
  children?: ReactNode;
};

function absoluteCheckoutDomain(shopDomain?: string): string | undefined {
  if (!shopDomain) return undefined;
  const trimmed = shopDomain.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function RouteAnalytics({
  shopDomain,
  storefrontToken,
  children,
}: AnalyticsProviderProps) {
  const pathname = usePathname();
  const checkoutDomain = useMemo(
    () => absoluteCheckoutDomain(shopDomain),
    [shopDomain],
  );
  const lastShopifyPath = useRef<string | null>(null);

  const cookiesReady = useShopifyCookies({
    fetchTrackingValues: Boolean(checkoutDomain && storefrontToken),
    storefrontAccessToken: storefrontToken,
    checkoutDomain,
  });

  useEffect(() => {
    ensureMetaStub();
    ensureGaQueue();
    void trackPageView({ shopify: false });
  }, [pathname]);

  useEffect(() => {
    if (!cookiesReady) return;
    if (lastShopifyPath.current === pathname) return;
    lastShopifyPath.current = pathname;

    if (process.env.NODE_ENV === "development") {
      const { uniqueToken, visitToken } = getTrackingValues();
      if (!uniqueToken || !visitToken) {
        console.warn(
          "[analytics] Shopify tracking tokens empty after cookie bootstrap",
          {
            uniqueToken: Boolean(uniqueToken),
            visitToken: Boolean(visitToken),
          },
        );
      }
    }

    void shopifyPageView();
  }, [cookiesReady, pathname]);

  return (
    <ShopifyCookiesReadyProvider ready={cookiesReady}>
      {children}
      <MetaPixel />
    </ShopifyCookiesReadyProvider>
  );
}

export function AnalyticsProvider(props: AnalyticsProviderProps) {
  return (
    <Suspense fallback={props.children ?? null}>
      <RouteAnalytics {...props} />
    </Suspense>
  );
}
