export default {
  experimental: {
    // Keep useCache until cart/layout are migrated to Cache Components + Suspense.
    useCache: true,
    // TypeScript 7 has no compiler API; Next needs the tsc CLI backend.
    useTypeScriptCli: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
};
