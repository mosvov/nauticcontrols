"use client";

import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  className,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  className?: string;
}) {
  const buttonClasses = clsx(
    "relative flex w-full min-h-[3.1rem] items-center justify-center rounded-[0.35rem] bg-accent px-4 text-sm font-bold tracking-wide text-white transition hover:brightness-105",
    className,
  );
  const disabledClasses = "cursor-not-allowed opacity-60 hover:brightness-100";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out of stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        Select an option
      </button>
    );
  }

  return (
    <button aria-label="Add to cart" className={buttonClasses}>
      Add to cart
    </button>
  );
}

export function AddToCart({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        className={className}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
