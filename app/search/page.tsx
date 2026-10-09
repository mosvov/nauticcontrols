import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Catalog",
  description: "Browse Nautic Controls Signal K and NMEA 2000 hardware.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length === 1 ? "result" : "results";

  return (
    <>
      {searchValue ? (
        <p className="mb-4 text-sm text-mute">
          {products.length === 0
            ? "No products match "
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-semibold text-ink">&quot;{searchValue}&quot;</span>
        </p>
      ) : (
        <div className="mb-5">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            On the shelf
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-mute">
            Signal K kits, boards, and NMEA 2000 parts. Ships from the USA.
          </p>
        </div>
      )}
      {products.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </ul>
      ) : null}
    </>
  );
}
