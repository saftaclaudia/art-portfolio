import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, total } = useCart();
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-display text-ink mb-3">
          Your cart is empty
        </h1>
        <p className="text-ink/60 mb-6">
          Browse the gallery ad find a piece you love
        </p>
        <Link
          to="/gallery"
          className="inline-block bg-coral text-white px-8 py-3 rounded-full font-medium hover:bg-clay transition-colors"
        >
          Go to Gallery
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-display font-medium text-ink mb-10 text-center">
        Your Cart
      </h1>
      <div className="space-y-4 mb-10">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white rounded-2xl px-4 shadow-sm"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-sand flex-shrink-0">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-display font-medium text-ink">
                {item.title}
              </h3>
              <p className="text-xs uppercase tracking-wide text-sage font-medium">
                {item.medium}
              </p>
            </div>

            {item.price && (
              <span className="text-coral fint-semibold whitespace-nowrap">
                ${item.price}
              </span>
            )}
            <button
              onClick={() => removeFromCart(item.id)}
              aria-label={`Remove ${item.title} from cart`}
              className="text-ink/40 hover:text-clay transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-blush pt-6">
        <span className="text-lg font-medium text-ink">Total</span>
        <span className="text-2xl font-semibold text-coral">${total}</span>
      </div>
      <Link
        to="/checkout"
        className="block text-center bg-coral text-white px-8 py-3.5 rounded-full font-medium hover:bg-clay transition-colors mt-8"
      >
        Proceed to Checkout
      </Link>
    </section>
  );
}
