import type { MetadataRoute } from "next";

const { SITE_NAME } = process.env;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME || "Nautic Controls",
    short_name: SITE_NAME || "Nautic",
    description: "Marine controls and nautical electronics",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#0a1628",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
