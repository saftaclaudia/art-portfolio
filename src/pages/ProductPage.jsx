import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/useCart";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ProductInfo from "../components/ProductInfo";
import SimilarArtworks from "../components/SimilarArtworks";

export default function ProductPage() {
  const { slug } = useParams();
  const { items, addToCart } = useCart();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    async function fetchArtwork() {
      setLoading(true);
      setNotFound(false);
      setArtwork(null);
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

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

  const allImages = useMemo(() => {
    if (!artwork) return [];
    const extra = Array.isArray(artwork.images) ? artwork.images : [];
    return [artwork.image_url, ...extra];
  }, [artwork]);

  const goPrev = () =>
    setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % allImages.length);
  // reset when b=navigating to a different artwork
  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
    setSelectedKey(null);
  }, [slug]);

  // Keyboard controls while the lightbox in open
  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKey(e) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight")
        setActiveIndex((i) => (i + 1) % allImages.length);
      if (e.key === "ArrowLeft")
        setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, allImages.length]);

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
        <p className="text-ink/75 mb-3">
          This piece may have been sold or removed.
        </p>
        <Link
          to="/gallery"
          className="text-coralText font-medium hover:text-clay"
        >
          &larr; Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{artwork.title} | Art by Claudia</title>
        <meta
          name="description"
          content={
            artwork.description
              ? artwork.description.slice(0, 155)
              : `${artwork.title} - original ${artwork.medium} artwork by Claudia`
          }
        />
        <meta
          property="og:title"
          content={`${artwork.title} | Art by Claudia`}
        />
        <meta
          property="og:description"
          content={
            artwork.description
              ? artwork.description.slice(0, 155)
              : `Original ${artwork.medium} artwork by Claudia`
          }
        />
        <meta property="og:image" content={artwork.image_url} />
        <meta property="og:type" content="product" />
      </Helmet>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <Link
          to="/gallery"
          className="inline-block text-sm text-ink/75 hover:text-coralText transition-colors mb-8"
        >
          &larr; Back to gallery
        </Link>

        <div className="grid  grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="min-w-0">
            {/* Main image */}
            <div className="relative w-fit max-w-full mx-auto  bg-sand rounded-2xl overflow-hidden p-3 md:p-4">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="View image full screen"
                className="block cursor-zoom-in"
              >
                <img
                  src={allImages[activeIndex]}
                  alt={artwork.title}
                  className="block w-auto h-auto max-w-full max-h-[60vh] md:max-h-[70vh] rounded-lg"
                />
              </button>

              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-ink/60 hover:text-coral transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-ink/60 hover:text-coral transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1 w-fit max-w-full mx-auto">
                {allImages.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeIndex
                        ? "border-coral"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0 md:sticky md:top-28">
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
              <span className="inline-block bg-ink/10 text-ink/75 px-6 py-3 rounded-full font-medium mb-6">
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
                      <span className="text-coralText font-semibold whitespace-nowrap">
                        ${option.price}
                      </span>
                    </label>
                  ))}
                </div>

                {selectedOption?.key === "original" &&
                  artwork.medium === "watercolor" && (
                    <p className="mb-6 text-sm text-ink/75 leading-relaxed">
                      Original ink and watercolor painting on paper, one of a
                      kind, sold unframed. The frame in the photo is for display
                      only. A frame can be added for an extra cost.{" "}
                      <Link
                        to="/contact"
                        className="text-coralText underline hover:text-clay"
                      >
                        Please contact me for details.
                      </Link>
                    </p>
                  )}

                {selectedOption?.key !== "original" && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm text-ink/75">Quantity</span>
                    <div className="flex items-center border border-blush rounded-full overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center text-ink/75 hover:text-coralText transition-colors"
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
                        className="w-9 h-9 flex items-center justify-center text-ink/75 hover:text-coralText transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  className="bg-coralText text-white px-8 py-3.5 rounded-full font-medium shadow-md shadow-coral/20 hover:bg-clay transition-colors"
                >
                  Add to Cart
                </button>

                {feedback && (
                  <p className="text-sm text-sage mt-3">{feedback}</p>
                )}
              </>
            )}
          </div>
        </div>
        <ProductInfo />
        <SimilarArtworks artworkId={artwork.id} medium={artwork.medium} />
      </section>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[60] bg-ink/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-ink/70 hover:text-coral transition-colors"
          >
            <X size={22} />
          </button>

          <img
            src={allImages[activeIndex]}
            alt={artwork.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center text-ink/70 hover:text-coral transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center text-ink/70 hover:text-coral transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
