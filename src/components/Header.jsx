import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/useCart";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Header() {
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `hover:text-coral transition-colors ${isActive ? "text-coral" : "text-ink/80"}`;

  return (
    <header className=" sticky top-0 z-50 flex justify-between items-center px-6 md:px-10 py-4 border-b border-blush/60 bg-cream/85 backdrop-blur-md">
      <NavLink
        to="/"
        className=" font-accent text-2xl md:text-3xl text-clay hover:text-coral transition-colors"
      >
        Art by Claudia
      </NavLink>

      {/* Desktop nav */}
      <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={linkClass}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Cart icon */}
      <Link
        to="/cart"
        className="relative text-clay hover:text-coral transition-colors"
      >
        <ShoppingBag size={24} />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-coral text0white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {items.length}
          </span>
        )}
      </Link>

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
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setIsOpen(false)}
                className={linkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
