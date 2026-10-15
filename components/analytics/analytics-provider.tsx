"use client";

import { useShopifyCookies } from "@shopify/hydrogen-react";
import { trackPageView } from "lib/analytics";
import { ensureGaQueue } from "lib/analytics/ga";
import { ensureMetaStub } from "lib/analytics/meta";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { MetaPixel } from "./meta-pixel";

type AnalyticsProviderProps = {
  shopDomain?: string;
  storefrontToken?: string;
};

function RouteAnalytics({
  shopDomain,
  storefrontToken,
}: AnalyticsProviderProps) {
  const pathname = usePathname();

  useShopifyCookies({
    fetchTrackingValues: Boolean(shopDomain && storefrontToken),
    storefrontAccessToken: storefrontToken,
    checkoutDomain: shopDomain,
  });

  useEffect(() => {
    ensureMetaStub();
    ensureGaQueue();
    void trackPageView();
  }, [pathname]);

  return <MetaPixel />;
}

export function AnalyticsProvider(props: AnalyticsProviderProps) {
  return (
    <Suspense fallback={null}>
      <RouteAnalytics {...props} />
    </Suspense>
  );
}
