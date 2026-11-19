import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function OrderConfirmedPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <Helmet>
        <title>Order received | Art by Claudia</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <CheckCircle size={56} className="text-sage mx-auto mb-6" />
      <h1 className="text-3xl font-display font-medium text-ink mb-4">
        Order received!
      </h1>
      <p className="text-ink/75 mb-10 leading-relaxed">
        Thank you for your order. I&apos;ll reach out by email shortly to
        confirm the details and arrange payment and shipping.
      </p>
      <Link
        to="/gallery"
        className="inline-block bg-coralText text-white px-8 py-3 rounded-full font-medium hover:bg-clay transition-colors"
      >
        Continue Browsing
      </Link>
    </div>
  );
}
