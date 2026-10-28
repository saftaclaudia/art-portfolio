import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ArtworkPager({ artworkId }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("artworks")
        .select("id, slug, title")
        .order("medium", { ascending: true })
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Artwork pager:", error);
        return;
      }
      if (!cancelled) setList(data ?? []);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const index = list.findIndex((a) => a.id === artworkId);
  //Nothing to navigate to, or the current artwork isn't in the list yet
  if (index === -1 || list.length < 2) return null;
  // wraps around at both ends
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];

  const linkClass =
    "flex items-center gap-1 text-sm text-ink/75 hover:text-coralText transition-colors";

  return (
    <nav aria-label="Browse artworks" className="flex items-center gap-4">
      <Link
        to={`/gallery/${prev.slug}`}
        aria-label={`Previous artwork: ${prev.title}`}
        title={prev.title}
        className={linkClass}
      >
        <ChevronLeft size={18} />
        <span className="hidden sm:inline">Previous</span>
      </Link>
      <Link
        to={`/gallery/${next.slug}`}
        aria-label={`Next artwork: ${next.title}`}
        title={next.title}
        className={linkClass}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={18} />
      </Link>
    </nav>
  );
}
