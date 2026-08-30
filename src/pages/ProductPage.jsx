import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/useCart";

export default function ProductPage() {
  const { slug } = useParams();
  const { items, addToCart } = useCart();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchArtwork() {
      setLoading(true);
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setArtwork(data);
      }
      setLoading(false);
    }
    fetchArtwork();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 animate-pulse">
        <div className="aspect-[4/3] w-full max-w-xl mx-auto rounded-2xl bg-sand" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-display text-ink mb-3">
          Artwork not found
        </h2>
        <p className="text-ink/60 mb-3">
          This piece may have been sold or removed.
        </p>
        <Link to="/gallery" className="text-coral fint-medium hover:text-clay">
          &larr; Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <Link
        to="/gallery"
        className="inline-block text-sm text-ink/60 hover:text-coral transition-colors mb-8"
      >
        {" "}
        &larr; Back to gallery
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="rounded-2xl overflow-hidden bg-sand">
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-sage font-medium mb-4">
            {artwork.medium} {artwork.artist ? ` · ${artwork.artist}` : ""}
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-medium text-ink mb-4">
            {artwork.title}
          </h1>
          {artwork.description && (
            <p className="text-ink/75 leading-relaxed mb-6">
              {artwork.description}
            </p>
          )}
          {artwork.price && (
            <p className="text-2xl font-semibold text-coral mb-6">
              {artwork.price}
            </p>
          )}

          {artwork.in_stock ? (
            items.some((item) => item.id === artwork.id) ? (
              <span className="inline-blovk bg-sage/20 text-sage-700 px-6 py-3 rounded-full font-medium">
                Already in your cart
              </span>
            ) : (
              <button
                onClick={() => addToCart(artwork)}
                className="bg-coral text-white px-8 py-3.5 rounded-full font-medium shadow-md shadow-coral/20 hover:bg-clay transition-colors"
              >
                Add to Cart
              </button>
            )
          ) : (
            <span className="inline-block bg-ink/10 text-ink/60 px-6 py-3 rounded-full font-medium">
              Sold
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
