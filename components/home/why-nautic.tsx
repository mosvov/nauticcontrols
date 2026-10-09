const pillars = [
  {
    title: "US stock",
    body: "Hat Labs hardware on the shelf in Florida. Faster than EU dropship for contiguous US orders.",
  },
  {
    title: "Open hardware",
    body: "Genuine Hat Labs boards and designs. You buy it, you own it, with source and docs available.",
  },
  {
    title: "Kits and docs",
    body: "Installation kits and a US support path so Signal K and NMEA 2000 builds leave the bench sooner.",
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
