import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsProvider } from "components/analytics/analytics-provider";
import { CartProvider } from "components/cart/cart-context";
import Footer from "components/layout/footer";
import { Navbar } from "components/layout/navbar";
import { JsonLd } from "components/seo/json-ld";
import { ShippingAnnouncement } from "components/shipping-announcement";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from "lib/seo";
import { getCart } from "lib/shopify";
import { Manrope, Syne } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";
const shopDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim() || "";
const storefrontToken =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim() || "";

const display = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-shelf-display",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-shelf-sans",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cart = getCart();

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col bg-shelf text-ink antialiased selection:bg-accent/20">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <CartProvider cartPromise={cart}>
          <AnalyticsProvider
            shopDomain={shopDomain}
            storefrontToken={storefrontToken}
          >
            <ShippingAnnouncement />
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
            <Toaster closeButton />
          </AnalyticsProvider>
          <Analytics />
          <SpeedInsights />
          {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
        </CartProvider>
      </body>
    </html>
  );
}
