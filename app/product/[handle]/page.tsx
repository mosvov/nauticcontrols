import { Gallery } from "components/product/gallery";
import {
  BuyPanelSkeleton,
  PdpSkeleton,
} from "components/product/pdp-skeleton";
import { ProductDescription } from "components/product/product-description";
import { ShelfTile } from "components/product/shelf-tile";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { getProduct, getProductRecommendations, getProducts } from "lib/shopify";
import type { Image } from "lib/shopify/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams() {
  const products = await getProducts({});
  return products.map((product) => ({ handle: product.handle }));
}

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  return (
    <Suspense fallback={<PdpSkeleton />}>
      <ProductPageContent params={props.params} />
    </Suspense>
  );
}

async function ProductPageContent({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto w-full max-w-[1140px] flex-1 px-4 pt-4 pb-24 md:pb-10">
        <Link
          href="/search"
          className="mb-4 inline-block text-sm text-mute hover:text-ink"
        >
          ← Back to shelf
        </Link>

        <div className="grid gap-5 md:grid-cols-[1.35fr_0.75fr] md:items-start">
          <div>
            <Suspense
              fallback={
                <div className="aspect-square max-h-[min(70vh,560px)] rounded-[0.35rem] border border-line bg-tile md:max-h-none" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>

          <Suspense fallback={<BuyPanelSkeleton />}>
            <ProductDescription product={product} />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <RelatedProducts id={product.id} />
        </Suspense>
      </div>
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="pt-10">
      <h2 className="font-display mb-4 text-2xl font-bold tracking-tight text-ink">
        Related on the shelf
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {relatedProducts.slice(0, 4).map((product) => (
          <li key={product.handle}>
            <ShelfTile product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
