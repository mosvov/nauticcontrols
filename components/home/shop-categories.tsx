import {
  ArrowsRightLeftIcon,
  CpuChipIcon,
  CubeIcon,
  PuzzlePieceIcon,
  ServerStackIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const categories: {
  title: string;
  href: string;
  blurb: string;
  icon: Icon;
}[] = [
  {
    title: "Kits",
    href: "/search/kits",
    blurb: "Board + enclosure, ready to assemble",
    icon: CubeIcon,
  },
  {
    title: "Development Boards",
    href: "/search/development-boards",
    blurb: "SH-ESP32, HALMET, bare modules",
    icon: CpuChipIcon,
  },
  {
    title: "Marine Computers",
    href: "/search/marine-computers",
    blurb: "HALPI2 and Pi hosts",
    icon: ServerStackIcon,
  },
  {
    title: "Accessories",
    href: "/search/accessories",
    blurb: "Enclosures, glands, small parts",
    icon: PuzzlePieceIcon,
  },
  {
    title: "NMEA 2000",
    href: "/search/nmea-2000",
    blurb: "Cables, tees, backbone parts",
    icon: ArrowsRightLeftIcon,
  },
];

export function ShopCategories() {
  return (
    <section id="shop-by-type" className="home-reveal-delay-3">
      <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
        Shop by type
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <li key={category.href}>
              <Link
                href={category.href}
                className="group flex h-full items-start gap-3 rounded-[0.35rem] border border-line bg-tile px-4 py-3.5 transition hover:border-accent/45 hover:shadow-[0_8px_20px_rgba(26,35,48,0.06)]"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[0.3rem] bg-shelf-bar text-mute transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                  <Icon aria-hidden className="size-5" />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="block text-[0.95rem] leading-snug font-semibold text-ink">
                    {category.title}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-mute">
                    {category.blurb}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
