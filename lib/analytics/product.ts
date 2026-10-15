import type { Product, ProductVariant } from "lib/shopify/types";
import type { AnalyticsProduct } from "./types";

export function productToAnalytics(
  product: Product,
  variant?: ProductVariant | null,
  quantity = 1,
): AnalyticsProduct {
  const selected =
    variant ||
    (product.variants.length === 1 ? product.variants[0] : undefined);

  return {
    productId: product.id,
    variantId: selected?.id,
    name: product.title,
    brand: product.vendor,
    price: selected?.price.amount ?? product.priceRange.minVariantPrice.amount,
    currency:
      selected?.price.currencyCode ??
      product.priceRange.minVariantPrice.currencyCode,
    quantity,
  };
}
