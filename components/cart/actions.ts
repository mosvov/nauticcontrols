"use server";

import * as Sentry from "@sentry/nextjs";
import { TAGS } from "lib/constants";
import {
  addToCart,
  ensureCartId,
  getCart,
  getCartForCheckout,
  removeFromCart,
  updateCart,
} from "lib/shopify";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
) {
  return Sentry.withServerActionInstrumentation(
    "addItem",
    { headers: await headers(), recordResponse: true },
    async () => {
      if (!selectedVariantId) {
        return "Error adding item to cart";
      }

      try {
        await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
        updateTag(TAGS.cart);
      } catch (e) {
        Sentry.captureException(e);
        console.error(e);
        return e instanceof Error ? e.message : "Error adding item to cart";
      }
    },
  );
}

export async function removeItem(prevState: any, merchandiseId: string) {
  return Sentry.withServerActionInstrumentation(
    "removeItem",
    { headers: await headers(), recordResponse: true },
    async () => {
      try {
        const cart = await getCart();

        if (!cart) {
          return "Error fetching cart";
        }

        const lineItem = cart.lines.find(
          (line) => line.merchandise.id === merchandiseId,
        );

        if (lineItem && lineItem.id) {
          await removeFromCart([lineItem.id]);
          updateTag(TAGS.cart);
        } else {
          return "Item not found in cart";
        }
      } catch (e) {
        Sentry.captureException(e);
        console.error(e);
        return e instanceof Error ? e.message : "Error removing item from cart";
      }
    },
  );
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  },
) {
  return Sentry.withServerActionInstrumentation(
    "updateItemQuantity",
    { headers: await headers(), recordResponse: true },
    async () => {
      const { merchandiseId, quantity } = payload;

      try {
        const cart = await getCart();

        if (!cart) {
          return "Error fetching cart";
        }

        const lineItem = cart.lines.find(
          (line) => line.merchandise.id === merchandiseId,
        );

        if (lineItem && lineItem.id) {
          if (quantity === 0) {
            await removeFromCart([lineItem.id]);
          } else {
            await updateCart([
              {
                id: lineItem.id,
                merchandiseId,
                quantity,
              },
            ]);
          }
        } else if (quantity > 0) {
          // If the item doesn't exist in the cart and quantity > 0, add it
          await addToCart([{ merchandiseId, quantity }]);
        }

        updateTag(TAGS.cart);
      } catch (e) {
        Sentry.captureException(e);
        console.error(e);
        return e instanceof Error ? e.message : "Error updating item quantity";
      }
    },
  );
}

export async function redirectToCheckout() {
  return Sentry.withServerActionInstrumentation(
    "redirectToCheckout",
    { headers: await headers() },
    async () => {
      const cart = await getCartForCheckout();

      if (!cart?.checkoutUrl) {
        throw new Error("Cart checkout URL is unavailable");
      }

      redirect(cart.checkoutUrl);
    },
  );
}

export async function createCartAndSetCookie() {
  return Sentry.withServerActionInstrumentation(
    "createCartAndSetCookie",
    { headers: await headers() },
    async () => {
      // Reuse an existing cartId (e.g. created by ensureCartId during add-to-cart)
      // so a late modal mount effect does not orphan a cart that already has lines.
      await ensureCartId();
    },
  );
}
