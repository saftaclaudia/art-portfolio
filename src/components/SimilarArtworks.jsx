import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

const COLUMNS = "id, title, slug, image_url, medium";
const MAX_ITEMS = 4;

export default function SimilarArtworks({ artworkId, medium }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1 Same medium first
      const { data: sameMedium, error: sameError } = await supabase
        .from("artworks")
        .select(COLUMNS)
        .eq("medium", medium)
        .neq("id", artworkId)
        .order("sort_order", { ascending: true })
        .limit(MAX_ITEMS);

      if (sameError) {
        console.log("Similar artworks (same medium):", sameError);
      }

      let result = sameMedium ?? [];

      //2 Fill the remaining slots with other media
      if (result.length < MAX_ITEMS) {
        const { data: others, error: otherErrors } = await supabase
          .from("artworks")
          .select(COLUMNS)
          .neq("medium", medium)
          .neq("id", artworkId)
          .order("sort_order", { ascending: true })
          .limit(MAX_ITEMS - result.length);

        if (otherErrors) {
          console.log("Similar atworks (other media):", otherErrors);
        }

        result = [...result, ...(others ?? [])];
      }

      if (!cancelled) setItems(result);
    }
    load();

    return () => {
      cancelled = true;
    };
  }, [artworkId, medium]);

  // Guards against showing the current artwork while new data is loading
  const visible = items.filter((a) => a.id !== artworkId);
  if (visible.length === 0) return null;

  return (
    <section className="mt-16" aria-labelledby="smilar-heading">
      <h2
        id="similar-heading"
        className="text-2xl font-display font-medium text-ink mb-6 text-center"
      >
        You may also like
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {visible.map((a) => (
          <Link key={a.id} to={`/gallery/${a.slug}`} className="group block">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-sand">
              <img
                src={a.image_url}
                alt={a.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <h3 className="mt-2 text-sm font-display text-ink group-hover:text-coralText transition-colors">
                {a.title}
              </h3>
              <p className="text-xs uppercase tracking-wide text-sage">
                {a.medium}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
