import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "*",
          "GPTBot",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: "/",
        // Matches exactly "/c" or "/c?..." — not "/count", which must stay crawlable.
        disallow: ["/c$", "/c?"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
