import { useState } from "react";
import emailjs from "emailjs-com";
import { Helmet } from "react-helmet-async";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const [success, setSucccess] = useState(false);
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setSucccess(false);
    setError(false);

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(() => {
        setSucccess(true);
        setError(false);
        setForm({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error(error.text);
        setError(true);
      })
      .finally(() => setSending(false));

    console.log("Submitted form", form);
    //send to email or backend
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
          <p className="font-accent text-xl text-coral mb-1">let&apos;s talk</p>
          <h2 className="text-3xl md:text-4xl font-display font-mediumtext-ink mb-4">
            Contact
          </h2>
          <p className="text-ink/70  mb-10">
            {" "}
            Feel free to get in touch with me. I&aops;d love to hear from you!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral/50"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your email"
              required
              className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral/50"
            />

            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              placeholder="Your message"
              required
              className="w-full rounded-xl border border-blush bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral/50"
            />

            <button
              type="submit"
              disabled={sending}
              className="bg-coral text-white px-8 py-3 rounded-full font-medium hover:bg-clay transition-colors disabled:opacity-60"
            >
              {sending ? "Senfinh..." : "Send Message"}
            </button>
            {success && (
              <p className="text-sage-700 text-sm">
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
