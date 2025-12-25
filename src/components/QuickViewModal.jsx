import React, { useState } from "react";
import "../style/QuickViewModal.css";  // Relative path

const QuickViewModal = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    });
    onClose();
  };

  return (
    <div className="quickview-modal-overlay" onClick={onClose}>
      <div className="quickview-modal-content" onClick={e => e.stopPropagation()}>
        <button className="quickview-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="quickview-container">
          {/* Left Side - Image */}
          <div className="quickview-image-section">
            <div className="quickview-image-wrapper">
              <img src={product.img} alt={product.name} className="quickview-img" />
            </div>
            <div className="image-thumbnails">
              <div className="thumbnail active">
                <img src={product.img} alt="Main" />
              </div>
              <div className="thumbnail">
                <img src={product.img} alt="Side" />
              </div>
              <div className="thumbnail">
                <img src={product.img} alt="Detail" />
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="quickview-details-section">
            <div className="quickview-header">
              <span className="product-code">{product.code}</span>
              <div className="rating">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
                <span className="rating-text">(4.5/5)</span>
              </div>
            </div>

            <h2 className="quickview-title">{product.name}</h2>
            <p className="quickview-company">
              <i className="fas fa-store"></i> {product.company}
            </p>

            <p className="quickview-description">{product.description}</p>

            {/* Price Section */}
            <div className="quickview-price-section">
              <div className="price-display">
                <span className="original-price">Rs. {product.originalPrice.toLocaleString()}</span>
                <span className="discounted-price">Rs. {product.discountedPrice.toLocaleString()}</span>
                <span className="discount-badge">Save {product.discountPercentage}%</span>
              </div>
              <p className="save-amount">
                <i className="fas fa-tag"></i> You save Rs. {(product.originalPrice - product.discountedPrice).toLocaleString()}
              </p>
            </div>

            {/* Color Selection */}
            <div className="quickview-option">
              <h4><i className="fas fa-palette"></i> Color:</h4>
              <div className="color-options">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Color option ${index + 1}`}
                  >
                    {selectedColor === color && <i className="fas fa-check"></i>}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="quickview-option">
              <h4><i className="fas fa-ruler-combined"></i> Size:</h4>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <a href="#size-guide" className="size-guide-link">
                <i className="fas fa-info-circle"></i> Size Guide
              </a>
            </div>

            {/* Quantity */}
            <div className="quickview-option">
              <h4><i className="fas fa-sort-amount-up"></i> Quantity:</h4>
              <div className="quantity-selector">
                <button 
                  className="quantity-btn minus"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn plus"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <i className="fas fa-plus"></i>
                </button>
                <span className="stock-info">
                  <i className="fas fa-box"></i> {product.stock} items in stock
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="quickview-actions">
              <button className="add-to-cart-main" onClick={handleAddToCart}>
                <i className="fas fa-shopping-cart"></i>
                <span>Add to Cart - Rs. {(product.discountedPrice * quantity).toLocaleString()}</span>
              </button>
              <button className="buy-now-main">
                <i className="fas fa-bolt"></i>
                <span>Buy Now</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="additional-info">
              <div className="info-item">
                <i className="fas fa-shipping-fast"></i>
                <span>Free shipping on orders above Rs. 5000</span>
              </div>
              <div className="info-item">
                <i className="fas fa-exchange-alt"></i>
                <span>Easy 15-day return policy</span>
              </div>
              <div className="info-item">
                <i className="fas fa-shield-alt"></i>
                <span>100% Authentic Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;