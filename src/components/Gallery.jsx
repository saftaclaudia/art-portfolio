import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet-async";
import { SELL_PRINTS } from "../config";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "watercolor", label: "Watercolor" },
  { key: "acrylic", label: "Acrylic" },
  { key: "digital", label: "Digital" },
];

// What the card shows as the price, depending on what can actually be bought
function getPriceLabel(artwork) {
  if (artwork.in_stock) {
    return artwork.price != null ? `$${artwork.price}` : "";
  }

  const printPrices =
    SELL_PRINTS && Array.isArray(artwork.print_options)
      ? artwork.print_options
          .map((p) => Number(p.price))
          .filter((n) => Number.isFinite(n))
      : [];

  if (printPrices.length > 0) {
    return `Prints from $${Math.min(...printPrices)}`;
  }
  return "Sold";
}
// watercolor 19 x 19 cm (dimension are skipped for digital files)
function getDetails(artwork) {
  return [
    artwork.medium,
    artwork.medium !== "digital" ? artwork.dimensions : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function ArtworkCardImage({ artwork }) {
  const extraImages = Array.isArray(artwork.images) ? artwork.images : [];
  const allImages = [artwork.image_url, ...extraImages];
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((i) => (i + 1) % allImages.length);
  };
  const prev = () => {
    setIndex((i) => (i - 1 + allImages.length) % allImages.length);
  };

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-ink/70 text-white ring-1 ring-white/60 shadow-md flex items-center justify-center transition-colors hover:bg-ink/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral";

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-sand">
      <img
        src={allImages[index]}
        alt={artwork.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {allImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className={`${arrowClass} left-2`}
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className={`${arrowClass} right-2`}
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          <div
            aria-hidden="true"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5 shadow-sm pointer-events-none"
          >
            {allImages.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-4 bg-coralText" : " w-1.5 bg-ink/30"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    async function fetchArtworks() {
      setLoading(true);

      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .order("medium", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) {
        setError("Could not load artworks. Please try again later.");
        console.error(error);
      } else {
        setArtworks(data ?? []);
      }
      setLoading(false);
    }
    fetchArtworks();
  }, []);

  const filteredArtworks = useMemo(() => {
    if (activeFilter === "all") return artworks;
    return artworks.filter((a) => a.medium?.toLowerCase() === activeFilter);
  }, [artworks, activeFilter]);

  return (
    <>
      <Helmet>
        <title>Gallery | Art by Claudia</title>
        <meta
          name="description"
          content="Browse original watercolor, acrylic, and digital artworks - filterable by medium, with pricing"
        />
      </Helmet>

      <section id="gallery" className="bg-cream px-4 py-20 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <p className="font-accent text-xl text-coralText mb-1">
              my artworks
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-medium text-ink">
              Gallery
            </h1>
            <p className="mt-3 text-ink/75 max-w-xl mx-auto">
              Open any piece to read the story behind it and see more details.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 mt-6">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  activeFilter === f.key
                    ? "bg-coralText text-white border-coralText"
                    : "bg-white text-ink/75 border-blush hover:border-coral hover:text-coralText"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-center text-clay bg-blush/40 rounded-lg py-3 px-4 max-w-md mx-auto">
              {error}
            </p>
          )}

          {loading && !error && (
            <div className="grid grid-cols-1  md:grid-cols-2 gap-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square w-full rounded-2xl bg-sand" />
                  <div className="h-4 w-2/3 bg-sand rounded mt-4" />
                  <div className="h-3 w-1/3 bg-sand rounded mt-2" />
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredArtworks.length === 0 && (
            <p className="text-center text-ink/75">
              No artworks in this category yet.
            </p>
          )}

          {!loading && !error && filteredArtworks.length > 0 && (
            <div className="grid grid-cols-1  md:grid-cols-2 gap-10">
              {filteredArtworks.map((artwork, i) => {
                const priceLabel = getPriceLabel(artwork);
                const isSold = priceLabel === "Sold";

                return (
                  <motion.article
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
                    className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg focus-within:ring-2 focus-within:ring-coral/50 transition-shadow duration-300 cursor-pointer"
                  >
                    <ArtworkCardImage artwork={artwork} />

                    <div className="p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <h2 className="text-lg font-display font-medium text-ink">
                          <Link
                            to={`/gallery/${artwork.slug}`}
                            className="after:absolute after:inset-0 after:content-[''] group-hover:text-coralText transition-colors focus:outline-none"
                          >
                            {artwork.title}
                          </Link>
                        </h2>

                        {priceLabel && (
                          <span
                            className={`whitespace-nowrap text-sm ${isSold ? "text-ink/75" : "font-semibold text-coralText"}`}
                          >
                            {priceLabel}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs uppercase tracking-wide text-sage font-medium">
                        {getDetails(artwork)}
                      </p>
                      <p
                        aria-hidden="true"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-coralText transition-colors group-hover:text-clay"
                      >
                        {artwork.description
                          ? "Read the story"
                          : "View details"}
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
