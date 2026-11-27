// All prices on the site are in euro. CURRENCY is the code used in the
// structured data (JSON-LD) for search engines.
export const CURRENCY = "EUR";

// "€45" for any amount
export const euro = (n) => `€${n}`;

// "€45", or "Price on request" when an artwork has no price set,
// instead of showing "€", "0" or "€undefined"
export function formatPrice(price) {
  const n = Number(price);
  return price != null && price !== "" && n > 0 ? euro(n) : "Price on request";
}
