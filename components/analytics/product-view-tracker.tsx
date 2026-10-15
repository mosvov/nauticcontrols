"use client";

import { trackViewItem, type AnalyticsProduct } from "lib/analytics";
import { ensureGaQueue } from "lib/analytics/ga";
import { ensureMetaStub } from "lib/analytics/meta";
import { useEffect, useRef } from "react";

export function ProductViewTracker({ product }: { product: AnalyticsProduct }) {
  const lastId = useRef<string | null>(null);

  useEffect(() => {
    if (lastId.current === product.productId) return;
    lastId.current = product.productId;
    ensureMetaStub();
    ensureGaQueue();
    trackViewItem(product);
  }, [product]);

  return null;
}
