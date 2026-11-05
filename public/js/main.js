const mobileMenu = document.getElementById("mobile-menu");
const searchOverlay = document.getElementById("search-overlay");
const cartDrawer = document.getElementById("cart-drawer");
const drawerBackdrop = document.getElementById("drawer-backdrop");

function setOpen(element, isOpen) {
  if (!element) return;

  element.classList.toggle("hidden", !isOpen);
  element.setAttribute("aria-hidden", String(!isOpen));
}

function closeMenu() {
  setOpen(mobileMenu, false);
}

function closeSearch() {
  setOpen(searchOverlay, false);
}

function closeCart() {
  setOpen(cartDrawer, false);
  setOpen(drawerBackdrop, false);
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  if (event.target.closest("[data-open-menu]")) {
    setOpen(mobileMenu, true);
  } else if (event.target.closest("[data-close-menu]")) {
    closeMenu();
  }

  if (event.target.closest("[data-open-search]")) {
    setOpen(searchOverlay, true);
    document.getElementById("overlay-input")?.focus();
  } else if (event.target.closest("[data-close-search]")) {
    closeSearch();
  }

  if (event.target.closest("[data-open-cart]")) {
    setOpen(cartDrawer, true);
    setOpen(drawerBackdrop, true);
  } else if (event.target.closest("[data-close-cart]")) {
    closeCart();
  }

  const accordionButton = event.target.closest(".accordion-btn");
  if (accordionButton) {
    const accordionPanel = accordionButton.nextElementSibling;
    if (accordionPanel) {
      const isExpanded = accordionButton.getAttribute("aria-expanded") === "true";
      accordionButton.setAttribute("aria-expanded", String(!isExpanded));
      accordionPanel.classList.toggle("hidden", isExpanded);
    }
  }

  if (event.target.closest("#mobile-menu a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  closeMenu();
  closeSearch();
  closeCart();
});
