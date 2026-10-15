import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  ShopifySalesChannel,
  type ShopifyAnalyticsProduct,
  type ShopifyPageViewPayload,
} from "@shopify/hydrogen-react";
import { analyticsConfig, hasShopifyAnalytics } from "./config";
import type { AnalyticsProduct, CartAnalyticsPayload } from "./types";

function basePayload() {
  return {
    ...getClientBrowserParameters(),
    hasUserConsent: analyticsConfig.hasUserConsent,
    shopifySalesChannel: ShopifySalesChannel.headless,
    shopId: analyticsConfig.shopifyShopId,
    currency: analyticsConfig.currency,
    acceptedLanguage: analyticsConfig.language,
  };
}

function toShopifyProducts(
  products: AnalyticsProduct[],
): ShopifyAnalyticsProduct[] {
  return products.map((p) => {
    const row: ShopifyAnalyticsProduct = {
      productGid: p.productId,
      name: p.name,
      brand: p.brand || "",
      price: String(p.price),
      quantity: p.quantity ?? 1,
    };
    if (p.variantId) row.variantGid = p.variantId;
    if (p.category) row.category = p.category;
    if (p.sku) row.sku = p.sku;
    return row;
  });
}

export async function shopifyPageView(
  extras: Partial<ShopifyPageViewPayload> = {},
) {
  if (!hasShopifyAnalytics() || typeof window === "undefined") return;

  await sendShopifyAnalytics({
    eventName: AnalyticsEventName.PAGE_VIEW,
    payload: {
      ...basePayload(),
      ...extras,
    },
  });
}

export async function shopifyProductView(product: AnalyticsProduct) {
  if (!hasShopifyAnalytics() || typeof window === "undefined") return;

  const products = toShopifyProducts([product]);
  await sendShopifyAnalytics({
    eventName: AnalyticsEventName.PRODUCT_VIEW,
    payload: {
      ...basePayload(),
      products,
      totalValue: Number(product.price) * (product.quantity ?? 1),
    },
  });
}

export async function shopifyAddToCart(payload: CartAnalyticsPayload) {
  if (!hasShopifyAnalytics() || typeof window === "undefined") return;

  const products = toShopifyProducts(payload.products);
  await sendShopifyAnalytics({
    eventName: AnalyticsEventName.ADD_TO_CART,
    payload: {
      ...basePayload(),
      cartId: payload.cartId || "",
      products,
      totalValue:
        payload.value ??
        products.reduce(
          (sum, p) => sum + Number(p.price) * (p.quantity ?? 1),
          0,
        ),
    },
  });
}
