import { ChevronDown } from "lucide-react";

const INFO_SECTIONS = [
  {
    title: "How ordering works",
    lines: [
      "Add your pieces to the cart and send your order request.",
      "I confirm availability and the shipping cost by email, usually within 1–2 days.",
      "Once confirmed, I send payment details. Your order is prepared after payment is received.",
    ],
  },
  {
    title: "Shipping",
    lines: [
      "Ships from Windisch, Switzerland within 2 days of payment (4 days if framing is requested).",
      "Delivery within Switzerland takes 4–6 days. International orders can take up to a week.",
      "Shipping is calculated for each order and charged at the carrier's actual cost. I confirm the exact amount by email before you pay.",
      "Orders outside Switzerland may be subject to customs duties or import taxes, which are the buyer's responsibility.",
      "Artwork is packed flat in protective packaging.",
    ],
  },
  {
    title: "Returns",
    lines: [
      "I accept returns within 14 days of delivery. Please contact me first to arrange it.",
      "Items must be returned in their original, undamaged condition and properly packed.",
      "Return shipping costs are paid by the buyer, unless the item arrived damaged or differs from its description.",
      "Once I receive and check the returned item, I refund the item price.",
      "If your order arrives damaged, please contact me within 7 days of delivery with a photo and I will make it right.",
    ],
  },

  {
    title: "Materials & care",
    lines: [
      "Originals are painted by hand in watercolor and ink on watercolor paper. Details vary by piece.",
      "Originals can be signed on request.",
      "Prints are made on premium matte fine-art paper (200 gsm).",
      "Artwork is sold unframed. Framing can be added for an extra cost, so please contact me before ordering.",
      "Keep artwork out of direct sunlight and away from humidity.",
    ],
  },
];

export default function ProductInfo() {
  return (
    <div className="mt-14 max-w-3xl mx-auto border-t border-blush/70">
      {INFO_SECTIONS.map((section) => (
        <details
          key={section.title}
          className="group border-b border-blush/70 py-4"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink [&::-webkit-details-marker]:hidden">
            {section.title}{" "}
            <ChevronDown
              size={18}
              className="text-ink/50 transition-transform group-open:rotate-180"
            />
          </summary>
          <ul className="mt-3 space-y-2 text-sm text-ink/75 leading-relaxed">
            {section.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
