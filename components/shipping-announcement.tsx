import Link from "next/link";

import {
  FLAT_SHIPPING_USD,
  FREE_SHIPPING_THRESHOLD_USD,
  formatUsd,
} from "lib/shipping";

/** Slim sitewide reminder (peers use this + PDP/cart, not banner alone). */
export function ShippingAnnouncement() {
  return (
    <div className="border-b border-line bg-ink text-center text-xs text-white/90 sm:text-sm">
      <p className="mx-auto max-w-[1140px] px-4 py-2 leading-snug">
        Free US ground on orders {formatUsd(FREE_SHIPPING_THRESHOLD_USD)}+ ·{" "}
        {formatUsd(FLAT_SHIPPING_USD)} under · contiguous US ·{" "}
        <Link
          href="/shipping"
          className="font-medium text-white underline underline-offset-4 hover:text-white"
        >
          Details
        </Link>
      </p>
    </div>
  );
}
