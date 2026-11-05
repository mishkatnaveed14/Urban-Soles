import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "swiper/css";

import { formatPrice } from "./product.js";

export default function ProductCarousel({
  products,
  activeIndex,
  onSelect,
}) {
  return (
    <div className="carousel-section" id="collection">
      <div className="carousel-heading">
        <div>
          <span className="section-eyebrow">
            CURATED FOR YOU
          </span>
          <h3>Explore Collection</h3>
        </div>

        <div className="carousel-controls">
          <button
            className="carousel-prev"
            aria-label="Previous products"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            className="carousel-next"
            aria-label="Next products"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        slidesPerView={2}
        spaceBetween={12}
        navigation={{
          prevEl: ".carousel-prev",
          nextEl: ".carousel-next",
        }}
        onSlideChange={(swiper) =>
          onSelect(swiper.realIndex)
        }
        breakpoints={{
          600: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          900: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        className="product-swiper"
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id}>
            <button
              className={`product-card ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => onSelect(index)}
            >
              <div className="product-card-image">
                <span>{product.tag}</span>

                <div className="product-placeholder">
                  <div className="mini-shoe">
                    <span />
                  </div>
                </div>
              </div>

              <div className="product-card-info">
                <h4>{product.name}</h4>
                <p>{product.category}</p>
                <strong>{formatPrice(product.price)}</strong>
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
