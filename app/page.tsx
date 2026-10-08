import { Carousel } from "components/carousel";
import { ComingSoon } from "components/coming-soon";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";

export const metadata = {
  description:
    "Nautic Controls - the US home for Signal K hardware. Domestic Florida stock of Hat Labs gateway and engine-monitoring kits.",
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
