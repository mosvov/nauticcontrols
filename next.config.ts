export default {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
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
