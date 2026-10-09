import Link from "next/link";

const items = [
  { label: "Ships from USA" },
  {
    label: "Free ground $75+",
    href: "/shipping",
  },
  { label: "Signal K / NMEA 2000" },
  { label: "Florida warehouse stock" },
] as const;

export function TrustStrip() {
  return (
    <section
      aria-label="Store promises"
      className="border-b border-line bg-tile"
    >
      <ul className="mx-auto flex w-full max-w-[1140px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 text-sm text-mute">
        {items.map((item) => (
          <li key={item.label} className="min-w-[40%] sm:min-w-0">
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
