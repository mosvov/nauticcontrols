"use client";

import { usePathname } from "next/navigation";
import { ReactNode, Suspense } from "react";

function StoreChromeInner({
  navbar,
  children,
}: {
  navbar: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isDesignRoute = pathname?.startsWith("/design");

  if (isDesignRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      {children}
    </>
  );
}

/** Hide the default Commerce chrome on design-variant routes. */
export function StoreChrome({
  navbar,
  children,
}: {
  navbar: ReactNode;
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <>
          {navbar}
          {children}
        </>
      }
    >
      <StoreChromeInner navbar={navbar}>{children}</StoreChromeInner>
    </Suspense>
  );
}
