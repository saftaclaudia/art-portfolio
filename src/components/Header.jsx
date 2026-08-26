import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Header({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (section) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <header className=" sticky top-0 z-50 flex justify-between items-center px-6 md:px-10 py-4 border-b border-blush/60 bg-cream/85 backdrop-blur-md">
      <button
        onClick={() => onNavigate("home")}
        className=" font-accent text-2xl md:text-3xl text-clay hover:text-coral transition-colors"
      >
        Art by Claudia
      </button>

      {/* Desktop nav */}
      <nav className="hidden md:flex space-x-8 text-ink/80 text-sm font-medium tracking-wide">
        <button
          onClick={() => onNavigate("home")}
          className="hover:text-coral transition-colors"
        >
          Home
        </button>
        <button
          onClick={() => onNavigate("gallery")}
          className="hover:text-coral transition-colors"
        >
          Gallery
        </button>
        <button
          onClick={() => onNavigate("about")}
          className="hover:text-coral transition-colors"
        >
          About
        </button>
        <button
          onClick={() => onNavigate("contact")}
          className="hover:text-coral transition-colors"
        >
          Contact
        </button>
      </nav>

      {/* Mobile burger button */}
      <button
        className="md:hidden text-clay"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile meniu with animatiom */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-cream border-b border-blush/60 shadow-sm p-6 flex flex-col space-y-5 text-ink md:hidden z-50"
          >
            <button
              onClick={() => handleLinkClick("home")}
              className="text-left hover:text-coral transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleLinkClick("gallery")}
              className="text-left hover:text-coral transition-colors"
            >
              Gallery
            </button>
            <button
              onClick={() => handleLinkClick("about")}
              className="text-left hover:text-coral transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleLinkClick("contact")}
              className="text-left hover:text-coral transition-colors"
            >
              Contact
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
