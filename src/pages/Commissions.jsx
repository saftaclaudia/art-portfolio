import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const steps = [
  {
    title: "Tell me your idea",
    text: "Share what you have in mind: a place, a pet, a memory. Reference photos help a lot.",
  },
  {
    title: "Quote & timeline",
    text: "I send you a price and an estimated delivery date. No obligation.",
  },
  {
    title: "Sketch approval",
    text: "I share a sketch so you can confirm the composition before I start painting.",
  },
  {
    title: "Painting & delivery",
    text: "I paint your piece and ship it carefully packed to your door.",
  },
];

function Commissions() {
  return (
    <>
      <Helmet>
        <title>Custom Commissions | Art by Claudia</title>
        <meta
          name="description"
          content="Commission a custom watercolor painting: portraits, places, pets and gifts. Learn how it works and request a quote."
        />
      </Helmet>
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-accent text-xl text-coralText mb-1">
            made just for you
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-medium text-ink mb-4">
            Custom Commissions
          </h1>
          <p className="text-ink/75 mb-12">
            Have a special place, pet or memory you would like to see in
            watercolor? I take a limited number of commissions each month.
          </p>
          <h2 className="text-2xl font-display text-ink mb-6">How it works</h2>
          <ol className="grid gap-4 sm:grid-cols-2 text-left mb-12">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="rounded-xl border border-blush bg-white p-5"
              >
                <span className="font-accent text-xl text-coralText">
                  {i + 1}
                </span>
                <h3 className="font-display text-lg text-ink">{step.title}</h3>
                <p className="text-ink/75 text-sm mt-1">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="text-ink/75 mb-2">
            Prices start from <strong>€50</strong>, depending on size and level
            of detail.
          </p>
          <p className="text-ink/75 mb-8">
            Typical turnaround: <strong>2 weeks</strong>.
          </p>
          <Link
            to="/contact?type=commission"
            className="inline-block bg-tealText text-white px-8 py-3 rounded-full font-medium hover:bg-tealDark transition-colors"
          >
            Request a commission
          </Link>
        </div>
      </section>
    </>
  );
}

export default Commissions;
