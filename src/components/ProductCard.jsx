import React, { useState } from 'react';
import '../style/ProductCard.css';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ 
  product,
  onAddToCart
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  
  const {
    id,
    productCode,
    productName,
    originalPrice,
    discountedPrice,
    fabricType,
    pieces,
    imageUrl,
    isNew = false,
    currencySymbol = '₨',
    discountPercentage
  } = product;

  const discount = discountPercentage || Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
    }
  };

  const handleQuickViewAddToCart = (productWithOptions) => {
    if (onAddToCart) {
      onAddToCart();
    }
    
    if (window.toast) {
      window.toast.success(`${product.productName} added to cart!`);
    }
  };

  const quickViewProduct = {
    id: id,
    name: productName,
    code: productCode,
    company: "ASIM JOFA",
    originalPrice: originalPrice,
    discountedPrice: discountedPrice,
    discountPercentage: discount,
    currencySymbol: currencySymbol,
    description: `Premium ${fabricType} fabric with intricate embroidery. Perfect for special occasions. Made with high-quality materials and attention to detail.`,
    colors: [],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 15,
    img: imageUrl,
    category: fabricType
  };

  return (
    <>
      <div className="product-card">
        <div className="card-header">
          <div className="brand-tag">ASIM JOFA</div>
          <div className="discount-tag">-{discount}%</div>
        </div>

        <div className="product-image-section">
          <img 
            src={imageUrl || "https://via.placeholder.com/300x400"} 
            alt={productName} 
            className="product-image" 
          />
          {isNew && <div className="new-badge">NEW</div>}
          
          <div className="quick-view-overlay">
            <button 
              className="quick-view-btn"
              onClick={() => setShowQuickView(true)}
              aria-label="Quick view"
            >
              👁 Quick View
            </button>
          </div>
        </div>

        <div className="product-info-section">
          <div className="product-code-row">
            <span className="product-code">{productCode}</span>
            <div className="quick-actions">
              <button 
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={() => setIsFavorite(!isFavorite)}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
              <button 
                className="quick-view-link"
                onClick={() => setShowQuickView(true)}
                aria-label="Quick view"
              >
                <span className="eye-icon">👁</span>
              </button>
            </div>
          </div>

          <h3 className="product-name">{productName}</h3>
          
          <div className="product-specs">
            <span className="pieces-count">{pieces} PCS</span>
            <span className="fabric-type">• {fabricType}</span>
          </div>

          {/* Updated price section with dynamic currency symbol */}
          <div className="price-section">
            <div className="original-price">
              {currencySymbol} {originalPrice.toLocaleString()}
            </div>
            <div className="discounted-price">
              {currencySymbol} {discountedPrice.toLocaleString()}
            </div>
          </div>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            ADD TO CART
          </button>
        </div>
      </div>

      {showQuickView && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setShowQuickView(false)}
          onAddToCart={handleQuickViewAddToCart}
        />
      )}
    </>
  );
};

export default ProductCard;