import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addToCart(artwork) {
    setItems((prev) => {
      const alreadyInCart = prev.some((item) => item.id === artwork.id);
      if (alreadyInCart) return prev;
      return [...prev, artwork];
    });
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}
