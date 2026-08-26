import { Instagram } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-blush/60 pt-8 pb-6  text-center text-sm text-ink/60 bg-cream">
      <p className="font-accent text-lg text-coral mb-2">
        © {new Date().getFullYear()} Art by Claudia
      </p>
      <p className="mb-3">© {new Date().getFullYear()} All rights reserved</p>

      <div className="flex gap-2 justify-center items-center">
        <p>Follow me on </p>
        <a
          href="https://www.instagram.com/claudiasafta_draw"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-coral transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={18} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
