import React from "react";
import { motion } from "framer-motion";
import aboutPortrait from "../assets/about-portrait.jpg";
import { Helmet } from "react-helmet-async";

function About() {
  return (
    <>
      <Helmet>
        <title>About | Art by Claudia</title>
        <meta
          name="description"
          content="Meet Claudia, a watercolor and digital artist inspired by travel, nature and color. Learn about her artistic journey"
        />
      </Helmet>
      <section id="about" className="py-24 px-6 text-ink bg-sand/50">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-10 ">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <img
              src={aboutPortrait}
              alt="Artist Claudia Popescu"
              className="w-full aspect-[3/2]   object-cover rounded-2xl shadow-lg border-4 border-white"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="font-accent text-xl text-coral mb-1">about me</p>
            <h2 className="text-3xl md:text-4xl font-medium mb-5">About Me</h2>
            <p className="text-ink/75 leading-relaxed mb-4">
              I&apos;m Claudia, a passionate artist inspired by the beauty of
              nature, human emotion, and vibrant colors. I create watercolor and
              digital paintings that aim to tell stories and evoke feelings
              through brushstrokes and light.
            </p>
            <p className="text-ink/75 leading-relaxed">
              My journey started in childhood, sketching flowers and seaside
              landscapes. Today, I transform those inspirations into artworks
              filled with life and emotion.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default About;
