"use client";

import { createContext, useContext } from "react";

const ShopifyCookiesReadyContext = createContext(true);

export function ShopifyCookiesReadyProvider({
  ready,
  children,
}: {
  ready: boolean;
  children: React.ReactNode;
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
