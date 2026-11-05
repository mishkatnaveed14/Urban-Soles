import { createRoot } from "react-dom/client";

import Hero from "./Hero";
import { products } from "./product.js";

const CART_STORAGE_KEY = "urban-soles-cart";
const rootElement = document.getElementById("home-hero-root");

function updateCartCount(cart) {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = String(itemCount);
    badge.classList.toggle("hidden", itemCount === 0);
  });
}

function addToCart(product, size) {
  const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  if (!Array.isArray(cart)) {
    throw new TypeError("Saved cart data must be an array.");
  }

  const existingItem = cart.find(
    (item) => item.product.id === product.id && item.size === size
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ product, size, quantity: 1 });
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCount(cart);

  window.dispatchEvent(
    new CustomEvent("urban-soles:cart-updated", { detail: { cart } })
  );
}

const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
if (!Array.isArray(savedCart)) {
  throw new TypeError("Saved cart data must be an array.");
}
updateCartCount(savedCart);

if (!rootElement) throw new Error("Missing #home-hero-root mount element.");

createRoot(rootElement).render(
  <Hero products={products} addToCart={addToCart} />
);
