import Link from "next/link";
import type { ReactNode } from "react";

const { COMPANY_NAME, SITE_NAME } = process.env;

const shopLinks = [
  { href: "/search", label: "Catalog" },
  { href: "/search/kits", label: "Kits" },
] as const;

const helpLinks: { href: string; label: string; external?: boolean }[] = [
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns & Warranty" },
  { href: "mailto:info@nauticcontrols.com", label: "Contact", external: true },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/fcc", label: "FCC" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

function FooterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const className =
    "block py-1.5 text-sm text-mute transition-colors hover:text-ink";

  if (external) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-ink">
        {title}
      </h2>
      <ul className="mt-3 space-y-0.5">{children}</ul>
    </div>
  );
}

export default async function Footer() {
  "use cache";

  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="mt-auto border-t border-line bg-shelf text-sm text-mute">
      <div className="mx-auto w-full max-w-[1140px] px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10">
          <div>
            <Link
              className="font-display text-base font-bold tracking-tight text-ink"
              href="/"
            >
              {SITE_NAME}
            </Link>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-mute">
              Marine and RV electronics: boards, kits, and NMEA 2000 / Signal K
              gear. US stock. Free ground shipping on orders $75+ in the lower
              48.
            </p>
            <a
              href="mailto:info@nauticcontrols.com"
              className="mt-2 inline-block text-xs text-accent underline underline-offset-4 hover:text-ink"
            >
              info@nauticcontrols.com
            </a>
          </div>

          <FooterColumn title="Shop">
            {shopLinks.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href} label={item.label} />
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Help">
            {helpLinks.map((item) => (
              <li key={item.href}>
                <FooterLink
                  href={item.href}
                  label={item.label}
                  external={item.external}
                />
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Company">
            {companyLinks.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href} label={item.label} />
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-1 border-t border-line pt-6 md:flex-row md:items-center">
          <p className="text-xs">
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".") ? "." : ""}{" "}
            All rights reserved.
          </p>
          <p className="text-xs">Marine &amp; RV electronics</p>
        </div>
      </div>
    </footer>
  );
}
