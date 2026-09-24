# Art Portfolio & Shop – Claudia Safta 🎨

A personal art portfolio and online shop, showcasing original watercolor, acrylic, and digital paintings. Visitors can browse the gallery, view details on each piece — including multiple images, print options, and pricing — and place an order directly through the site.

## 🌐 Live Demo

[art-portfolio-smoky.vercel.app](https://art-portfolio-smoky.vercel.app)

## 🚀 Tech Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- React Router
- React Helmet Async (per-page SEO meta tags)
- Supabase (database, auth, storage, row level security)
- EmailJS (order & contact notifications)
- @dnd-kit (drag-and-drop reordering in admin)
- Deployed on Vercel

## 📁 Features

- Responsive, mobile-friendly design with a custom warm color palette
- Gallery with filtering by medium (watercolor / digital / acrylic), each card showing a swipeable image carousel
- Individual product pages with shareable URLs, multiple images, original dimensions, and optional print size/price variants
- Shopping cart with quantity support (persisted in local storage) and checkout flow
- Order notifications sent by email
- Admin panel (login-protected, with password reset) to add, edit, and delete artworks, including multi-image uploads
- Admin artworks are grouped by medium, with drag-and-drop reordering within each category
- Row Level Security (RLS) on the database — only authenticated users can modify data
- Per-page SEO meta tags (title, description, Open Graph) plus `robots.txt` and `sitemap.xml`

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

Artworks are stored in Supabase, in a table called `artworks`, with the following columns:

`title`, `description`, `medium`, `price`, `artist`, `image_url`, `images` (jsonb array of additional image URLs), `slug`, `in_stock`, `dimensions`, `print_options` (jsonb array of `{ size, price }`), `sort_order`, `created_at`.

## 🔐 Admin Access

The `/admin` route is protected and requires a Supabase authenticated account. Manage artworks (add/edit/delete, with multi-image upload, print options, and drag-and-drop reordering) from the admin panel once logged in. A password reset flow is available at `/admin/login`.

## 🚀 Deployment

The site is deployed on Vercel, connected to this repo — every push to `main` triggers an automatic redeploy. SPA routing is handled via `vercel.json` rewrites.
