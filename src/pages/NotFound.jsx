import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Shown for any address that doesn't match a page (a typo, an old link,
// an artwork that was deleted from the gallery).
export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <Helmet>
        <title>Page not found | Art by Claudia</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <p className="font-accent text-xl text-coralText mb-1">oops</p>
      <h1 className="text-3xl font-display font-medium text-ink mb-4">
        Page not found
      </h1>
      <p className="text-ink/75 mb-10 leading-relaxed">
        This page doesn&apos;t exist or has been moved. The artworks are all in
        the gallery.
      </p>
      <Link
        to="/gallery"
        className="inline-block bg-tealText text-white px-8 py-3 rounded-full font-medium hover:bg-tealDark transition-colors"
      >
        Browse the gallery
      </Link>
    </div>
  );
}
