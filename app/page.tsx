import { Carousel } from "components/carousel";
import { ComingSoon } from "components/coming-soon";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";

export const metadata = {
  description:
    "Precision Marine Controls & Vessel Automation built with Next.js and Shopify Headless.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <ComingSoon />
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
