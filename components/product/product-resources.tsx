import Link from "next/link";
import { Product } from "lib/shopify/types";

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-4 hover:brightness-110"
    >
      {children}
    </a>
  );
}

export function ProductResources({ product }: { product: Product }) {
  const docsUrl = product.docsUrl?.value;
  const firmwareUrl = product.firmwareUrl?.value;
  const complianceUrl = product.complianceUrl?.value;
  const installGuideUrl = product.installGuideUrl?.value;
  const warrantySummary = product.warrantySummary?.value;
  const fccSummary = product.fccSummary?.value;
  const hatlabsSku = product.hatlabsSku?.value;

  const hasLinks = Boolean(
    docsUrl || firmwareUrl || complianceUrl || installGuideUrl,
  );
  const hasPolicy = Boolean(warrantySummary || fccSummary || hatlabsSku);

  if (!hasLinks && !hasPolicy) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4 border-t border-line pt-5 text-sm">
      {hasLinks ? (
        <div>
          <h2 className="mb-2 text-base font-semibold text-ink">
            Documentation
          </h2>
          <ul className="space-y-1 text-mute">
            {docsUrl ? (
              <li>
                <ExternalLink href={docsUrl}>Product docs (Hat Labs)</ExternalLink>
              </li>
            ) : null}
            {firmwareUrl ? (
              <li>
                <ExternalLink href={firmwareUrl}>
                  Firmware / examples
                </ExternalLink>
              </li>
            ) : null}
            {installGuideUrl ? (
              <li>
                <ExternalLink href={installGuideUrl}>
                  Nautic install guide
                </ExternalLink>
              </li>
            ) : null}
            {complianceUrl ? (
              <li>
                <ExternalLink href={complianceUrl}>
                  Manufacturer compliance
                </ExternalLink>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {hasPolicy ? (
        <div className="space-y-2 text-mute">
          {hatlabsSku ? (
            <p>
              <span className="text-mute/80">Manufacturer SKU: </span>
              {hatlabsSku}
            </p>
          ) : null}
          {warrantySummary ? (
            <p>
              {warrantySummary
                .replace(/\s*See Returns & Warranty\.?$/i, "")
                .trim()}{" "}
              <Link
                href="/returns"
                className="text-accent underline underline-offset-4"
              >
                Returns &amp; Warranty
              </Link>
            </p>
          ) : null}
          {fccSummary ? (
            <p>
              {fccSummary
                .replace(/\s*See FCC \/ Responsible Party\.?$/i, "")
                .trim()}{" "}
              <Link
                href="/fcc"
                className="text-accent underline underline-offset-4"
              >
                FCC / Responsible Party
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
