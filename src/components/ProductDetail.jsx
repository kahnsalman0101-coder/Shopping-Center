import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../style/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Get product data from location.state (passed from Product.jsx)
  const product = location.state || {
    id,
    name: "Unknown Product",
    price: "N/A",
    img: "https://via.placeholder.com/350x450?text=Product+Image",
    code: "",
    company: "",
    originalPrice: 0,
    discountedPrice: 0,
    discountPercentage: 0,
    description: "",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    sizes: ["S", "M", "L", "XL"],
    stock: 0,
    category: ""
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountedPrice,
      image: product.img,
      quantity: quantity,
      size: selectedSize || product.sizes[0],
      color: selectedColor || product.colors[0]
    });
    
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    // First add to cart
    handleAddToCart();
    
    alert(
      `✅ Order Confirmed!\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${formData.address}\n\nThank you for shopping with us 💖`
    );
    setShowModal(false);
    setFormData({ name: "", email: "", phone: "", address: "" });
  };

  return (
    <div className="product-detail-page">
      {/* Back Button */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back to Products
        </button>
        <div className="breadcrumb">
          <span>Home</span>
          <i className="fas fa-chevron-right"></i>
          <span>Products</span>
          <i className="fas fa-chevron-right"></i>
          <span className="current">{product.name}</span>
        </div>
      </div>

      <div className="product-detail-container">
        {/* Left Column - Images */}
        <div className="detail-image-section">
          <div className="main-image-container">
            <img src={product.img} alt={product.name} className="detail-img" />
            {product.discountPercentage > 0 && (
              <div className="discount-badge-large">
                <span className="discount-text">SALE</span>
                <span className="discount-percent">{product.discountPercentage}% OFF</span>
              </div>
            )}
          </div>
          
          <div className="image-thumbnails">
            <div className="thumbnail active">
              <img src={product.img} alt="Main" />
            </div>
            <div className="thumbnail">
              <img src={product.img} alt="Side View" />
            </div>
            <div className="thumbnail">
              <img src={product.img} alt="Detail View" />
            </div>
            <div className="thumbnail">
              <img src={product.img} alt="Back View" />
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="detail-info-section">
          <div className="product-info-header">
            <div className="product-code-info">
              <span className="product-code">{product.code}</span>
              <span className="company-name">
                <i className="fas fa-store"></i> {product.company}
              </span>
            </div>
            
            <div className="rating-info">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
              <span className="rating-text">4.5/5 (128 Reviews)</span>
            </div>
          </div>

          <h1 className="product-title">{product.name}</h1>
          
          {/* Price Section */}
          <div className="price-section">
            <div className="price-row">
              {product.originalPrice && (
                <span className="original-price">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="current-price">
                Rs. {product.discountedPrice.toLocaleString()}
              </span>
              {product.discountPercentage > 0 && (
                <span className="discount-tag">
                  Save {product.discountPercentage}%
                </span>
              )}
            </div>
            {product.originalPrice && (
              <p className="save-amount">
                <i className="fas fa-wallet"></i> 
                You save Rs. {(product.originalPrice - product.discountedPrice).toLocaleString()}
              </p>
            )}
            
            {product.stock > 0 ? (
              <div className="stock-info">
                <i className="fas fa-check-circle" style={{color: '#2ed573'}}></i>
                <span>In Stock: {product.stock} items available</span>
              </div>
            ) : (
              <div className="stock-info out-of-stock">
                <i className="fas fa-times-circle"></i>
                <span>Out of Stock</span>
              </div>
            )}
          </div>

          {/* Product Description */}
          <div className="description-section">
            <h3><i className="fas fa-info-circle"></i> Product Description</h3>
            <p>{product.description || "Step into elegance with our premium design — made with fine fabrics, luxurious detailing, and a timeless silhouette."}</p>
            
            <div className="features">
              <div className="feature">
                <i className="fas fa-check"></i>
                <span>Premium Quality Fabric</span>
              </div>
              <div className="feature">
                <i className="fas fa-check"></i>
                <span>Intricate Embroidery Work</span>
              </div>
              <div className="feature">
                <i className="fas fa-check"></i>
                <span>Comfortable Fit</span>
              </div>
              <div className="feature">
                <i className="fas fa-check"></i>
                <span>Easy to Wash &amp; Maintain</span>
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="size-options-section">
            <h3><i className="fas fa-ruler-combined"></i> Select Size</h3>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <a href="#size-guide" className="size-guide-link">
              <i className="fas fa-ruler"></i> Size Guide
            </a>
          </div>

          {/* Color Selection */}
          <div className="color-options-section">
            <h3><i className="fas fa-palette"></i> Select Color</h3>
            <div className="color-options">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  title={`Color option ${index + 1}`}
                >
                  {selectedColor === color && <i className="fas fa-check"></i>}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="quantity-section">
            <h3><i className="fas fa-sort-amount-up"></i> Quantity</h3>
            <div className="quantity-controls">
              <button 
                className="qty-btn minus"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <i className="fas fa-minus"></i>
              </button>
              <span className="qty-value">{quantity}</span>
              <button 
                className="qty-btn plus"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                <i className="fas fa-plus"></i>
              </button>
              <span className="stock-left">
                {product.stock} items available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <i className="fas fa-shopping-cart"></i>
              Add to Cart
              {quantity > 1 && ` (${quantity} items)`}
            </button>
            
            <button 
              className="buy-now-btn"
              onClick={() => setShowModal(true)}
              disabled={product.stock === 0}
            >
              <i className="fas fa-bolt"></i>
              Buy Now
            </button>
            
            <button className="wishlist-btn">
              <i className="far fa-heart"></i>
              Add to Wishlist
            </button>
          </div>

          {/* Product Specifications */}
          <div className="specifications">
            <h3><i className="fas fa-clipboard-list"></i> Specifications</h3>
            <div className="spec-grid">
              <div className="spec-item">
                <span className="spec-label">Category</span>
                <span className="spec-value">{product.category || "Unstitched Fabric"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Fabric</span>
                <span className="spec-value">Premium Cotton Lawn</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Work</span>
                <span className="spec-value">Embroidery &amp; Printed</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Set Includes</span>
                <span className="spec-value">2-3 Pieces</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Care</span>
                <span className="spec-value">Dry Clean Only</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Occasion</span>
                <span className="spec-value">Festive, Wedding, Casual</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="shipping-info">
            <div className="shipping-item">
              <i className="fas fa-shipping-fast"></i>
              <div>
                <h4>Free Shipping</h4>
                <p>On orders above Rs. 5000</p>
              </div>
            </div>
            <div className="shipping-item">
              <i className="fas fa-undo"></i>
              <div>
                <h4>Easy Returns</h4>
                <p>15-day return policy</p>
              </div>
            </div>
            <div className="shipping-item">
              <i className="fas fa-shield-alt"></i>
              <div>
                <h4>Authentic Products</h4>
                <p>100% Original</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Now Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">
              <i className="fas fa-shopping-bag"></i> Complete Your Purchase
            </h2>
            
            <div className="order-summary">
              <div className="summary-item">
                <img src={product.img} alt={product.name} className="summary-img" />
                <div className="summary-details">
                  <h4>{product.name}</h4>
                  <p>Size: {selectedSize || product.sizes[0]}</p>
                  <p>Color: {selectedColor || "Default"}</p>
                  <p>Quantity: {quantity}</p>
                  <p className="summary-price">Rs. {(product.discountedPrice * quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleBuyNow} className="checkout-form">
              <h3><i className="fas fa-user"></i> Shipping Details</h3>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="address"
                placeholder="Delivery Address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows="3"
              ></textarea>

              <div className="modal-buttons">
                <button type="submit" className="confirm-btn">
                  <i className="fas fa-check"></i> Confirm Order
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;