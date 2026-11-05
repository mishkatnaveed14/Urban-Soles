import {
  addProductToCart,
  formatPrice,
  getCartCount,
  getCartSubtotal,
  readCart,
  removeCartItem,
  updateCartQuantity,
} from "./cart-store.js";

function createButton(label, action, item, disabled = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "cart-quantity-button";
  button.textContent = label;
  button.disabled = disabled;
  button.dataset.cartAction = action;
  button.dataset.productId = item.id;
  button.dataset.size = String(item.size);
  button.setAttribute(
    "aria-label",
    action === "remove"
      ? `Remove ${item.name}, size ${item.size}`
      : `${action === "increase" ? "Increase" : "Decrease"} ${item.name} quantity`
  );
  return button;
}

function createCartItem(item, { controls = true } = {}) {
  const row = document.createElement("article");
  row.className = "cart-line-item";

  const image = document.createElement("img");
  image.className = "cart-line-image";
  image.src = item.image || "/models/sneaker-model-1.jpg";
  image.alt = item.name;
  image.loading = "lazy";
  row.append(image);

  const details = document.createElement("div");
  details.className = "cart-line-details";

  const name = document.createElement("h3");
  name.textContent = item.name;
  details.append(name);

  const size = document.createElement("p");
  size.textContent = `UK size ${item.size}`;
  details.append(size);

  const price = document.createElement("strong");
  price.textContent = formatPrice(item.price * item.quantity);
  details.append(price);

  if (controls) {
    const actions = document.createElement("div");
    actions.className = "cart-line-actions";
    actions.append(
      createButton("-", "decrease", item, item.quantity <= 1)
    );

    const quantity = document.createElement("span");
    quantity.className = "cart-line-quantity";
    quantity.textContent = String(item.quantity);
    actions.append(quantity);
    actions.append(createButton("+", "increase", item));
    actions.append(createButton("Remove", "remove", item));
    details.append(actions);
  } else {
    const quantity = document.createElement("p");
    quantity.textContent = `Quantity: ${item.quantity}`;
    details.append(quantity);
  }

  row.append(details);
  return row;
}

function renderItems(container, cart, options = {}) {
  container.replaceChildren();

  if (cart.length === 0) {
    const empty = document.createElement("div");
    empty.className = "cart-empty-state";

    const title = document.createElement("h3");
    title.textContent = "Your cart is waiting for its first pair.";
    empty.append(title);

    const shopLink = document.createElement("a");
    shopLink.href = "/shop";
    shopLink.className = "store-button store-button-primary";
    shopLink.textContent = "Explore sneakers";
    empty.append(shopLink);

    container.append(empty);
    return;
  }

  const list = document.createElement("div");
  list.className = "cart-line-list";
  cart.forEach((item) => list.append(createCartItem(item, options)));
  container.append(list);
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function renderCart() {
  const cart = readCart();
  const itemCount = getCartCount(cart);
  const subtotal = formatPrice(getCartSubtotal(cart));

  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = String(itemCount);
    badge.classList.toggle("hidden", itemCount === 0);
  });

  const drawerItems = document.getElementById("drawer-items");
  if (drawerItems) renderItems(drawerItems, cart);

  const cartPageItems = document.getElementById("cart-page-items");
  if (cartPageItems) renderItems(cartPageItems, cart);

  const checkoutItems = document.getElementById("checkout-items");
  if (checkoutItems) renderItems(checkoutItems, cart, { controls: false });

  setText("#drawer-total", subtotal);
  setText("#cart-page-subtotal", subtotal);
  setText("#cart-page-total", subtotal);
  setText("#checkout-subtotal", subtotal);
  setText("#checkout-total", subtotal);
  setText("[data-cart-page-count]", String(itemCount));

  document.querySelectorAll("[data-checkout-submit]").forEach((button) => {
    button.disabled = cart.length === 0;
  });
  document.querySelectorAll("[data-cart-checkout]").forEach((link) => {
    link.setAttribute("aria-disabled", String(cart.length === 0));
    link.tabIndex = cart.length === 0 ? -1 : 0;
  });
  setText("[data-cart-page-count-label]", itemCount === 1 ? "item" : "items");
}

function announceProductAdded(form) {
  const notice = form?.querySelector("[data-product-notice]");
  if (notice) notice.textContent = "Added to your cart.";
}

export function initializeStorefront() {
  renderCart();

  window.addEventListener("urban-soles:cart-updated", renderCart);
  window.addEventListener("storage", (event) => {
    if (event.key === "urban-soles-cart") renderCart();
  });

  window.addEventListener("urban-soles:open-cart", () => {
    document.querySelector("[data-open-cart]")?.click();
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const checkoutLink = event.target.closest("[data-cart-checkout]");
    if (checkoutLink && readCart().length === 0) {
      event.preventDefault();
      return;
    }

    const addButton = event.target.closest("[data-product-add]");
    if (addButton) {
      const form = addButton.closest("[data-product-form]");
      const sizeSelect = form?.querySelector("[name='size']");
      if (!form || !sizeSelect) {
        throw new Error("Product add-to-cart control is missing its size selector.");
      }

      if (!sizeSelect.value) {
        sizeSelect.focus();
        return;
      }

      addProductToCart(addButton.dataset.productId, sizeSelect.value);
      announceProductAdded(form);
      return;
    }

    const cartAction = event.target.closest("[data-cart-action]");
    if (!cartAction) return;

    const { cartAction: action, productId, size } = cartAction.dataset;
    if (action === "increase") {
      updateCartQuantity(productId, size, 1);
    } else if (action === "decrease") {
      updateCartQuantity(productId, size, -1);
    } else if (action === "remove") {
      removeCartItem(productId, size);
    }
  });

  document.getElementById("checkout-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.getElementById("checkout-status");
    const cart = readCart();

    if (cart.length === 0) {
      status.textContent = "Your cart is empty. Add a pair before checking out.";
      return;
    }

    status.textContent =
      "Your details are valid, but order placement and payment are not connected. No order has been placed.";
  });

  renderCart();
}
