"use client";

import { type AnalyticsProduct } from "lib/analytics";
import { ensureGaQueue, gaViewItem } from "lib/analytics/ga";
import { ensureMetaStub, metaViewContent } from "lib/analytics/meta";
import { shopifyProductView } from "lib/analytics/shopify";
import { useEffect, useRef } from "react";
import { useShopifyCookiesReady } from "./shopify-cookies-ready";

export function ProductViewTracker({ product }: { product: AnalyticsProduct }) {
  const cookiesReady = useShopifyCookiesReady();
  const metaTracked = useRef<string | null>(null);
  const shopifyTracked = useRef<string | null>(null);

  useEffect(() => {
    if (metaTracked.current === product.productId) return;
    metaTracked.current = product.productId;
    ensureMetaStub();
    ensureGaQueue();
    metaViewContent(product);
    gaViewItem(product);
  }, [product]);

  useEffect(() => {
    if (!cookiesReady) return;
    if (shopifyTracked.current === product.productId) return;
    shopifyTracked.current = product.productId;
    void shopifyProductView(product);
  }, [cookiesReady, product]);

  return null;
}
