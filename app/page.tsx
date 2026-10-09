import { FlagshipHero, FLAGSHIP_HANDLE } from "components/home/flagship-hero";
import { ShopCategories } from "components/home/shop-categories";
import { TrustStrip } from "components/home/trust-strip";
import { WhyNautic } from "components/home/why-nautic";
import { ShelfTile } from "components/product/shelf-tile";
import {
  getCollectionProducts,
  getProduct,
  getProducts,
} from "lib/shopify";
import type { Product } from "lib/shopify/types";
import Link from "next/link";

export const metadata = {
  description:
    "HALPI2 and Hat Labs Signal K hardware in US stock. Marine computers, kits, boards, and NMEA 2000 gear. Ships from Florida.",
  openGraph: {
    type: "website",
  },
};

function withoutFlagship(products: Product[]) {
  return products.filter((product) => product.handle !== FLAGSHIP_HANDLE);
}

export default async function HomePage() {
  const [flagship, featuredRaw] = await Promise.all([
    getProduct(FLAGSHIP_HANDLE),
    getCollectionProducts({
      collection: "hidden-homepage-featured-items",
    }),
  ]);

  let featured = withoutFlagship(featuredRaw);
  if (featured.length < 4) {
    featured = withoutFlagship(await getProducts({}));
  }
  featured = featured.slice(0, 8);

  return (
    <>
      <FlagshipHero product={flagship} />
      <TrustStrip />

      <div className="mx-auto w-full max-w-[1140px] flex-1 px-4 pt-10 pb-14">
        <ShopCategories />

        {featured.length > 0 ? (
          <section className="mt-12">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                Featured hardware
              </h2>
              <Link href="/search" className="text-sm text-mute hover:text-ink">
                Full shelf →
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((product, index) => (
                <li key={product.handle}>
                  <ShelfTile product={product} priority={index < 2} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-14">
          <WhyNautic />
        </div>
      </div>
    </>
  );
}
