import { ShelfTile } from "components/product/shelf-tile";
import { getCollectionProducts, getProducts } from "lib/shopify";
import Link from "next/link";

export const metadata = {
  description:
    "Nautic Controls - the US home for Signal K hardware. Hat Labs gateway and engine-monitoring kits, ships from the USA.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  let featured = await getCollectionProducts({
    collection: "hidden-homepage-featured-items",
  });

  if (featured.length < 4) {
    featured = await getProducts({});
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1140px] flex-1 px-4 pt-8 pb-12">
        <section className="max-w-2xl">
          <p className="text-xs tracking-[0.16em] text-mute uppercase">
            Nautic Controls
          </p>
          <h1 className="font-display mt-2 text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-bold tracking-tight text-ink">
            On the shelf
          </h1>
          <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-mute">
            Signal K and NMEA 2000 kits, boards, and connectors. Ships from the
            USA.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="inline-flex min-h-11 items-center justify-center rounded-[0.35rem] bg-accent px-5 text-sm font-bold text-white hover:brightness-105"
            >
              Browse catalog
            </Link>
            <Link
              href="/search/kits"
              className="inline-flex min-h-11 items-center justify-center rounded-[0.35rem] border border-line bg-tile px-5 text-sm font-semibold text-ink hover:border-accent/45"
            >
              View kits
            </Link>
          </div>
        </section>

        {featured.length > 0 ? (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                Featured hardware
              </h2>
              <Link href="/search" className="text-sm text-mute hover:text-ink">
                Full shelf →
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {featured.slice(0, 8).map((product, index) => (
                <li key={product.handle}>
                  <ShelfTile product={product} priority={index < 2} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
