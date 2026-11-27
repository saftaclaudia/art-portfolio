import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartProvider.jsx";
import { HelmetProvider } from "react-helmet-async";
import { LazyMotion, domAnimation } from "framer-motion";

// After a new deploy, the page files of the previous version no longer exist.
// A visitor who still has the old site open would get a blank page on the
// next click, so reload once to get the new version. The timestamp stops a
// reload loop if the files are missing for another reason (e.g. offline).
window.addEventListener("vite:preloadError", (event) => {
  try {
    const last = Number(sessionStorage.getItem("chunkReloadAt"));
    if (Date.now() - last < 10000) return;
    sessionStorage.setItem("chunkReloadAt", String(Date.now()));
  } catch {
    // storage unavailable: still reload once
  }
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <CartProvider>
          {/* Loads only the animation features the site uses */}
          <LazyMotion features={domAnimation} strict>
            <App />
          </LazyMotion>
        </CartProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
