import React, { useState } from 'react';
import '../style/ProductCard.css';

const ProductCard = ({ 
  productCode,
  productName,
  originalPrice,
  discountedPrice,
  fabricType,
  pieces,
  imageUrl,
  isNew = false,
  onAddToCart
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <div className="product-card">
      <div className="product-header">
        <div className="shop-name">ALI JEE Collection</div>
        <div className="discount-badge">{discount}% OFF</div>
      </div>

      <div className="image-container" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <img src={imageUrl || "https://via.placeholder.com/300x400"} alt={productName} className="product-image" />
        {isNew && <div className="new-badge">NEW</div>}
        {isHovered && (
          <div className="image-overlay">
            <button 
              className={`icon-btn favorite-btn ${isFavorite ? 'active' : ''}`} 
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
            >
              ♥
            </button>
            <button 
              className="icon-btn quickview-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickView(true);
              }}
            >
              👁
            </button>
          </div>
        )}
      </div>

      <div className="product-details">
        <div className="product-code">{productCode}</div>
        <h3 className="product-title">{productName}</h3>
        <div className="product-specs">
          <span className="fabric-type">{fabricType}</span>
          <span className="pieces-count">{pieces} PCS</span>
        </div>
        <div className="pricing">
          <span className="original-price">Rs. {originalPrice.toLocaleString()}</span>
          <span className="discounted-price">Rs. {discountedPrice.toLocaleString()}</span>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to cart
        </button>
      </div>

      {showQuickView && (
        <div className="quick-view-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowQuickView(false)}>×</button>
            <h2>Product Details</h2>
            <div className="modal-body">
              <img src={imageUrl} alt={productName} />
              <div className="modal-details">
                <h3>{productCode}</h3>
                <h4>{productName}</h4>
                <p><strong>Fabric:</strong> {fabricType}</p>
                <p><strong>Pieces:</strong> {pieces}</p>
                <p><strong>Description:</strong> Premium quality {fabricType.toLowerCase()} fabric with intricate embroidery. Perfect for special occasions.</p>
                <div className="modal-pricing">
                  <span className="original-price">Rs. {originalPrice.toLocaleString()}</span>
                  <span className="discounted-price">Rs. {discountedPrice.toLocaleString()}</span>
                  <span className="discount-percent">({discount}% OFF)</span>
                </div>
                <button className="modal-add-to-cart" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;