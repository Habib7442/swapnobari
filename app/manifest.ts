import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Swapnobari: Plan, Vastu & Build Your Home",
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#13294B",
    lang: "en-IN",
    icons: [
      { src: "/favicon_io/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon_io/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
