import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";

function Contact() {
  const [searchParams] = useSearchParams();
  const defaultType =
    searchParams.get("type") === "commission"
      ? "Commission request"
      : "General question";
  const [form, setForm] = useState({
    name: "",
    email: "",
    inquiry_type: defaultType,
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);
    setError(false);

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        setSuccess(true);
        setError(false);
        setForm({
          name: "",
          email: "",
          inquiry_type: defaultType,
          message: "",
        });
      })
      .catch((error) => {
        console.error(error.text);
        setError(true);
      })
      .finally(() => setSending(false));
  };

  return (
    <>
      <Helmet>
        <title>Contact | Art by Claudia</title>
        <meta
          name="description"
          content="Get in touch with Claudia for questions, custom commissions, or inquiries about original artworks"
        />
      </Helmet>
      <section id="contact" className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-accent text-xl text-coralText mb-1">
            let&rsquo;s talk
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-medium text-ink mb-4">
            Contact
          </h1>
          <p className="text-ink/75 mb-10">
            Feel free to get in touch with me. I&rsquo;d love to hear from you!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              aria-label="Your name"
              placeholder="Your name"
              required
              className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal/50"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              aria-label="Your email"
              placeholder="Your email"
              required
              className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal/50"
            />
            <select
              name="inquiry_type"
              aria-label="Type of inquiry"
              value={form.inquiry_type}
              onChange={handleChange}
              className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal/50"
            >
              <option>General question</option>
              <option>Order question</option>
              <option>Commission request</option>
            </select>

            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              aria-label="Your message"
              placeholder="Your message"
              required
              className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal/50"
            />

            <button
              type="submit"
              disabled={sending}
              className="bg-tealText text-white px-8 py-3 rounded-full font-medium hover:bg-tealDark transition-colors disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
            {success && (
              <p className="text-sage text-sm">
                Message sent successfully. Thank you
              </p>
            )}
            {error && (
              <p className="text-clay text-sm">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

export default Contact;
