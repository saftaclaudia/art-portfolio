import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/useCart";

export default function ProductPage() {
  const { slug } = useParams();
  const { items, addToCart } = useCart();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");

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

  // Build the list of purchasable options: the original (if in stock) + any print sizes
  const options = useMemo(() => {
    if (!artwork) return [];

    const list = [];

    if (artwork.in_stock) {
      const isDigital = artwork.medium === "digital";
      const originalLabel = isDigital ? "Digital Master File" : "Original";

      list.push({
        key: "original",
        label: artwork.dimensions
          ? `${originalLabel} (${artwork.dimensions})`
          : originalLabel,
        price: artwork.price,
      });
    }

    (artwork.print_options || []).forEach((p) => {
      list.push({
        key: `print-${p.size}`,
        label: `Print — ${p.size}`,
        price: p.price,
      });
    });

    return list;
  }, [artwork]);

  // Default to the first available option once artwork loads
  useEffect(() => {
    if (options.length > 0 && !selectedKey) {
      setSelectedKey(options[0].key);
    }
  }, [options, selectedKey]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedKey]);

  const selectedOption = options.find((o) => o.key === selectedKey);

  const cartItemId =
    artwork && selectedOption ? `${artwork.id}-${selectedOption.key}` : null;

  const alreadyInCart = items.some((item) => item.id === cartItemId);

  function handleAddToCart() {
    if (!artwork || !selectedOption) return;

    const isOriginal = selectedOption.key === "original";

    if (isOriginal && alreadyInCart) {
      setFeedback("You already added this to your cart.");
      setTimeout(() => setFeedback(""), 2500);
      return;
    }

    addToCart(
      {
        ...artwork,
        id: cartItemId,
        price: selectedOption.price,
        variantLabel: selectedOption.label,
        variantType: isOriginal ? "original" : "print",
      },
      isOriginal ? 1 : quantity,
    );

    setFeedback("Added to cart!");
    setTimeout(() => setFeedback(""), 2500);
    setQuantity(1);
  }

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
        <Link to="/gallery" className="text-coral font-medium hover:text-clay">
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

          {options.length === 0 && (
            <span className="inline-block bg-ink/10 text-ink/60 px-6 py-3 rounded-full font-medium mb-6">
              Sold
            </span>
          )}

          {options.length > 0 && (
            <>
              {/* Option selector */}
              <div className="mb-6 space-y-2">
                {options.map((option) => (
                  <label
                    key={option.key}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                      selectedKey === option.key
                        ? "border-coral bg-blush/30"
                        : "border-blush bg-white hover:border-coral/50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="option"
                        checked={selectedKey === option.key}
                        onChange={() => setSelectedKey(option.key)}
                        className="accent-coral"
                      />
                      <span className="text-ink/80 font-medium">
                        {option.label}
                      </span>
                    </span>
                    <span className="text-coral font-semibold whitespace-nowrap">
                      ${option.price}
                    </span>
                  </label>
                ))}
              </div>
              {selectedOption?.key !== "original" && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-ink/60">Quantity</span>
                  <div className="flex items-center border border-blush rounded-full overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-ink/60 hover:text-coral transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-ink font-medium">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center text-ink/60 hover:text-coral transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="bg-coral text-white px-8 py-3.5 rounded-full font-medium shadow-md shadow-coral/20 hover:bg-clay transition-colors"
              >
                Add to Cart
              </button>

              {feedback && (
                <p className="text-sm text-sage-700 mt-3">{feedback}</p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
