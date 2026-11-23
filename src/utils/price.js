// "$45", or "Price on request" when an artwork has no price set,
// instead of showing "$", "0" or "$undefined"
export function formatPrice(price) {
  const n = Number(price);
  return price != null && price !== "" && n > 0 ? `$${n}` : "Price on request";
}
