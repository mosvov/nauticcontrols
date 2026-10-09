"use client";

import Link from "next/link";

import { useCart } from "components/cart/cart-context";
import {
  FLAT_SHIPPING_USD,
  FREE_SHIPPING_THRESHOLD_USD,
  formatUsd,
  shippingProgress,
} from "lib/shipping";

type ShippingNoteProps = {
  /** Max variant price of the product on this PDP (USD). */
  productPriceUsd?: number;
};

/**
 * Near-buy shipping copy. Updates from cart when possible (Baymard + peer DTC).
 */
export function ShippingNote({ productPriceUsd }: ShippingNoteProps) {
  const { cart } = useCart();
  const subtotal = Number(cart?.cost.subtotalAmount.amount ?? 0);
  const hasCartItems = (cart?.totalQuantity ?? 0) > 0;
  const { remaining, qualifies } = shippingProgress(
    Number.isFinite(subtotal) ? subtotal : 0,
  );
  const productQualifiesAlone =
    typeof productPriceUsd === "number" &&
    productPriceUsd >= FREE_SHIPPING_THRESHOLD_USD;

  let message: string;
  if (hasCartItems && qualifies) {
    message = "Free US ground unlocked on your cart.";
  } else if (hasCartItems && remaining > 0) {
    message = `Add ${formatUsd(remaining)} more for free US ground.`;
  } else if (productQualifiesAlone) {
    message = "This item ships free with US ground (contiguous US).";
  } else {
    message = `Free US ground on orders ${formatUsd(FREE_SHIPPING_THRESHOLD_USD)}+. Under ${formatUsd(FREE_SHIPPING_THRESHOLD_USD)}: ${formatUsd(FLAT_SHIPPING_USD)} (contiguous US).`;
  }

  return (
    <p className="mt-3 text-sm leading-relaxed text-mute" aria-live="polite">
      {message}{" "}
      <Link
        href="/shipping"
        className="text-accent underline underline-offset-4 hover:brightness-110"
      >
        Shipping policy
      </Link>
    </p>
  );
}
