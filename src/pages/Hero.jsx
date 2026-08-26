import { motion } from "framer-motion";
import { Link } from "react-scroll";
import myPortrait from "../assets/profile-optimized.jpg";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 bg-cream">
      <div className="max-w-2xl mx-auto text-center">
        {/* Profile image */}
        <motion.img
          src={myPortrait}
          alt="Self portrait"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-full mx-auto mb-8 shadow-md border-4 border-white"
        />

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-display font-medium  text-ink mb-5 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Welcome to my artistic world
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-ink/70 text-lg md:text-xl mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Explore my watercolor and digital artworks, inspired by nature,
          emotion, and color.
        </motion.p>

        {/*  Buton */}

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="bg-coral text-white px-8 py-3.5 rounded-full font-medium shadow-md shadow-coral/20 hover:bg-clay transition-colors"
          onClick={() => navigate("/gallery")}
        >
          View Gallery
        </motion.button>
      </div>
    </section>
  );
}
