import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet-async";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "watercolor", label: "Wateercolor" },
  { key: "digital", label: "Digital" },
];

export default function Gallery() {
  const navigate = useNavigate();
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
        .order("created_at", { ascending: false });
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
          content="Browse original watercolor, acrylic, and digital artworks - filterable by medium, each with detailed descriptions and pricing"
        />
      </Helmet>

      <section id="gallery" className="bg-cream px-4 py-20 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <p className="font-accent text-xl text-coral mb-1">my artworks</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-ink">
              Gallery
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 mt-6">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  activeFilter === f.key
                    ? "bg-coral text-white border-coral"
                    : "bg-white text-ink/70 border-blush hover:border-coral hover:text-coral"
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
                  <div className="aspect-[4/3] w-full rounded-2xl bg-sand" />
                  <div className="h-4 w-2/3 bg-sand rounded mt-4" />
                  <div className="h-3 w-1/3 bg-sand rounded mt-2" />
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredArtworks.length === 0 && (
            <p className="text-center text-ink/60">
              No artworks in this category yet.
            </p>
          )}

          {!loading && !error && filteredArtworks.length > 0 && (
            <div className="grid grid-cols-1  md:grid-cols-2 gap-10">
              {filteredArtworks.map((artwork, i) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                  onClick={() => navigate(`/gallery/${artwork.slug}`)}
                  className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-sand">
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-lg font-display font-medium text-ink">
                        {artwork.title}
                      </h3>
                      {artwork.price && (
                        <span className="text-coral font-semibold whitespace-nowrap">
                          ${artwork.price}
                        </span>
                      )}
                    </div>

                    <p className="text-xs uppercase tracking-wide text-sage font-medium mb-2">
                      {artwork.medium}
                      {artwork.artist ? ` · ${artwork.artist}` : ""}
                    </p>

                    {artwork.description && (
                      <p className="text-sm text-ink/70 leading-relaxed">
                        {artwork.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
