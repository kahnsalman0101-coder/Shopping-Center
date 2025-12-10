import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "../style/WinterSlider.css";

const winterProducts = [
  {
    id: 1,
    title: "Premium Wool Coat",
    category: "Outerwear",
    price: 12999,
    originalPrice: 15999,
    discount: 19,
    image: "/WinterSlider/500x500-aura_cd6eb830-2078-42c0-9b7b-599a2db95213_600x600.webp",
    badge: "Best Seller",
    colors: ["#2C3E50", "#7F8C8D", "#BDC3C7"]
  },
  {
    id: 2,
    title: "Luxury Cashmere Sweater",
    category: "Knits",
    price: 8999,
    originalPrice: 11999,
    discount: 25,
    image: "/WinterSlider/500x500-lux-pret_ad15a7e6-261c-4a2f-b225-7bbe71205ea7_600x600.webp",
    badge: "New",
    colors: ["#C0392B", "#E74C3C", "#922B21"]
  },
  {
    id: 3,
    title: "Thermal Jacket Pro",
    category: "Activewear",
    price: 7499,
    originalPrice: 9999,
    discount: 25,
    image: "/WinterSlider/500x500-pret_613601c4-d27d-4eb0-987f-b277f93deb5d_600x600.jpg",
    badge: "Limited",
    colors: ["#1A5276", "#3498DB", "#2E86C1"]
  },
  {
    id: 4,
    title: "Designer Printed Set",
    category: "Unstitched",
    price: 6499,
    originalPrice: 8499,
    discount: 24,
    image: "/WinterSlider/500x500-unstitched-printed_7cff4e0e-0983-4f58-af08-c4193e0ed8be_600x600.webp",
    badge: "Sale",
    colors: ["#27AE60", "#229954", "#196F3D"]
  },
  {
    id: 5,
    title: "Premium Unstitched",
    category: "Fabric",
    price: 5499,
    originalPrice: 6999,
    discount: 21,
    image: "/WinterSlider/500x500-unstitched_c623f23d-1579-4887-a76f-5987d86719dc_600x600.webp",
    badge: "Trending",
    colors: ["#8E44AD", "#9B59B6", "#7D3C98"]
  },
  {
    id: 6,
    title: "Winter Essentials Bundle",
    category: "Collection",
    price: 19999,
    originalPrice: 25999,
    discount: 23,
    image: "/WinterSlider/500x500-aura_cd6eb830-2078-42c0-9b7b-599a2db95213_600x600.webp",
    badge: "Bundle",
    colors: ["#D35400", "#E67E22", "#BA4A00"]
  }
];

export default function WinterSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price).replace('PKR', 'Rs');
  };

  return (
    <section className="winter-collection-section">
      <div className="container">
        {/* Header Section */}
        <div className="section-header">
          <div className="header-content">
            <span className="section-subtitle">Winter 2025</span>
            <h1 className="section-title">
              <span className="title-highlight">Premium</span> Winter Collection
            </h1>
            <p className="section-description">
              Discover our curated winter essentials - from luxurious outerwear to cozy knits, 
              each piece crafted for style and comfort in the coldest months.
            </p>
          </div>
          
          <div className="header-actions">
            <button className="btn btn-secondary">
              <span>View All</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="collection-stats">
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Designs</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Premium</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Section */}
        <div className="slider-wrapper">
          <div className="slider-controls-top">
            <div className="slider-info">
              <span className="active-product-index">0{activeIndex + 1}</span>
              <span className="divider">/</span>
              <span className="total-products">0{winterProducts.length}</span>
            </div>
            
            <div className="slider-navigation">
              <button 
                ref={navigationPrevRef}
                className="nav-btn nav-btn-prev"
                aria-label="Previous slide"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                ref={navigationNextRef}
                className="nav-btn nav-btn-next"
                aria-label="Next slide"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Autoplay, EffectCoverflow]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            speed={800}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: true,
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 20,
                centeredSlides: true,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
                centeredSlides: false,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
                centeredSlides: true,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 30,
                centeredSlides: false,
              },
            }}
            className="winter-slider"
          >
            {winterProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="product-card">
                  {/* Product Badge */}
                  {product.badge && (
                    <div className={`product-badge badge-${product.badge.toLowerCase().replace(' ', '-')}`}>
                      {product.badge}
                    </div>
                  )}

                  {/* Discount Tag */}
                  {product.discount && (
                    <div className="discount-tag">
                      -{product.discount}%
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="product-image-wrapper">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="product-image"
                      loading="lazy"
                    />
                    <div className="image-overlay">
                      <button className="quick-view-btn" aria-label="Quick view">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-title">{product.title}</h3>
                    
                    {/* Color Options */}
                    <div className="color-options">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          className="color-option"
                          style={{ backgroundColor: color }}
                          aria-label={`Color option ${index + 1}`}
                        />
                      ))}
                    </div>

                    {/* Price Section */}
                    <div className="product-price-section">
                      <div className="price-wrapper">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="original-price">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      
                      <button className="add-to-cart-btn" aria-label="Add to cart">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Progress Indicator */}
          <div className="slider-progress">
            <div 
              className="progress-bar" 
              style={{ 
                width: `${((activeIndex + 1) / winterProducts.length) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="collection-features">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Premium Quality</h4>
            <p>100% authentic materials with expert craftsmanship</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Free Shipping</h4>
            <p>Free delivery on orders above Rs 5,000</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.4 15C19.2669 15.9239 18.975 16.8201 18.5375 17.6475C18.1 18.4749 17.5242 19.2204 16.8375 19.85C16.1508 20.4796 15.3641 20.9834 14.5144 21.338C13.6646 21.6926 12.7652 21.8927 11.8536 21.9295C10.942 21.9662 10.033 21.839 9.16809 21.5544C8.3032 21.2697 7.49616 20.8323 6.7875 20.2625C6.07884 19.6927 5.47995 18.9998 5.01875 18.219C4.55755 17.4382 4.24135 16.5821 4.085 15.6925" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.6 9C4.73312 8.07615 5.02496 7.17993 5.46245 6.35253C5.89995 5.52513 6.47575 4.77961 7.16245 4.15C7.84916 3.52039 8.63585 3.0166 9.48562 2.66201C10.3354 2.30742 11.2348 2.1073 12.1464 2.07054C13.058 2.03379 13.967 2.16096 14.8319 2.44563C15.6968 2.73029 16.5038 3.1677 17.2125 3.7375C17.9212 4.3073 18.5201 5.00022 18.9813 5.78098C19.4425 6.56175 19.7587 7.41789 19.915 8.3075" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Easy Returns</h4>
            <p>30-day return policy for all products</p>
          </div>
        </div>
      </div>
    </section>
  );
}