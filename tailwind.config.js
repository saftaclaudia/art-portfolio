/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FDF9F4",
        sand: "#F5EDE3",
        blush: "#F3D9CD",
        peach: "#F0B8A0",
        coral: "#E38B6F",
        sage: "#B4C4A8",
        clay: "#B56A4C",
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
