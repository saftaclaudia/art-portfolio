import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartProvider.jsx";
import { HelmetProvider } from "react-helmet-async";
import { LazyMotion, domAnimation } from "framer-motion";

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
