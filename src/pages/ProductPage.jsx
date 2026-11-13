import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCart } from "../context/useCart";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ProductInfo from "../components/ProductInfo";
import SimilarArtworks from "../components/SimilarArtworks";
import ArtworkPager from "../components/ArtworkPager";
import { SELL_PRINTS } from "../config";

const imageArrowClass =
  "absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink/70 text-white ring-1 ring-white/60 shadow-md flex items-center justify-center transition-colors hover:bg-ink/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral";

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
  const [framed, setFramed] = useState(false);

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

    if (SELL_PRINTS) {
      (artwork.print_options || []).forEach((p) => {
        list.push({
          key: `print-${p.size}`,
          label: `Print — ${p.size}`,
          price: p.price,
        });
      });
    }

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
    setFramed(false);
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

  // A digital master file is a file, not an object, so it can't be framed
  const isPhysical =
    !!selectedOption &&
    (selectedOption.key !== "original" || artwork?.medium !== "digital");
  const wantsFrame = framed && isPhysical;

  const cartItemId =
    artwork && selectedOption
      ? `${artwork.id}-${selectedOption.key}${wantsFrame ? "-framed" : ""}`
      : null;

  // An original is one of a kind:  block it if ANY version of it framed or not is already in the cart
  const originalInCart = artwork
    ? items.some((item) => item.id.startsWith(`${artwork.id}-original`))
    : false;

  function handleAddToCart() {
    if (!artwork || !selectedOption) return;

    const isOriginal = selectedOption.key === "original";

    if (isOriginal && originalInCart) {
      setFeedback(
        "This piece is already in your cart. Remove it there to change the framing.",
      );
      setTimeout(() => setFeedback(""), 3500);
      return;
    }

    addToCart(
      {
        ...artwork,
        id: cartItemId,
        price: selectedOption.price,
        variantLabel: `${selectedOption.label}${wantsFrame ? " + frame" : ""}`,
        variantType: isOriginal ? "original" : "print",
        framed: wantsFrame,
      },
      isOriginal ? 1 : quantity,
    );

    setFeedback("Added to cart!");
    setTimeout(() => setFeedback(""), 2500);
    setQuantity(1);
    setFramed(false);
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

  let variantNote = "";

  // Small context line: "watercolor 19 x 19 cm" (a dfital file has no paper size)
  const details = [
    artwork.medium,
    artwork.medium !== "digital" ? artwork.dimensions : null,
  ]
    .filter(Boolean)
    .join(" ˙ ");

  // A blank line in the description starts a new paragraph
  const descriptionParagraphs = artwork.description
    ? artwork.description
        .split(/\n\s*\n/)
        .map((text) => text.trim())
        .filter(Boolean)
    : [];

  // Show note next to the price, so nobody assumes  it is the final total
  let priceNote = "";
  if (selectedOption) {
    if (!isPhysical) {
      priceNote = "delivered by email";
    } else {
      priceNote = wantsFrame ? "+ frame and shipping" : "+ shipping";
    }
  }

  if (isPhysical) {
    if (selectedOption.key === "original") {
      variantNote =
        artwork.medium === "watercolor"
          ? "Original ink and watercolor painting on paper, one of a kind. "
          : "Original artwork, one of a kind. ";
    } else {
      variantNote = "Print of the original artwork. ";
    }
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
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/gallery"
            className="text-sm text-ink/75 hover:text-coralText transition-colors"
          >
            &larr; Back to gallery
          </Link>
          <ArtworkPager artworkId={artwork.id} />
        </div>

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
                    className={`${imageArrowClass} left-3`}
                  >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next image"
                    className={`${imageArrowClass} right-3`}
                  >
                    <ChevronRight size={20} strokeWidth={2.5} />
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
          <div className="min-w-0 text-left md:sticky md:top-28">
            {/* 1. Context line */}
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-sage">
              {details}
            </p>

            {/* 2. Title */}
            <h1 className="mb-4 text-3xl font-display font-medium leading-tight text-ink md:text-4xl">
              {artwork.title}
            </h1>

            {/* 3. Price */}
            {selectedOption && (
              <p className="mb-6 flex items-baseline gap-2">
                <span className="text-3xl font-display font-semibold text-coralText">
                  ${selectedOption.price}
                </span>
                <span className="text-sm text-ink/75">{priceNote}</span>
              </p>
            )}

            {/* 4. Description */}
            {descriptionParagraphs.length > 0 && (
              <div className="mb-8 max-w-prose space-y-4 leading-7 text-ink/75">
                {descriptionParagraphs.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            )}

            {options.length === 0 && (
              <span className="inline-block bg-ink/10 text-ink/75 px-6 py-3 rounded-full font-medium">
                Sold
              </span>
            )}

            {/* 5. Purchase zone */}
            {options.length > 0 && (
              <div className="border-t border-blush pt-8">
                {options.length > 1 ? (
                  <fieldset className="mb-6 min-w-0">
                    <legend className="mb-3 text-sm font-medium text-ink">
                      Choose an option
                    </legend>

                    <div className="space-y-2">
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
                  </fieldset>
                ) : (
                  <div className="mb-6 rounded-xl border border-blush bg-white px-4 py-3">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-sage">
                      What you get
                    </p>
                    <p className="font-medium text-ink/80">
                      {options[0].label}
                    </p>
                  </div>
                )}
                {isPhysical && (
                  <p className="mb-4 text-sm text-ink/75 leading-relaxed">
                    {variantNote}Sold unframed unless you add a frame below. The
                    frame shown in photos is for display only.{" "}
                    <Link
                      to="/contact"
                      className="text-coralText underline hover:text-clay"
                    >
                      Questions? Contact me.
                    </Link>
                  </p>
                )}

                {isPhysical && (
                  <label className="mb-6 flex items-start gap-3 rounded-xl border border-blush bg-white px-4 py-3 cursor-pointer hover:border-coral/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={framed}
                      onChange={(e) => setFramed(e.target.checked)}
                      className="mt-1 accent-coral"
                    />
                    <span className="text-sm">
                      <span className="block font-medium text-ink/80">
                        Add a frame
                      </span>
                      <span className="block text-ink/75">
                        Extra cost, confirmed by email before you pay. Framed
                        orders ship in about 4 days.
                      </span>
                    </span>
                  </label>
                )}

                {selectedOption?.key !== "original" && (
                  <div className="mb-4 flex items-center gap-3">
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

                {/* 6. Main action */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-coralText text-white px-8 py-3.5 rounded-full font-medium shadow-md shadow-coral/20 hover:bg-clay transition-colors"
                >
                  Add to Cart
                </button>

                <p className="mt-3 text-xs text-ink/75">
                  {isPhysical
                    ? "Shipping is calculated per order and confirmed by email before you pay."
                    : "Your file is delivered by email after payment."}
                </p>

                <div
                  aria-live="polite"
                  className="mt-2 min-h-[1.25rem] text-sm text-sage"
                >
                  {feedback}
                </div>
              </div>
            )}
          </div>
        </div>

        <ProductInfo
          medium={artwork.medium}
          hasOriginal={options.some((o) => o.key === "original")}
          hasPrints={options.some((o) => o.key.startsWith("print-"))}
        />
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
