// Runs after `vite build`: writes dist/sitemap.xml with the fixed pages
// plus one entry per artwork, read from Supabase.
// If Supabase can't be reached, the static public/sitemap.xml copied by Vite
// is kept, so the build never fails because of the sitemap.
import { writeFileSync } from "node:fs";
import { SITE_URL } from "../src/config.js";
import { fetchArtworks } from "./supabase.js";

const STATIC_PAGES = [
  { path: "/", priority: "1.0" },
  { path: "/gallery", priority: "0.9" },
  { path: "/about", priority: "0.5" },
  { path: "/commissions", priority: "0.6" },
  { path: "/contact", priority: "0.5" },
];

const escapeXml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

try {
  const rows = await fetchArtworks("slug");
  const slugs = rows.map((r) => r.slug).filter(Boolean);

  const entries = [
    ...STATIC_PAGES,
    ...slugs.map((slug) => ({
      path: `/gallery/${encodeURIComponent(slug)}`,
      priority: "0.7",
    })),
  ]
    .map(
      (p) =>
        `  <url>\n    <loc>${escapeXml(SITE_URL + p.path)}</loc>\n    <priority>${p.priority}</priority>\n  </url>`,
    )
    .join("\n");

  writeFileSync(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
  );
  console.log(`sitemap.xml: ${slugs.length} artworks added`);
} catch (err) {
  console.warn(`sitemap.xml: kept the static version (${err.message})`);
}
