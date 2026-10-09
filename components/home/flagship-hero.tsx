import Price from "components/price";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

export const FLAGSHIP_HANDLE = "halpi2-4gb-256";

export function FlagshipHero({ product }: { product?: Product }) {
  const primaryHref = product
    ? `/product/${product.handle}`
    : "/search/marine-computers";
  const primaryLabel = product ? "View HALPI2" : "Browse computers";
  const image = product?.featuredImage;

  return (
    <section className="home-reveal relative overflow-hidden border-b border-line bg-shelf-bar">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_42%,rgba(47,111,237,0.12),transparent_55%),linear-gradient(165deg,var(--color-shelf-bar)_0%,var(--color-shelf)_58%,#e4ebf4_100%)]"
      />
      <div className="relative mx-auto grid w-full max-w-[1140px] gap-8 px-4 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-center md:gap-10 md:py-14 lg:py-16">
        <div className="home-reveal-delay-1">
          <p className="text-xs tracking-[0.16em] text-mute uppercase">
            Nautic Controls
          </p>
          <h1 className="font-display mt-2 text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-bold tracking-tight text-ink">
            HALPI2 on Raspberry Pi CM5
          </h1>
          <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-mute">
            Raspberry Pi CM5 marine computer for Signal K. Ships from the US.
          </p>

          {product ? (
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <Price
                className="text-lg font-bold text-ink"
                amount={product.priceRange.minVariantPrice.amount}
                currencyCode={product.priceRange.minVariantPrice.currencyCode}
                currencyCodeClassName="!hidden"
              />
              <span className="text-sm text-mute">
                {product.availableForSale ? "In stock" : "Out of stock"}
              </span>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={primaryHref}
              className="inline-flex min-h-11 items-center justify-center rounded-[0.35rem] bg-accent px-5 text-sm font-bold text-white hover:brightness-105"
            >
              {primaryLabel}
            </Link>
            <Link
              href="/search/kits"
              className="inline-flex min-h-11 items-center justify-center rounded-[0.35rem] border border-line bg-tile px-5 text-sm font-semibold text-ink hover:border-accent/45"
            >
              Shop kits
            </Link>
          </div>
        </div>

        <div className="home-reveal-delay-2">
          <div className="relative mx-auto aspect-square w-full max-w-[420px] md:max-w-none">
            {image?.url ? (
              <Image
                src={image.url}
                alt={image.altText || product?.title || "HALPI2 marine computer"}
                fill
                priority
                className="object-contain p-2 md:p-4"
                sizes="(min-width: 1100px) 520px, (min-width: 768px) 45vw, 90vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-mute">
                HALPI2
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
