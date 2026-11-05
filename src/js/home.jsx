import { createRoot } from "react-dom/client";

import Hero from "./Hero";
import { products } from "./product.js";
import { addToCart } from "./cart-store.js";

const rootElement = document.getElementById("home-hero-root");

if (!rootElement) throw new Error("Missing #home-hero-root mount element.");

createRoot(rootElement).render(
  <Hero products={products} addToCart={addToCart} />
);
