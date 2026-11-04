import { ChevronDown } from "lucide-react";

const ORIGINAL_MATERIALS = {
  watercolor:
    "Originals are painted by hand in watercolor and ink on watercolor paper. Details vary by piece.",
  acrylic: "Originals are painted by hand in acrylic. Details vary by piece.",
};

function buildSections({ medium, hasOriginal, hasPrints }) {
  const isDigital = medium === "digital";
  const hasPhysicalOriginal = hasOriginal && !isDigital;
  const hasDigitalFile = hasOriginal && isDigital;
  const hasPhysical = hasPhysicalOriginal || hasPrints;

  const sections = [];

  // How ordering works
  sections.push({
    title: "How ordering works",
    lines: [
      "Add your pieces to the cart and send your order request.",
      `I confirm availability${hasPhysical ? " and the shipping cost" : ""} by email, usually within 1–2 days.`,
      hasPhysical
        ? "Once confirmed, I send payment details. Your order is prepared after payment is received."
        : "Once confirmed, I send payment details. I deliver your file as soon as payment is received.",
    ],
  });

  // Shipping (physical items) or Delivery (digital file only)
  if (hasPhysical) {
    const lines = [
      "Ships from Windisch, Switzerland within 2 days of payment (4 days if framing is requested).",
      "Delivery within Switzerland takes 4–6 days. International orders can take up to a week.",
      "Shipping is calculated for each order and charged at the carrier's actual cost. I confirm the exact amount by email before you pay.",
      "Orders outside Switzerland may be subject to customs duties or import taxes, which are the buyer's responsibility.",
      "Artwork is packed flat in protective packaging.",
    ];
    if (hasDigitalFile) {
      lines.push(
        "The Digital Master File is delivered by email, so it has no shipping cost.",
      );
    }
    sections.push({ title: "Shipping", lines });
  } else {
    sections.push({
      title: "Delivery",
      lines: [
        "The Digital Master File is delivered by email as soon as payment is received.",
        "There is no shipping cost for digital files.",
      ],
    });
  }

  // Returns
  const returnLines = [];
  if (hasPhysical) {
    returnLines.push(
      "I accept returns within 14 days of delivery. Please contact me first to arrange it.",
      "Items must be returned in their original, undamaged condition and properly packed.",
      "Return shipping costs are paid by the buyer, unless the item arrived damaged or differs from its description.",
      "Once I receive and check the returned item, I refund the item price.",
      "If your order arrives damaged, please contact me within 7 days of delivery with a photo and I will make it right.",
    );
  }
  if (hasDigitalFile) {
    returnLines.push(
      "Digital files can't be returned once delivered, so Digital Master File sales are final. If there is a problem with your file, contact me and I will fix it.",
    );
  }
  sections.push({ title: "Returns", lines: returnLines });

  // Materials & care (physical) or File & license (digital only)
  const detailLines = [];
  if (hasPhysicalOriginal) {
    detailLines.push(
      ORIGINAL_MATERIALS[medium] ??
        "Originals are made by hand. Details vary by piece.",
      "Originals can be signed on request.",
    );
  }
  if (hasDigitalFile) {
    detailLines.push(
      "The Digital Master File is a high-resolution digital file of the artwork, delivered by email.",
      "It is licensed for personal use. Resale, redistribution and commercial use are not included without my written permission.",
      "Each Digital Master File is sold to one buyer only.",
    );
  }
  if (hasPrints) {
    detailLines.push("Prints are made on premium matte paper.");
  }
  if (hasPhysical) {
    detailLines.push(
      "Artwork is sold unframed unless you add a frame when ordering. The extra cost is confirmed by email before you pay.",
      "Keep artwork out of direct sunlight and away from humidity.",
    );
  }
  sections.push({
    title: hasPhysical ? "Materials & care" : "File & license",
    lines: detailLines,
  });

  return sections;
}

export default function ProductInfo({ medium, hasOriginal, hasPrints }) {
  // Nothing is for sale (sold piece, no prints): no point showing order info
  if (!hasOriginal && !hasPrints) return null;

  const sections = buildSections({ medium, hasOriginal, hasPrints });

  return (
    <div className="mt-14 max-w-3xl mx-auto border-t border-blush/70">
      {sections.map((section) => (
        <details
          key={section.title}
          className="group border-b border-blush/70 py-4"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink [&::-webkit-details-marker]:hidden">
            {section.title}
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
