"use client";

import { getTrackingValues, useShopifyCookies } from "@shopify/hydrogen-react";
import { trackPageView } from "lib/analytics";
import { ensureGaQueue } from "lib/analytics/ga";
import { ensureMetaStub } from "lib/analytics/meta";
import { shopifyPageView } from "lib/analytics/shopify";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { MetaPixel } from "./meta-pixel";
import { ShopifyCookiesReadyProvider } from "./shopify-cookies-ready";

type AnalyticsProviderProps = {
  shopDomain?: string;
  storefrontToken?: string;
  children?: ReactNode;
};

function absoluteHttpsCheckoutDomain(shopDomain?: string): string | undefined {
  if (!shopDomain) return undefined;
  const trimmed = shopDomain.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  const withoutScheme = trimmed.replace(/^https?:\/\//i, "");
  return `https://${withoutScheme}`;
}

/**
 * Cookie bootstrap + route tracking. Kept in Suspense (usePathname) but does
 * not wrap app children, so nav/cart state is not remounted on resolve.
 */
function CookieBootstrap({
  shopDomain,
  storefrontToken,
  onReady,
}: {
  shopDomain?: string;
  storefrontToken?: string;
  onReady: (ready: boolean) => void;
}) {
  const pathname = usePathname();
  const checkoutDomain = useMemo(
    () => absoluteHttpsCheckoutDomain(shopDomain),
    [shopDomain],
  );

  const cookiesReady = useShopifyCookies({
    fetchTrackingValues: Boolean(checkoutDomain && storefrontToken),
    storefrontAccessToken: storefrontToken,
    checkoutDomain,
  });

  useEffect(() => {
    onReady(cookiesReady);
  }, [cookiesReady, onReady]);

  useEffect(() => {
    ensureMetaStub();
    ensureGaQueue();
    void trackPageView({ shopify: false });
  }, [pathname]);

  useEffect(() => {
    if (!cookiesReady) return;

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

  return null;
}

export function AnalyticsProvider({
  shopDomain,
  storefrontToken,
  children,
}: AnalyticsProviderProps) {
  const [cookiesReady, setCookiesReady] = useState(false);

  return (
    <ShopifyCookiesReadyProvider ready={cookiesReady}>
      {children}
      <Suspense fallback={null}>
        <CookieBootstrap
          shopDomain={shopDomain}
          storefrontToken={storefrontToken}
          onReady={setCookiesReady}
        />
      </Suspense>
      <MetaPixel />
    </ShopifyCookiesReadyProvider>
  );
}
