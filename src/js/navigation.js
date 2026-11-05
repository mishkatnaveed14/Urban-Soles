import { gsap } from 'gsap'

const mobileMenu = document.getElementById('mobile-menu')
const searchOverlay = document.getElementById('search-overlay')
const cartDrawer = document.getElementById('cart-drawer')
const drawerBackdrop = document.getElementById('drawer-backdrop')
const overlayPanels = [mobileMenu, searchOverlay, cartDrawer].filter(Boolean)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const openPanels = new Set()
let lastFocusedElement = null

const animationDuration = reducedMotion ? 0 : 0.24
const focusTargets = new WeakMap()

function updateScrollLock() {
  document.body.classList.toggle('nav-overlay-open', openPanels.size > 0)
}

function reveal(element) {
  if (!element) return

  gsap.killTweensOf(element)
  element.classList.remove('hidden')
  element.setAttribute('aria-hidden', 'false')
}

function hide(element) {
  if (!element) return

  gsap.killTweensOf(element)
  element.classList.add('hidden')
  element.setAttribute('aria-hidden', 'true')
  gsap.set(element, { clearProps: 'opacity,visibility,transform' })

  const triggerSelector = element === mobileMenu
    ? '[data-open-menu]'
    : element === searchOverlay
      ? '[data-open-search]'
      : element === cartDrawer
        ? '[data-open-cart]'
        : null
  if (triggerSelector) {
    document.querySelectorAll(triggerSelector).forEach((button) => {
      button.setAttribute('aria-expanded', 'false')
    })
  }
}

function closePanel(element, onClosed) {
  if (!element || element.classList.contains('hidden')) return

  openPanels.delete(element)
  updateScrollLock()
  element.setAttribute('aria-hidden', 'true')
  gsap.killTweensOf(element)
  hide(element)
  onClosed?.()
}

function closeAllPanels(except) {
  overlayPanels.forEach((panel) => {
    if (panel !== except) {
      closePanel(panel)
      if (panel === cartDrawer) closePanel(drawerBackdrop)
    }
  })
}

function openPanel(element, trigger) {
  if (!element) return

  closeAllPanels(element)
  const focusTarget = trigger instanceof HTMLElement ? trigger : document.activeElement
  focusTargets.set(element, focusTarget)
  lastFocusedElement = focusTarget
  reveal(element)
  openPanels.add(element)
  updateScrollLock()

  const isDrawer = element === cartDrawer
  gsap.fromTo(
    element,
    isDrawer ? { x: 14 } : { y: 6 },
    {
      x: 0,
      y: 0,
      duration: animationDuration,
      ease: 'power2.out',
      clearProps: 'transform',
    },
  )

  if (element === mobileMenu) {
    const rows = element.querySelectorAll('.accordion-btn, .mobile-menu-link')
    if (rows.length && !reducedMotion) {
      gsap.fromTo(rows, { y: 6 }, {
        y: 0,
        duration: 0.3,
        stagger: 0.035,
        ease: 'power2.out',
        clearProps: 'transform',
      })
    }
  }

  if (element === searchOverlay) {
    requestAnimationFrame(() => document.getElementById('overlay-input')?.focus())
  } else {
    element.querySelector('button, a, input')?.focus({ preventScroll: true })
  }
}

function closeMenu() {
  closePanel(mobileMenu, () => {
    document.querySelectorAll('[data-open-menu]').forEach((button) => {
      button.setAttribute('aria-expanded', 'false')
    })
    const focusTarget = focusTargets.get(mobileMenu)
    if (focusTarget instanceof HTMLElement) focusTarget.focus()
  })
}

function closeSearch() {
  closePanel(searchOverlay, () => {
    document.querySelectorAll('[data-open-search]').forEach((button) => {
      button.setAttribute('aria-expanded', 'false')
    })
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus()
  })
}

function closeCart() {
  closePanel(cartDrawer, () => {
    document.querySelectorAll('[data-open-cart]').forEach((button) => {
      button.setAttribute('aria-expanded', 'false')
    })
    const focusTarget = focusTargets.get(cartDrawer)
    if (focusTarget instanceof HTMLElement) focusTarget.focus()
  })
  closePanel(drawerBackdrop)
}

function toggleAccordion(button) {
  const panel = button.nextElementSibling
  if (!(panel instanceof HTMLElement)) return

  const isExpanded = button.getAttribute('aria-expanded') === 'true'
  const icon = button.querySelector('.accordion-icon')
  button.setAttribute('aria-expanded', String(!isExpanded))

  if (isExpanded) {
    panel.classList.add('hidden')
    gsap.set(panel, { clearProps: 'height,opacity,visibility,transform' })
    if (icon) gsap.to(icon, { rotate: 0, duration: animationDuration })
    return
  }

  panel.classList.remove('hidden')
  const links = panel.querySelectorAll('a')
  if (!reducedMotion && links.length) {
    gsap.fromTo(links, { y: 5 }, {
      y: 0,
      duration: 0.2,
      stagger: 0.025,
      ease: 'power2.out',
      clearProps: 'transform',
    })
  }
  if (icon) gsap.to(icon, { rotate: 180, duration: animationDuration })
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return

  const menuTrigger = event.target.closest('[data-open-menu]')
  const searchTrigger = event.target.closest('[data-open-search]')
  const cartTrigger = event.target.closest('[data-open-cart]')

  if (menuTrigger) {
    openPanel(mobileMenu, menuTrigger)
    menuTrigger.setAttribute('aria-expanded', 'true')
  } else if (event.target.closest('[data-close-menu]')) {
    closeMenu()
  }

  if (searchTrigger) {
    openPanel(searchOverlay, searchTrigger)
    searchTrigger.setAttribute('aria-expanded', 'true')
  } else if (event.target.closest('[data-close-search]')) {
    closeSearch()
  }

  if (cartTrigger) {
    openPanel(cartDrawer, cartTrigger)
    reveal(drawerBackdrop)
    cartTrigger.setAttribute('aria-expanded', 'true')
  } else if (event.target.closest('[data-close-cart]')) {
    closeCart()
  }

  const accordionButton = event.target.closest('.accordion-btn')
  if (accordionButton) toggleAccordion(accordionButton)

  if (event.target.closest('#mobile-menu a')) closeMenu()
})

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return

  closeMenu()
  closeSearch()
  closeCart()
})

if (!reducedMotion) {
  const headerItems = document.querySelectorAll('.brand-link, .nav-inner > ul > li, .nav-inner > .flex > button')
  gsap.fromTo(headerItems, { y: -6 }, {
    y: 0,
    duration: 0.45,
    stagger: 0.035,
    ease: 'power2.out',
    clearProps: 'transform',
  })

  const dock = document.querySelector('.bottom-dock')
  if (dock) {
    gsap.fromTo(dock, { y: 8 }, {
      y: 0,
      duration: 0.45,
      ease: 'power2.out',
      clearProps: 'transform',
    })
  }
}
