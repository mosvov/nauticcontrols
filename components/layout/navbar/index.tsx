import CartModal from "components/cart/modal";
import { getMenu } from "lib/shopify";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const { SITE_NAME } = process.env;

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");

  return (
    <nav className="relative border-b border-line/70 bg-shelf-bar/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between gap-4 px-4 py-3.5 lg:px-4">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="block flex-none md:hidden">
            <Suspense
              fallback={
                <div className="h-10 w-10 animate-pulse rounded-[0.35rem] bg-accent/40" />
              }
            >
              <MobileMenu menu={menu} />
            </Suspense>
          </div>
          <Link
            href="/"
            prefetch={true}
            className="font-display text-xl font-bold tracking-tight text-ink"
          >
            {SITE_NAME}
          </Link>
          {menu.length ? (
            <ul className="hidden items-center gap-5 text-sm md:flex">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-mute transition-colors hover:text-ink"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="hidden flex-1 justify-center md:flex md:max-w-xs lg:max-w-sm">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>

        <div className="flex justify-end">
          <Suspense
            fallback={
              <div className="h-10 w-10 animate-pulse rounded-[0.35rem] bg-accent/40" />
            }
          >
            <CartModal />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
