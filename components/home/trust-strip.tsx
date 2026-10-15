import Link from "next/link";

/**
 * Homepage strip under the hero. Free shipping lives in the announcement bar,
 * so this row covers the other buyer doubts: stock location, risk, catalog fit.
 */
const items = [
  { label: "US stock. Fast shipping" },
  {
    label: "2-year limited warranty",
    href: "/returns",
  },
  { label: "Signal K & NMEA 2000" },
] as const;

export function TrustStrip() {
  return (
    <section
      aria-label="Store promises"
      className="border-b border-line bg-tile"
    >
      <ul className="mx-auto flex w-full max-w-[1140px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-4 text-sm text-mute sm:justify-between sm:gap-x-6">
        {items.map((item) => (
          <li key={item.label} className="text-center sm:text-left">
            {"href" in item && item.href ? (
              <Link
                href={item.href}
                className="text-mute underline-offset-4 hover:text-ink hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
