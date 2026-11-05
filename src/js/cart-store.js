import { products, formatPrice } from "./product.js";

export const CART_STORAGE_KEY = "urban-soles-cart";

function normalizeCartItem(item) {
  const savedProduct =
    item.product && typeof item.product === "object" ? item.product : item;
  const id = savedProduct.id ?? item.id;
  const product = products.find((entry) => String(entry.id) === String(id));
  const size = Number(item.size);
  const quantity = Number(item.quantity);

  if (
    id === undefined ||
    !Number.isFinite(size) ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    throw new TypeError("Saved cart contains an invalid product, size, or quantity.");
  }

  const price = Number(savedProduct.price ?? item.price ?? product?.price);
  if (!Number.isFinite(price) || price < 0) {
    throw new TypeError(`Saved cart item "${String(id)}" has an invalid price.`);
  }

  return {
    id: String(id),
    name: String(savedProduct.name ?? item.name ?? product?.name ?? "Sneaker"),
    category: String(savedProduct.category ?? product?.category ?? ""),
    color: String(savedProduct.color ?? product?.color ?? ""),
    price,
    image: String(savedProduct.image ?? item.image ?? product?.image ?? ""),
    size,
    quantity,
  };
}

export function readCart() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (savedCart === null) return [];

  const parsedCart = JSON.parse(savedCart);
  if (!Array.isArray(parsedCart)) {
    throw new TypeError("Saved cart data must be an array.");
  }

  return parsedCart.map(normalizeCartItem);
}

function writeCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("urban-soles:cart-updated"));
  return cart;
}

export function addToCart(product, size) {
  if (!product || !product.sizes.includes(Number(size))) {
    throw new RangeError("Choose an available size before adding this sneaker to your cart.");
  }

  const cart = readCart();
  const id = String(product.id);
  const selectedSize = Number(size);
  const existingItem = cart.find(
    (item) => item.id === id && item.size === selectedSize
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(normalizeCartItem({
      product,
      size: selectedSize,
      quantity: 1,
    }));
  }

  return writeCart(cart);
}

export function addProductToCart(productId, size) {
  const product = products.find(
    (item) => String(item.id) === String(productId)
  );
  if (!product) throw new RangeError(`Product "${productId}" was not found.`);
  return addToCart(product, size);
}

export function updateCartQuantity(productId, size, change) {
  if (!Number.isInteger(change) || change === 0) {
    throw new RangeError("Cart quantity changes must be a non-zero integer.");
  }

  const id = String(productId);
  const selectedSize = Number(size);
  const cart = readCart().map((item) => (
    item.id === id && item.size === selectedSize
      ? { ...item, quantity: Math.max(1, item.quantity + change) }
      : item
  ));

  return writeCart(cart);
}

export function removeCartItem(productId, size) {
  const id = String(productId);
  const selectedSize = Number(size);
  const cart = readCart().filter(
    (item) => item.id !== id || item.size !== selectedSize
  );

  return writeCart(cart);
}

export function getCartCount(cart) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export { formatPrice };
