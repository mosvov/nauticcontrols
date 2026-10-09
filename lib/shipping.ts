/** Contiguous US ground rates configured in Shopify Admin. */
export const FREE_SHIPPING_THRESHOLD_USD = 75;
export const FLAT_SHIPPING_USD = 9.95;

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function shippingProgress(subtotalUsd: number) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - subtotalUsd);
  const qualifies = remaining <= 0;
  const ratio = Math.min(1, subtotalUsd / FREE_SHIPPING_THRESHOLD_USD);

  return { remaining, qualifies, ratio };
}
