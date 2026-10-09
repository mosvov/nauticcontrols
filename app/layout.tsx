import { CartProvider } from "components/cart/cart-context";
import Footer from "components/layout/footer";
import { Navbar } from "components/layout/navbar";
import { ShippingAnnouncement } from "components/shipping-announcement";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { Manrope, Syne } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-shelf-display",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-shelf-sans",
});

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
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
        <CartProvider cartPromise={cart}>
          <ShippingAnnouncement />
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
          <Toaster closeButton />
        </CartProvider>
      </body>
    </html>
  );
}
