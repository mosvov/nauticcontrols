import Price from "components/price";
import { ShopifyImage } from "components/shopify-image";
import type { Product } from "lib/shopify/types";
import Link from "next/link";

export const FLAGSHIP_HANDLE = "halpi2-4gb-256";

export function FlagshipHero({ product }: { product?: Product }) {
  const primaryHref = product
    ? `/product/${product.handle}`
    : "/search/marine-computers";
  const primaryLabel = product ? "Shop HALPI2" : "Browse computers";
  const image = product?.featuredImage;

  return (
    <section className="home-reveal relative overflow-hidden border-b border-line bg-shelf-bar">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_48%,rgba(47,111,237,0.16),transparent_52%),linear-gradient(165deg,var(--color-shelf-bar)_0%,var(--color-shelf)_50%,#dfe7f2_100%)]"
      />
      <div className="relative mx-auto grid w-full max-w-[1140px] gap-8 px-4 py-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center md:gap-6 md:py-12 lg:gap-8 lg:py-14">
        <div className="home-reveal-delay-1 md:pr-2">
          <h1 className="font-display text-[clamp(2.8rem,6.5vw,4.4rem)] leading-[0.9] font-bold tracking-tight text-balance text-ink">
            HALPI2
          </h1>
          <p className="font-display mt-2 text-[clamp(1.15rem,2.4vw,1.55rem)] leading-snug font-semibold tracking-tight text-ink">
            Raspberry Pi CM5 marine computer
          </p>
          <p className="mt-3 max-w-md text-[1.02rem] leading-relaxed text-mute">
            Signal K-ready. Ships from the US.
          </p>

          {product ? (
            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <Price
                className="text-xl font-bold text-ink"
                amount={product.priceRange.minVariantPrice.amount}
                currencyCode={product.priceRange.minVariantPrice.currencyCode}
                currencyCodeClassName="!hidden"
              />
              <span className="text-[0.95rem] text-mute">
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
              Signal K kits
            </Link>
          </div>
        </div>

        <div className="home-reveal-delay-2 relative mx-auto w-full max-w-[560px] md:mx-0 md:max-w-[min(100%,560px)] xl:max-w-[min(100%,520px)] md:justify-self-end">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(47,111,237,0.14)_0%,transparent_68%)] blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[18%] bottom-[3%] h-[12%] rounded-[100%] bg-[radial-gradient(ellipse,rgba(26,35,48,0.14)_0%,transparent_70%)] blur-md"
          />
          {image?.url ? (
            <ShopifyImage
              src={image.url}
              alt={image.altText || product?.title || "HALPI2 marine computer"}
              width={image.width || 1200}
              height={image.height || 1200}
              priority
              className="relative z-10 mx-auto h-auto max-h-[min(52vh,420px)] w-full object-contain drop-shadow-[0_16px_28px_rgba(26,35,48,0.12)] md:max-h-[min(56vh,460px)] xl:max-h-[440px]"
              sizes="(min-width: 1280px) 520px, (min-width: 768px) 48vw, 94vw"
            />
          ) : (
            <div className="flex min-h-[280px] items-center justify-center text-sm text-mute">
              HALPI2
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
