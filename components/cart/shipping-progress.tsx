"use client";

import Link from "next/link";

import {
  FLAT_SHIPPING_USD,
  FREE_SHIPPING_THRESHOLD_USD,
  formatUsd,
  shippingProgress,
} from "lib/shipping";

export function CartShippingProgress({
  subtotalAmount,
}: {
  subtotalAmount: string;
}) {
  const subtotal = Number(subtotalAmount);
  const safeSubtotal = Number.isFinite(subtotal) ? subtotal : 0;
  const { remaining, qualifies, ratio } = shippingProgress(safeSubtotal);

  return (
    <div
      className="mt-4 rounded-[0.35rem] border border-line bg-shelf px-3 py-3 text-sm"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-ink">
          {qualifies
            ? "Free shipping on this order"
            : `Add ${formatUsd(remaining)} for free shipping`}
        </p>
        <p className="shrink-0 text-xs text-mute">
          {formatUsd(Math.min(safeSubtotal, FREE_SHIPPING_THRESHOLD_USD))} /{" "}
          {formatUsd(FREE_SHIPPING_THRESHOLD_USD)}
        </p>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_THRESHOLD_USD}
        aria-valuenow={Math.min(safeSubtotal, FREE_SHIPPING_THRESHOLD_USD)}
        aria-label="Progress toward free shipping"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-mute">
        {qualifies
          ? "Lower 48 · confirmed at checkout"
          : `Orders under ${formatUsd(FREE_SHIPPING_THRESHOLD_USD)} ship for ${formatUsd(FLAT_SHIPPING_USD)}`}{" "}
        ·{" "}
        <Link
          href="/shipping"
          onClick={(event) => event.stopPropagation()}
          className="text-accent underline underline-offset-4 hover:brightness-110"
        >
          Policy
        </Link>
      </p>
    </div>
  );
}

export function cartShippingLabel(subtotalAmount: string): string {
  const subtotal = Number(subtotalAmount);
  const { qualifies } = shippingProgress(
    Number.isFinite(subtotal) ? subtotal : 0,
  );
  return qualifies ? "Free" : formatUsd(FLAT_SHIPPING_USD);
}
