import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ShoppingBag, ChevronDown } from "lucide-react";

import SneakerScene from "./SneakerScene";
import ProductCarousel from "./product-carousel";
import { formatPrice } from "./product.js";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ products, addToCart }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    products[0]?.sizes.includes(42) ? 42 : (products[0]?.sizes[0] ?? null)
  );

  const product = products[activeIndex];

  const sectionRef = useRef(null);
  const sneakerRef = useRef(null);
  const sceneWrapRef = useRef(null);
  const transitionRef = useRef(false);

  const handleSelect = (index) => {
    if (index === activeIndex || transitionRef.current) return;

    transitionRef.current = true;

    gsap.to(sceneWrapRef.current, {
      xPercent: 110,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        setActiveIndex(index);
        setSelectedSize(products[index].sizes[0] ?? null);

        gsap.set(sceneWrapRef.current, {
          xPercent: -110,
          opacity: 0,
        });

        gsap.to(sceneWrapRef.current, {
          xPercent: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power3.out",
          onComplete: () => {
            transitionRef.current = false;
          },
        });
      },
    });
  };

  const handleAddToCart = () => {
    if (product && selectedSize !== null) addToCart(product, selectedSize);
  };

  if (!product) return null;

  return (
    <section className="hero-scroll" ref={sectionRef}>
      <div className="hero-sticky">
        <div className="hero-background-glow" />
        <div className="hero-grid" />

        <div className="hero-main">
          <div className="hero-information">
            <span className="hero-label">
              <span className="live-dot" />
              {product.tag} / URBAN SOLES
            </span>

            <div className="product-heading" key={product.id}>
              <h1>
                {product.name.split(" ")[0]}
                <br />
                <span>{product.name.split(" ").slice(1).join(" ")}</span>
              </h1>

              <p className="product-category">{product.category}</p>
              <p className="product-description">{product.description}</p>
            </div>

            <div className="product-price">
              <strong>{formatPrice(product.price)}</strong>
              {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
            </div>

            <div className="size-selector">
              <div className="size-heading">
                <span>SELECT SIZE</span>
                <span>UK SIZE</span>
              </div>

              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={selectedSize === size ? "selected" : ""}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="add-cart-button"
              onClick={handleAddToCart}
              disabled={selectedSize === null}
            >
              <ShoppingBag size={18} />
              ADD TO CART
              <ArrowUpRight size={18} />
            </button>

            <div className="product-meta">
              <span>COLOR: {product.color}</span>
              <span>FREE SHIPPING*</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-number">
              0{activeIndex + 1}
              <span> / 0{products.length}</span>
            </div>

            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="sneaker-canvas-wrap" ref={sceneWrapRef}>
              <SneakerScene
                product={product}
                sneakerRef={sneakerRef}
                sectionRef={sectionRef}
              />
            </div>

            <div className="visual-caption">
              <span>DESIGNED FOR MOVEMENT</span>
              <span>EST. 2026</span>
            </div>
          </div>
        </div>

        <ProductCarousel
          products={products}
          activeIndex={activeIndex}
          onSelect={handleSelect}
        />

        <div className="scroll-hint">
          <span>SCROLL TO DISCOVER</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </section>
  );
}
