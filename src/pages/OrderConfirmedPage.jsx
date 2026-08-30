import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderConfirmedPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-4 text-center">
      <CheckCircle size={56} className="text-sage mx-auto mb-6" />
      <h1 className="text-3xl font-display font-medium text-link mb-4">
        Order received!
      </h1>
      <p className="text-ink/70 mb-10 leading-relaxed">
        Thank you for your order. I&apos;ll reach out by email shortly to
        confirm the details and arrange payment and shipping.
      </p>
      <Link
        to="/gallery"
        className="inline-block bg-coral text-white px-8 py-3 rounded-full font-medium hover:bg-clay transition-colors"
      >
        Continue Browsing
      </Link>
    </div>
  );
}
