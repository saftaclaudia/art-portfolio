// Runs after `vite build`: writes a copy of dist/index.html for each page and
// artwork (dist/gallery/<slug>.html, ...) with that page's title,
// description and image already in the HTML.
// Facebook, WhatsApp and other link previews don't run JavaScript, so without
// this every shared link would show the home page's title and image.
// The page itself is the same app: visitors see no difference.
// Vercel serves /gallery/<slug> from gallery/<slug>.html thanks to
// "cleanUrls" in vercel.json; other URLs still fall back to index.html.
// If Supabase can't be reached, only the fixed pages get their own copy.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { SITE_URL } from "../src/config.js";
import { fetchArtworks } from "./supabase.js";

const SITE_NAME = "Art by Claudia";

// Keep in sync with the <Helmet> tags of these pages
const STATIC_PAGES = [
  {
    path: "/gallery",
    title: `Gallery | ${SITE_NAME}`,
    description:
      "Browse original watercolor, acrylic, and digital artworks - filterable by medium, with pricing",
  },
  {
    path: "/about",
    title: `About | ${SITE_NAME}`,
    description:
      "Meet Claudia, a watercolor and digital artist inspired by travel, nature and color. Learn about her artistic journey",
  },
  {
    path: "/commissions",
    title: `Custom Commissions | ${SITE_NAME}`,
    description:
      "Commission a custom watercolor painting: portraits, places, pets and gifts. Learn how it works and request a quote.",
  },
  {
    path: "/contact",
    title: `Contact | ${SITE_NAME}`,
    description:
      "Get in touch with Claudia for questions, custom commissions, or inquiries about original artworks",
  },
];

const escapeAttr = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Replaces <meta property|name="key" content="..."> (it may span several
// lines), or adds it before </head> when the template doesn't have it
function setMeta(html, key, value) {
  const tag = /^og:/.test(key)
    ? `<meta property="${key}" content="${escapeAttr(value)}" />`
    : `<meta name="${key}" content="${escapeAttr(value)}" />`;
  const re = new RegExp(
    `<meta\\s+(?:property|name)="${key}"\\s+content="[^"]*"\\s*/?>`,
  );
  return re.test(html)
    ? html.replace(re, tag)
    : html.replace("</head>", `  ${tag}\n  </head>`);
}

function removeMeta(html, key) {
  return html.replace(
    new RegExp(`\\s*<meta\\s+property="${key}"\\s+content="[^"]*"\\s*/?>`),
    "",
  );
}

function buildPage(template, page) {
  const url = SITE_URL + page.path;
  let html = template.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeAttr(page.title)}</title>`,
  );
  html = setMeta(html, "description", page.description);
  html = setMeta(html, "og:title", page.title);
  html = setMeta(html, "og:description", page.description);
  html = setMeta(html, "og:url", url);
  html = setMeta(html, "og:type", page.type ?? "website");
  if (page.image) {
    html = setMeta(html, "og:image", page.image);
    // The size in the template belongs to the default og-image.jpg
    html = removeMeta(html, "og:image:width");
    html = removeMeta(html, "og:image:height");
  }
  return html;
}

function writePage(html, path) {
  const file = `dist${path}.html`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// Same text the artwork page uses for its description
function artworkDescription(a) {
  const text = (a.description ?? "").replace(/\s+/g, " ").trim();
  return text
    ? text.slice(0, 155)
    : `${a.title} - original ${a.medium} artwork by Claudia`;
}

const template = readFileSync("dist/index.html", "utf8");

for (const page of STATIC_PAGES) {
  writePage(buildPage(template, page), page.path);
}

try {
  const artworks = await fetchArtworks("slug,title,description,medium,image_url");
  let count = 0;
  for (const a of artworks) {
    if (!a.slug || !a.title) continue;
    const path = `/gallery/${a.slug}`;
    writePage(
      buildPage(template, {
        path,
        title: `${a.title} | ${SITE_NAME}`,
        description: artworkDescription(a),
        image: a.image_url,
        type: "product",
      }),
      path,
    );
    count++;
  }
  console.log(`share previews: ${STATIC_PAGES.length} pages, ${count} artworks`);
} catch (err) {
  console.warn(
    `share previews: artworks skipped, they use the home page preview (${err.message})`,
  );
}
