"use client";

import { useShopifyCookies } from "@shopify/hydrogen-react";
import { trackPageView } from "lib/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { MetaPixel } from "./meta-pixel";

function RouteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useShopifyCookies({ hasUserConsent: true });

  useEffect(() => {
    void trackPageView();
  }, [pathname, searchParams]);

  return <MetaPixel />;
}

export function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <RouteAnalytics />
    </Suspense>
  );
}
