import type { Metadata } from "next";
import type { Product } from "lib/shopify/types";
import { baseUrl } from "lib/utils";

/** Canonical public host for SEO (www). Prefers env override for previews. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_ENV === "production"
    ? "https://www.nauticcontrols.com"
    : baseUrl);

export const SITE_NAME = "Nautic Controls";

export const DEFAULT_DESCRIPTION =
  "Marine and RV electronics: HALPI2, Signal K kits, boards, and NMEA 2000 parts. US stock. Free ground shipping on orders $75+.";

export const DEFAULT_TITLE =
  "Marine and RV Electronics US Stock | Nautic Controls";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function canonicalAlternates(path: string): Metadata["alternates"] {
  return { canonical: absoluteUrl(path) };
}

export function socialMetadata({
  title,
  description,
  images,
  url,
  type = "website",
}: {
  title: string;
  description?: string | null;
  images?: NonNullable<Metadata["openGraph"]>["images"];
  url?: string;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  const desc = description || DEFAULT_DESCRIPTION;
  return {
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description: desc,
      ...(url ? { url } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      ...(images ? { images } : {}),
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/images/logo.png"),
    email: "info@nauticcontrols.com",
    description: DEFAULT_DESCRIPTION,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function productJsonLd(product: Product) {
  const url = absoluteUrl(`/product/${product.handle}`);
  const sku =
    product.variants[0]?.sku ||
    product.hatlabsSku?.value ||
    undefined;
  const images = [
    product.featuredImage?.url,
    ...product.images.map((image) => image.url),
  ].filter((value, index, list): value is string =>
    Boolean(value) && list.indexOf(value) === index,
  );

  const offerCount = product.variants.length || 1;
  const low = product.priceRange.minVariantPrice.amount;
  const high = product.priceRange.maxVariantPrice.amount;
  const currency = product.priceRange.minVariantPrice.currencyCode;
  const availability = product.availableForSale
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  const offers =
    offerCount === 1
      ? {
          "@type": "Offer",
          url,
          priceCurrency: currency,
          price: low,
          availability,
          itemCondition: "https://schema.org/NewCondition",
        }
      : {
          "@type": "AggregateOffer",
          url,
          priceCurrency: currency,
          lowPrice: low,
          highPrice: high,
          offerCount,
          availability,
          itemCondition: "https://schema.org/NewCondition",
        };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: images,
    url,
    ...(sku ? { sku } : {}),
    ...(product.vendor
      ? {
          brand: {
            "@type": "Brand",
            name: product.vendor,
          },
        }
      : {}),
    offers,
  };
}
