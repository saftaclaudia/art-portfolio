// Shared helper for the build scripts: reads public artwork data from
// Supabase with the anon key (the same read access the site itself has).

// Locally the Supabase keys live in .env; on Vercel they are already set
try {
  process.loadEnvFile(".env");
} catch {
  // no .env file: use the environment as it is
}

export async function fetchArtworks(columns) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env variables are missing");

  const res = await fetch(`${url}/rest/v1/artworks?select=${columns}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Supabase answered ${res.status}`);
  return res.json();
}
