import "./App.css";
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./pages/Hero";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Each page is downloaded only when it is opened. The home page (Hero) stays
// in the main file so the first screen appears without an extra request.
const Gallery = lazy(() => import("./components/Gallery"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderConfirmedPage = lazy(() => import("./pages/OrderConfirmedPage"));

const AdminShell = lazy(() => import("./components/AdminShell"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AdminArtworkForm = lazy(() => import("./pages/AdminArtworkForm"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const AdminAccountPage = lazy(() => import("./pages/AdminAccountPage"));

const Commissions = lazy(() => import("./pages/Commissions"));

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="max-w-sm mx-auto px-4 py-24 text-center text-ink/75">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:slug" element={<ProductPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/commissions" element={<Commissions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmed" element={<OrderConfirmedPage />} />

            {/* Admin pages share AdminShell, which provides the login state */}
            <Route path="/admin" element={<AdminShell />}>
              <Route path="login" element={<AdminLoginPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route
                index
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="account"
                element={
                  <ProtectedRoute>
                    <AdminAccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <AdminArtworkForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute>
                    <AdminArtworkForm />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
