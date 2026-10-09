import Link from "next/link";

import FooterMenu from "components/layout/footer-menu";
import { getMenu } from "lib/shopify";
import { Suspense } from "react";

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  "use cache";

  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const skeleton = "h-5 w-full animate-pulse rounded-[0.25rem] bg-line";
  const menu = await getMenu("next-js-frontend-footer-menu");
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="mt-auto border-t border-line bg-shelf text-sm text-mute">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-6 px-4 py-10 md:flex-row md:gap-12">
        <div>
          <Link
            className="font-display text-base font-bold tracking-tight text-ink"
            href="/"
          >
            {SITE_NAME}
          </Link>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-mute">
            US home for Signal K hardware. Ships from the USA. Free US ground on
            orders $75+ (contiguous US).{" "}
            <Link href="/shipping" className="text-accent underline underline-offset-4 hover:text-ink">
              Shipping
            </Link>
          </p>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[160px] w-[180px] flex-col gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>
        <div className="flex items-center gap-4 text-xs md:ml-auto">
          <Link href="/search" className="hover:text-ink">
            Catalog
          </Link>
          <a href="mailto:info@nauticcontrols.com" className="hover:text-ink">
            Contact
          </a>
        </div>
      </div>
      <div className="border-t border-line py-5">
        <div className="mx-auto flex w-full max-w-[1140px] flex-col items-center justify-between gap-1 px-4 md:flex-row">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".") ? "." : ""}{" "}
            All rights reserved.
          </p>
          <p className="text-xs">Precision Marine Control Systems</p>
        </div>
      </div>
    </footer>
  );
}
