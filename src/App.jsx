import "./App.css";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./pages/Hero";
import Gallery from "./components/Gallery";
import ProductPage from "./pages/ProductPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmedPage from "./pages/OrderConfirmedPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:slug" element={<ProductPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
