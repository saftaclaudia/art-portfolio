import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function AdminPage() {
  const { logout } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtworks();
  }, []);

  async function fetchArtworks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setArtworks(data ?? []);
    setLoading(false);
  }

  async function handleDelete(id, title) {
    const confirmed = window.confirm(
      `Delete "${title}"? This cannot be undone`,
    );
    if (!confirmed) return;

    const { error } = await supabase.from("artworks").delete().eq("id", id);

    if (!error) {
      setArtworks((prev) => prev.filter((a) => a.id !== id));
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-display font mediu text-ink">
          Admin Panel
        </h1>
        <div className="flex gap-3">
          <Link
            to="/admin/new"
            className="bg-coral text-white px-5 py-2.5 rounded-full font-medium hover:bg-clay trabsition-colors text-sm"
          >
            + Add Artwork
          </Link>
          <button
            onClick={logout}
            className="text-ink/60 hover:text-clay transition-colors text-sm"
          >
            Log Out
          </button>
        </div>
      </div>
      {loading && <p className="text-ink/60">Loading...</p>}

      {!loading && artworks.length > 0 && (
        <div className="space-y-3">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="flex items-center  gap-4 bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-sand flex-shrink-0">
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-ull h-full object-cover"
                />
              </div>

              <div className="flex-grow-0">
                <h3 className="font-display font-medium text-ink">
                  {artwork.title}
                </h3>
                <p className="text-xs uppercase tracking-wide text-sage font-medium">
                  {artwork.medium} {artwork.price ? `· $${artwork.price}` : ""}{" "}
                  {!artwork.in_stock ? " · Sold" : ""}
                </p>
              </div>

              <Link
                to={`/admin/edit/${artwork.id}`}
                className="text-sm text-ink/60 hover:text-coral transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(artwork.id, artwork.title)}
                className="text-sm text-clay hover:rext-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
