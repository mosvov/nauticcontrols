import ProductGridItems from "components/layout/product-grid-items";
import { ShelfSkeleton } from "components/layout/search/shelf-skeleton";
import { defaultSort, sorting } from "lib/constants";
import {
  getCollection,
  getCollectionProducts,
  getCollections,
} from "lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections
    .filter((collection) => collection.handle)
    .map((collection) => ({ collection: collection.handle }));
}

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} products`,
  };
}

export default function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <Suspense fallback={<ShelfSkeleton />}>
      <CategoryPageContent
        params={props.params}
        searchParams={props.searchParams}
      />
    </Suspense>
  );
}

async function CategoryPageContent({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { collection: handle } = await params;
  const { sort } = (resolvedSearchParams || {}) as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const collection = await getCollection(handle);
  if (!collection) return notFound();

  const products = await getCollectionProducts({
    collection: handle,
    sortKey,
    reverse,
  });

  return (
    <section>
      <div className="mb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
          {collection.title}
        </h1>
        {collection.description ? (
          <p className="mt-2 max-w-xl text-sm text-mute">
            {collection.description}
          </p>
        ) : null}
      </div>
      {products.length === 0 ? (
        <p className="py-3 text-mute">No products found in this collection</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </ul>
      )}
    </section>
  );
}
