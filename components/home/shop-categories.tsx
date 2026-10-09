import Link from "next/link";

const categories = [
  { title: "Kits", href: "/search/kits", blurb: "Board, enclosure, connectors" },
  {
    title: "Development Boards",
    href: "/search/development-boards",
    blurb: "SH-ESP32, HALMET, and more",
  },
  {
    title: "Marine Computers",
    href: "/search/marine-computers",
    blurb: "HALPI2 and Pi hosts",
  },
  {
    title: "Accessories",
    href: "/search/accessories",
    blurb: "Enclosures and connectors",
  },
  {
    title: "NMEA 2000",
    href: "/search/nmea-2000",
    blurb: "Cables and backbone parts",
  },
] as const;

export function ShopCategories() {
  return (
    <section className="home-reveal-delay-3">
      <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
        Shop by type
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => (
          <li key={category.href}>
            <Link
              href={category.href}
              className="flex h-full flex-col rounded-[0.35rem] border border-line bg-tile px-4 py-3.5 transition hover:border-accent/45 hover:shadow-[0_8px_20px_rgba(26,35,48,0.06)]"
            >
              <span className="text-[0.95rem] font-semibold text-ink">
                {category.title}
              </span>
              <span className="mt-1 text-xs leading-snug text-mute">
                {category.blurb}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
