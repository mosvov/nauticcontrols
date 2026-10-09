import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "lib/constants";
import { isShopifyError } from "lib/type-guards";
import { ensureStartsWith } from "lib/utils";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart";
import { getCartQuery } from "./queries/cart";
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
} from "./queries/collection";
import { getMenuQuery } from "./queries/menu";
import { getPageQuery, getPagesQuery } from "./queries/page";
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
} from "./queries/product";
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCartUserError,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
} from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = domain ? `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}` : "";
const publicStorefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const privateStorefrontToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

async function getBuyerIp(): Promise<string | undefined> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0]?.trim() || undefined;
    }
    return (
      h.get("x-real-ip") ||
      h.get("cf-connecting-ip") ||
      h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      undefined
    );
  } catch {
    // Outside a request context (e.g. build-time catalog fetch).
    return undefined;
  }
}

function assertNoCartUserErrors(
  userErrors: ShopifyCartUserError[] | undefined,
  operation: string,
) {
  if (!userErrors?.length) {
    return;
  }

  throw new Error(
    `${operation}: ${userErrors.map((error) => error.message).join("; ")}`,
  );
}

export async function setCartIdCookie(cartId: string) {
  (await cookies()).set("cartId", cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function shopifyFetch<T>({
  headers: customHeaders,
  query,
  variables,
  includeBuyerIp = false,
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
  /** Attach Shopify-Storefront-Buyer-IP for buyer-driven cart/checkout calls. */
  includeBuyerIp?: boolean;
}): Promise<{ status: number; body: T } | never> {
  try {
    if (!endpoint) {
      throw new Error("SHOPIFY_STORE_DOMAIN environment variable is not set");
    }

    if (!privateStorefrontToken && !publicStorefrontToken) {
      throw new Error(
        "Set SHOPIFY_STOREFRONT_ACCESS_TOKEN or SHOPIFY_STOREFRONT_PRIVATE_TOKEN",
      );
    }

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Prefer private token on the server; fall back to Headless public token.
    if (privateStorefrontToken) {
      requestHeaders["Shopify-Storefront-Private-Token"] =
        privateStorefrontToken;
    } else if (publicStorefrontToken) {
      requestHeaders["X-Shopify-Storefront-Access-Token"] =
        publicStorefrontToken;
    }

    // Only for buyer-driven calls. Do not read headers() inside cached catalog fetches.
    if (includeBuyerIp) {
      const buyerIp = await getBuyerIp();
      if (buyerIp) {
        requestHeaders["Shopify-Storefront-Buyer-IP"] = buyerIp;
      }
    }

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        ...requestHeaders,
        ...customHeaders,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || "unknown",
        status: e.status || 500,
        message: e.message,
        query,
      };
    }

    throw {
      error: e,
      query,
    };
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
};

const reshapeCollection = (
  collection: ShopifyCollection,
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    includeBuyerIp: true,
  });

  assertNoCartUserErrors(res.body.data.cartCreate.userErrors, "cartCreate");

  const cart = res.body.data.cartCreate.cart;
  if (!cart) {
    throw new Error("cartCreate returned no cart");
  }

  return reshapeCart(cart);
}

/** Ensure a cartId cookie exists before cart line mutations. */
export async function ensureCartId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get("cartId")?.value;
  if (existing) {
    return existing;
  }

  const cart = await createCart();
  if (!cart.id) {
    throw new Error("Failed to create cart");
  }

  await setCartIdCookie(cart.id);
  return cart.id;
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = await ensureCartId();
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
    includeBuyerIp: true,
  });

  assertNoCartUserErrors(res.body.data.cartLinesAdd.userErrors, "cartLinesAdd");

  const cart = res.body.data.cartLinesAdd.cart;
  if (!cart) {
    throw new Error("cartLinesAdd returned no cart");
  }

  return reshapeCart(cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = await ensureCartId();
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
    includeBuyerIp: true,
  });

  assertNoCartUserErrors(
    res.body.data.cartLinesRemove.userErrors,
    "cartLinesRemove",
  );

  const cart = res.body.data.cartLinesRemove.cart;
  if (!cart) {
    throw new Error("cartLinesRemove returned no cart");
  }

  return reshapeCart(cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = await ensureCartId();
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
    includeBuyerIp: true,
  });

  assertNoCartUserErrors(
    res.body.data.cartLinesUpdate.userErrors,
    "cartLinesUpdate",
  );

  const cart = res.body.data.cartLinesUpdate.cart;
  if (!cart) {
    throw new Error("cartLinesUpdate returned no cart");
  }

  return reshapeCart(cart);
}

export async function getCart(): Promise<Cart | undefined> {
  "use cache: private";
  cacheTag(TAGS.cart);
  cacheLife("seconds");

  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    return undefined;
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    includeBuyerIp: true,
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

/**
 * Uncached cart read for checkout redirect. Prefer this over getCart()
 * so checkoutUrl is not served from a briefly cached cart snapshot.
 */
export async function getCartForCheckout(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    return undefined;
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    includeBuyerIp: true,
  });

  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    variables: {
      handle,
    },
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    console.log(
      `Skipping getCollectionProducts for '${collection}' - Shopify not configured`,
    );
    return [];
  }

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
    },
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products),
  );
}

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  if (!endpoint) {
    console.log("Skipping getCollections - Shopify not configured");
    return [
      {
        handle: "",
        title: "All",
        description: "All products",
        seo: {
          title: "All",
          description: "All products",
        },
        path: "/search",
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith("hidden"),
    ),
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.menus);
  cacheLife("days");

  if (!endpoint) {
    console.log(`Skipping getMenu for '${handle}' - Shopify not configured`);
    return [];
  }

  try {
    const res = await shopifyFetch<ShopifyMenuOperation>({
      query: getMenuQuery,
      variables: {
        handle,
      },
    });

    return (
      res.body?.data?.menu?.items.map(
        (item: { title: string; url: string }) => ({
          title: item.title,
          path: item.url
            .replace(domain, "")
            .replace("/collections", "/search")
            .replace("/pages", ""),
        }),
      ) || []
    );
  } catch (e) {
    // Build/prerender should not fail if Shopify is briefly unreachable.
    console.error(`getMenu('${handle}') failed; returning empty menu`, e);
    return [];
  }
}

export async function getPage(handle: string): Promise<Page> {
  "use cache";
  cacheTag(TAGS.pages);
  cacheLife("days");

  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle },
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  "use cache";
  cacheTag(TAGS.pages);
  cacheLife("days");

  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    console.log(`Skipping getProduct for '${handle}' - Shopify not configured`);
    return undefined;
  }

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: {
      handle,
    },
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables: {
      productId,
    },
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables: {
      query,
      reverse,
      sortKey,
    },
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // Always HTTP 200 for Shopify webhooks so failed auth does not cause retry storms.
  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];
  const pageWebhooks = ["pages/create", "pages/delete", "pages/update"];
  const topic = (await headers()).get("x-shopify-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);
  const isPageUpdate = pageWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.");
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret" },
      { status: 200 },
    );
  }

  if (!isCollectionUpdate && !isProductUpdate && !isPageUpdate) {
    return NextResponse.json(
      { revalidated: false, message: "Topic ignored", topic },
      { status: 200 },
    );
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections, "max");
    // Nav menus often point at collections.
    revalidateTag(TAGS.menus, "max");
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products, "max");
  }

  if (isPageUpdate) {
    revalidateTag(TAGS.pages, "max");
  }

  return NextResponse.json(
    { revalidated: true, now: Date.now(), topic },
    { status: 200 },
  );
}
