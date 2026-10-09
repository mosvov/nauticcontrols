const pillars = [
  {
    title: "US stock",
    body: "Boards, kits, and NMEA parts ready to ship from the US. No international wait for lower-48 orders.",
  },
  {
    title: "Open and compatible",
    body: "Signal K and NMEA 2000 gear with manufacturer docs and source where the product is open hardware.",
  },
  {
    title: "Kits that install",
    body: "Board, enclosure, and connectors bundled when we offer a kit, plus US email support if you hit a snag.",
  },
] as const;

export function WhyNautic() {
  return (
    <section>
      <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
        Why buy here
      </h2>
      <ul className="mt-4 grid gap-6 sm:grid-cols-3">
        {pillars.map((pillar) => (
          <li key={pillar.title}>
            <h3 className="text-[0.95rem] font-semibold text-ink">
              {pillar.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-mute">
              {pillar.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
