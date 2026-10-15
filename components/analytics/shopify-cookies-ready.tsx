"use client";

import { createContext, useContext, type ReactNode } from "react";

/** Default false so trackers wait until bootstrap reports ready. */
const ShopifyCookiesReadyContext = createContext(false);

export function ShopifyCookiesReadyProvider({
  ready,
  children,
}: {
  ready: boolean;
  children: ReactNode;
}) {
  return (
    <ShopifyCookiesReadyContext.Provider value={ready}>
      {children}
    </ShopifyCookiesReadyContext.Provider>
  );
}

export function useShopifyCookiesReady() {
  return useContext(ShopifyCookiesReadyContext);
}
