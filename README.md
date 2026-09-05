# Art Portfolio & Shop – Claudia Safta 🎨

A personal art portfolio and online shop, showcasing original watercolor, acrylic, and digital paintings. Visitors can browse the gallery, view details on each piece, and place an order directly through the site.

## 🌐 Live Demo

Coming soon...

## 🚀 Tech Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- React Router
- Supabase (database, auth, storage)
- EmailJS (order & contact notifications)

## 📁 Features

- Responsive, mobile-friendly design with a custom warm color palette
- Gallery with filtering by medium (watercolor / digital / acrylic)
- Individual product pages with shareable URLs
- Shopping cart (persisted in local storage) and checkout flow
- Order notifications sent by email
- Admin panel (login-protected) to add, edit, and delete artworks, including image uploads
- Row Level Security (RLS) on the database — only authenticated users can modify data

## 🛠️ Getting Started

1. Clone the repo and install dependencies:

```bash
   npm install
```

2. Create a `.env` file in the project root (see `.env.example` for the required variables):

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

Artworks are stored in Supabase, in a table called `artworks`, with the following columns: `title`, `description`, `medium`, `price`, `artist`, `image_url`, `slug`, `in_stock`, `created_at`.

## 🔐 Admin Access

The `/admin` route is protected and requires a Supabase authenticated account. Manage artworks (add/edit/delete, with image upload) from the admin panel once logged in.
