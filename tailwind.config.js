/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FDF9F4",
        sand: "#F5EDE3",
        // Borders and soft fills: neutral cream-grey, so the teal stays the accent
        blush: "#E6DFD7",
        // Terracotta: handwritten titles, prices, the "Art by Claudia" name
        coralText: "#C44C26",
        // Teal from the logo. "teal" is the exact logo color, for decoration
        // and focus rings only (too light for text). tealText (5.1:1 on cream,
        // 5.4:1 with white text) is for buttons and links, tealDark for hover.
        teal: "#68AAB9",
        tealText: "#2F7383",
        tealDark: "#255E6B",
        sage: "#667D54",
        clay: "#A66045",
        ink: "#4A4038",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        accent: ["Caveat", "cursive"],
      },
    },
  },
  plugins: [],
};
