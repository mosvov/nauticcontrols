import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { ShippingNote } from "components/shipping-note";
import { Product } from "lib/shopify/types";
import { ProductResources } from "./product-resources";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="rounded-[0.35rem] border border-line bg-tile p-5 md:sticky md:top-4 md:p-6">
      <h1 className="font-display text-[clamp(1.7rem,3vw,2.3rem)] leading-[1.05] font-bold tracking-tight text-ink">
        {product.title}
      </h1>
      <div className="mt-3 flex items-baseline gap-3">
        <Price
          className="text-xl font-bold text-ink"
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          currencyCodeClassName="text-sm font-semibold text-mute"
        />
        <span className="text-sm text-mute">
          {product.availableForSale ? "In stock" : "Unavailable"}
        </span>
      </div>

      <div className="mt-4">
        <VariantSelector options={product.options} variants={product.variants} />
      </div>

      {product.descriptionHtml ? (
        <Prose
          className="mt-4 max-w-none text-sm leading-relaxed text-mute prose-headings:font-display prose-headings:text-ink prose-a:text-accent prose-strong:text-ink"
          html={product.descriptionHtml}
        />
      ) : product.description ? (
        <p className="mt-4 text-sm leading-relaxed text-mute">
          {product.description}
        </p>
      ) : null}

      <div className="mt-5 hidden md:block">
        <AddToCart product={product} />
      </div>

      <ShippingNote
        productPriceUsd={Number(product.priceRange.maxVariantPrice.amount)}
      />

      <ProductResources product={product} />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-tile p-3 md:hidden">
        <AddToCart product={product} />
      </div>
    </div>
  );
}
