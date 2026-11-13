# Art Portfolio & Shop – Claudia Popescu 🎨

A personal art portfolio and online shop for original watercolor, acrylic, and digital artworks. Visitors can browse the gallery, read about each piece, choose between the original (with or without a frame) and prints, and place an order through the site.

## 🌐 Live Demo

[art-portfolio-smoky.vercel.app](https://art-portfolio-smoky.vercel.app)

## 🚀 Tech Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- React Router (with route-level code splitting via `React.lazy` and `Suspense`)
- React Helmet Async (per-page SEO meta tags)
- Supabase (PostgreSQL database, auth, file storage, row level security)
- EmailJS (order and contact notifications)
- @dnd-kit (drag-and-drop reordering in admin)
- Deployed on Vercel

## ✨ Features

### Storefront

- Responsive design with a custom warm color palette
- Gallery with filtering by medium (watercolor / acrylic / digital)
- Uniform square gallery cards showing title, price, medium, and size; the price adapts to availability (`$50`, `Prints from $25`, or `Sold`)
- Each card is a single accessible link that opens the artwork, with a swipeable image carousel inside
- Product pages with shareable URLs:
  - Main image that fits any artwork shape without empty bands, thumbnails, and a full-screen lightbox with keyboard controls
  - Clear text hierarchy: title, price, story (split into paragraphs), and a short details list
  - Options for the original or prints, an optional frame, and a quantity selector for prints
  - Digital works are sold as a "Digital Master File" (no frame option)
  - Delivery, returns, and materials information that adapts to what is actually for sale (physical vs. digital)
  - "You may also like" suggestions and Previous / Next navigation between artworks
- Shopping cart persisted in local storage; originals are one of a kind and cannot be added twice
- Checkout by email request: the order email lists each item with its variant, quantity, and subtotal, plus the shipping address, country, and a notes field (framing, signature, gift message)
- Per-page SEO meta tags (title, description, Open Graph), `robots.txt`, and `sitemap.xml`

### Admin

- Login-protected panel with password reset and an account page (display name, change password)
- Add, edit, and delete artworks, with multi-image upload (images are resized in the browser before upload)
- Up to three print sizes per artwork, a size field, a story, and a one-per-line "details" list
- Artworks grouped by medium, with drag-and-drop reordering within each group
- Admin pages are code-split, so public visitors never download the admin code

### Configuration

`src/config.js` holds a feature flag, `SELL_PRINTS`, that turns print sales on or off without touching any data.

## 🧱 Project Structure

```
src/
├── components/   Gallery, ProductInfo, SimilarArtworks, ArtworkPager, ProtectedRoute, ScrollToTop…
├── pages/        ProductPage, CartPage, CheckoutPage, OrderConfirmedPage, About, Admin* pages…
├── context/      Cart and Auth providers, with custom hooks (useCart, useAuth)
├── config.js     Shop feature flags
└── supabaseClient.js
```

## 🛠️ Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

3. Run the dev server:

```bash
npm run dev
```

## 🗄️ Database

Artworks live in a Supabase table called `artworks`:

`title`, `description`, `details` (text, one detail per line), `medium`, `price`, `artist`, `image_url`, `images` (jsonb array of additional image URLs), `slug`, `in_stock`, `dimensions`, `print_options` (jsonb array of `{ size, price }`), `sort_order`, `created_at`.

Images are stored in a public Supabase Storage bucket.

## 🔐 Security

- **Row Level Security (RLS)** is enabled: anyone can read artworks, but only authenticated users can insert, update, or delete. Storage has its own policies with the same split.
- The Supabase `anon` key is shipped to the browser by design. Access control comes from the RLS policies, not from hiding the key.
- The `/admin` routes are protected in the interface by a route guard, but that is only a convenience: the database enforces the real rules.
- `.env` is git-ignored. Environment variables are also configured in Vercel.

## 📌 Known Limitations

- Orders are placed by email request, with no online payment. Shipping and framing costs are confirmed manually by email before payment, so they are not included in the cart total.
- Cart prices are stored in the browser. A payment-enabled version would recompute prices on the server at checkout.
- `sitemap.xml` is static and does not list individual artwork pages.

## 🚀 Deployment

The site is deployed on Vercel, connected to this repo: every push to `main` triggers an automatic redeploy. SPA routing is handled via `vercel.json` rewrites. Environment variables are set in the Vercel project settings, and changing one requires a redeploy.
