export type AnalyticsProduct = {
  productId: string;
  variantId?: string;
  name: string;
  brand?: string;
  category?: string;
  sku?: string;
  price: string | number;
  quantity?: number;
  currency?: string;
};

export type CartAnalyticsPayload = {
  cartId?: string;
  value?: number;
  currency?: string;
  products: AnalyticsProduct[];
};
