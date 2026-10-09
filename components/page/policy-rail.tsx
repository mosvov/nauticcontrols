import type { TocItem } from "lib/page-toc";
import Link from "next/link";
import type { ReactNode } from "react";

export const POLICY_LINKS = [
  { handle: "shipping", label: "Shipping" },
  { handle: "returns", label: "Returns & Warranty" },
  { handle: "privacy", label: "Privacy" },
  { handle: "terms", label: "Terms" },
  { handle: "fcc", label: "FCC / Responsible Party" },
  { handle: "about", label: "About" },
] as const;

function RailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-[0.14em] text-mute uppercase">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function TocList({ toc, label }: { toc: TocItem[]; label: string }) {
  return (
    <nav aria-label={label}>
      <ul className="space-y-2">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block text-sm leading-snug text-mute transition-colors hover:text-ink"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Compact jump list for small screens (desktop TOC lives in the rail). */
export function MobilePageToc({ toc }: { toc: TocItem[] }) {
  if (toc.length === 0) return null;

  return (
    <details className="mb-6 rounded-[0.35rem] border border-line bg-shelf px-4 py-3 md:hidden">
      <summary className="cursor-pointer text-xs font-semibold tracking-[0.14em] text-mute uppercase">
        On this page
      </summary>
      <div className="mt-3 border-t border-line pt-3">
        <TocList toc={toc} label="On this page" />
      </div>
    </details>
  );
}

export default function PolicyRail({
  currentHandle,
  toc,
}: {
  currentHandle: string;
  toc: TocItem[];
}) {
  const related = POLICY_LINKS.filter(
    (item) => item.handle !== currentHandle,
  );

  return (
    <aside className="w-full flex-none md:w-[240px] md:max-w-[240px]">
      <div className="space-y-8 rounded-[0.35rem] border border-line bg-tile p-5 md:sticky md:top-4">
        {toc.length > 0 ? (
          <div className="hidden md:block">
            <RailSection title="On this page">
              <TocList toc={toc} label="On this page" />
            </RailSection>
          </div>
        ) : null}

        <RailSection title="Related policies">
          <ul className="space-y-2">
            {related.map((item) => (
              <li key={item.handle}>
                <Link
                  href={`/${item.handle}`}
                  className="block text-sm leading-snug text-mute transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </RailSection>

        <RailSection title="Need help?">
          <p className="text-sm leading-relaxed text-mute">
            Questions about an order or these policies:
          </p>
          <a
            href="mailto:info@nauticcontrols.com"
            className="mt-2 inline-block text-sm text-accent underline underline-offset-4 hover:text-ink"
          >
            info@nauticcontrols.com
          </a>
        </RailSection>
      </div>
    </aside>
  );
}
