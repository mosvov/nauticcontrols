import Price from "components/price";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

export function ShelfTile({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/product/${product.handle}`}
      prefetch={true}
      className="group flex flex-col overflow-hidden rounded-[0.35rem] border border-line bg-tile transition hover:border-accent/45 hover:shadow-[0_10px_24px_rgba(26,35,48,0.08)]"
    >
      <div className="relative aspect-square border-b border-line bg-tile-wash">
        {product.featuredImage?.url ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            priority={priority}
            className="object-contain p-4 transition duration-300 group-hover:scale-[1.02]"
            sizes="(min-width: 1100px) 25vw, (min-width: 800px) 33vw, 50vw"
          />
        ) : null}
      </div>
      <h2 className="min-h-[2.6rem] px-3 pt-2.5 pb-0.5 text-[0.92rem] leading-snug font-semibold text-ink">
        {product.title}
      </h2>
      <div className="mt-auto flex items-center justify-between px-3 pt-2 pb-3 text-sm">
        <Price
          className="text-sm font-bold text-ink"
          amount={product.priceRange.minVariantPrice.amount}
          currencyCode={product.priceRange.minVariantPrice.currencyCode}
          currencyCodeClassName="hidden"
        />
        <span className="text-xs text-mute">
          {product.availableForSale ? "In stock" : "Out"}
        </span>
      </div>
    </Link>
  );
}
