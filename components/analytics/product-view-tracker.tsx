"use client";

import { trackViewItem, type AnalyticsProduct } from "lib/analytics";
import { useEffect } from "react";

export function ProductViewTracker({ product }: { product: AnalyticsProduct }) {
  useEffect(() => {
    trackViewItem(product);
    // Fire once per product id mount; variant changes are uncommon on this PDP.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional once-per-product
  }, [product.productId]);

  return null;
}
