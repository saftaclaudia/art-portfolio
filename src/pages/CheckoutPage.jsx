import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { useCart } from "../context/useCart";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const handleChanges = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setError(false);

    const orderSummary = items
      .map((item) => `- ${item.title} (${item.medium} - $${item.price})`)
      .join("\n");

    const message =
      `New order from ${form.name} Items: ${orderSummary} Total: $${total} Shipping details: ${form.address}, ${form.city} ${form.postalCode} Phone:${form.phone}`.trim();

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { name: form.name, email: form.email, message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        clearCart();
        navigate("/order-confirmed");
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => setSending(false));
  };
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-display text-ink mb-3">
          Your cart is empty
        </h2>
        <p className="text-ink/60">Add something from the gallery first.</p>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-display font-medium text-ink mb-3 text-center">
        Checkout
      </h1>
      <p className="text-ink/60 text-center mb-10">
        Total: <span className="text-coral font-semibold">${total}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChanges}
          placeholder="Full name"
          required
          className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-3 focus:ring-coral/50"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChanges}
          placeholder="Email"
          required
          className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-3 focus:ring-coral/50"
        />
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChanges}
          placeholder="Phone number"
          required
          className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-3 focus:ring-coral/50"
        />
        <input
          name="address"
          type="text"
          value={form.address}
          onChange={handleChanges}
          placeholder="Street address"
          required
          className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-3 focus:ring-coral/50"
        />
        <div className="flex gap-4">
          <input
            name="city"
            type="text"
            value={form.city}
            onChange={handleChanges}
            placeholder="City"
            required
            className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-3 focus:ring-coral/50"
          />
          <input
            name="postalCode"
            type="text"
            value={form.postalCode}
            onChange={handleChanges}
            placeholder="Postal code"
            required
            className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-3 focus:ring-coral/50"
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          className="w-full bg-coral text-white px-8 py-3.5 rounded-full font-medium hover:bg-clay transition-colors disabled:opacity-60"
        >
          {sending ? "Placing order..." : "Place Order"}
        </button>
        {error && (
          <p className="text-clay text-sm text-center">
            Something went wrong.Please try again.
          </p>
        )}
      </form>
    </section>
  );
}
