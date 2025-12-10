import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "../style/Cart.css";

function Cart() {
  const { 
    cartItems, 
    cartStats,
    removeFromCart, 
    updateQuantity,
    clearCart,
    moveToWishlist,
    saveForLater,
    applyCoupon 
  } = useCart();
  
  const [showModal, setShowModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });

  // Empty cart case
  if (cartItems.length === 0)
    return (
      <div className="container empty-cart-container">
        <h2 className="empty-cart">🛒 Your cart is feeling lonely</h2>
        <p className="empty-cart-text">
          Add some stylish items and make it happy! Explore our collection and 
          find something that speaks to your style 💫
        </p>
        <a href="/products" className="btn btn--primary shop-now-btn">
          ✨ Explore Collection
        </a>
        
        {/* Load saved cart option */}
        <button className="btn btn--secondary load-saved-btn" onClick={saveForLater}>
          📥 Check Saved Cart
        </button>
      </div>
    );

  // Handle coupon application
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      alert("Please enter a coupon code");
      return;
    }
    
    const result = applyCoupon(couponCode);
    if (result) {
      setCouponApplied(result);
    }
  };

  // Calculate final total with coupon
  const calculateFinalTotal = () => {
    let total = cartStats.grandTotal || 0;
    
    if (couponApplied) {
      if (couponApplied.type === "freeshipping") {
        total -= couponApplied.value;
      } else if (couponApplied.type === "percentage") {
        total -= couponApplied.amount;
      }
    }
    
    return Math.max(0, total).toFixed(0);
  };

  // Calculate item price (handles string or number)
  const getItemPrice = (item) => {
    if (typeof item.price === 'string') {
      return parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
    }
    return Number(item.price) || 0;
  };

  // Handle form submission
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    
    const orderDetails = {
      orderId: `ORD-${Date.now()}`,
      customer: checkoutData,
      items: cartItems,
      subtotal: cartStats.totalPrice,
      shipping: cartStats.shippingCost,
      tax: cartStats.tax,
      discount: couponApplied ? couponApplied.amount || couponApplied.value : 0,
      total: calculateFinalTotal(),
      date: new Date().toISOString()
    };
    
    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem("fashionhub_orders") || "[]");
    localStorage.setItem("fashionhub_orders", JSON.stringify([orderDetails, ...existingOrders]));
    
    alert(
      `🎉 Order Confirmed!\n\nOrder ID: ${orderDetails.orderId}\nThank you, ${checkoutData.name}!\nTotal: Rs ${orderDetails.total}\n\nWe've sent order details to ${checkoutData.email}\nOur team will contact you soon for delivery.`
    );
    
    setShowModal(false);
    clearCart();
    setCheckoutData({ name: "", email: "", phone: "", address: "", city: "", zipCode: "" });
    setCouponApplied(null);
    setCouponCode("");
  };

  return (
    <div className="container cart-page">
      <h2 className="cart-title">🛍️ Your Shopping Cart ({cartStats.totalItems} items)</h2>

      <div className="cart-container">
        {/* Cart items list */}
        <div className="cart-list">
          {cartItems.map((item) => {
            const itemPrice = getItemPrice(item);
            return (
              <div key={item.id} className="cart-item">
                <div className="cart-item__image-container">
                  <img src={item.img} alt={item.name} className="cart-img" />
                  {item.discount && (
                    <span className="cart-item__badge">-{item.discount}%</span>
                  )}
                </div>
                
                <div className="cart-item__content">
                  <div className="cart-item__header">
                    <h3 className="cart-item__name">{item.name}</h3>
                    <p className="cart-item__price">Rs {itemPrice}</p>
                  </div>
                  
                  <p className="cart-item__meta">
                    Price: Rs {itemPrice} × {item.quantity}
                  </p>
                  
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    >
                      −
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <p className="cart-item__subtotal">
                    Subtotal: Rs {(item.quantity * itemPrice).toFixed(0)}
                  </p>
                  
                  <div className="cart-item__actions">
                    <button 
                      className="cart-item__action-btn cart-item__action-btn--wishlist"
                      onClick={() => moveToWishlist(item.id)}
                    >
                      <span>💖</span> Save for Later
                    </button>
                    <button 
                      className="cart-item__action-btn cart-item__action-btn--remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <span>🗑️</span> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart summary sidebar */}
        <div className="cart-summary">
          <h3 className="cart-summary__title">Order Summary</h3>
          
          <div className="cart-summary__details">
            <div className="cart-summary__row">
              <span>Subtotal ({cartStats.totalItems} items)</span>
              <span>Rs {(cartStats.totalPrice || 0).toFixed(0)}</span>
            </div>
            <div className="cart-summary__row">
              <span>Shipping</span>
              <span className={cartStats.isFreeShipping ? "cart-summary__value--free" : ""}>
                {cartStats.isFreeShipping ? 'FREE' : `Rs ${cartStats.shippingCost || 0}`}
              </span>
            </div>
            <div className="cart-summary__row">
              <span>Tax (16%)</span>
              <span>Rs {(cartStats.tax || 0).toFixed(0)}</span>
            </div>
            
            <div className="coupon-section">
              <h4 className="coupon-section__title">Apply Coupon</h4>
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                />
                <button 
                  className="coupon-btn"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <div className="coupon-applied">
                  <span className="coupon-applied__text">
                    <span>✅</span> Coupon Applied
                  </span>
                  <span className="discount-amount">
                    -Rs {couponApplied.type === "percentage" 
                      ? (couponApplied.amount || 0).toFixed(0)
                      : (couponApplied.value || 0)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total Amount</span>
              <span className="cart-total">Rs {calculateFinalTotal()}</span>
            </div>
          </div>
          
          <div className="cart-summary__actions">
            <button 
              className="btn btn--primary checkout-btn" 
              onClick={() => setShowModal(true)}
            >
              <span>✅</span> Proceed to Checkout
            </button>
            <button 
              className="btn btn--outline save-later-btn"
              onClick={saveForLater}
            >
              <span>💾</span> Save Cart
            </button>
            <button 
              className="btn btn--danger clear-btn" 
              onClick={clearCart}
            >
              <span>🧹</span> Clear Cart
            </button>
          </div>
          
          <div className="trust-badges">
            <div className="badge">
              <span>🔒</span> Secure Checkout
            </div>
            <div className="badge">
              <span>💳</span> Multiple Payments
            </div>
            <div className="badge">
              <span>📦</span> Free Shipping
            </div>
            <div className="badge">
              <span>↩️</span> Easy Returns
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showModal && (
        <div className="checkout-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-modal__header">
              <h3 className="checkout-modal__title">Complete Your Order</h3>
              <p className="checkout-modal__subtitle">Review your items and enter your details</p>
            </div>
            
            <div className="checkout-modal__content">
              <div className="order-summary-modal">
                <h4 className="order-summary-modal__title">Order Details</h4>
                <div className="order-items">
                  {cartItems.map(item => {
                    const itemPrice = getItemPrice(item);
                    return (
                      <div key={item.id} className="order-item">
                        <span>{item.name} <span className="order-item__quantity">× {item.quantity}</span></span>
                        <span>Rs {(item.quantity * itemPrice).toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="cart-summary__row cart-summary__row--total">
                  <span>Total Amount</span>
                  <span className="cart-total">Rs {calculateFinalTotal()}</span>
                </div>
              </div>
              
              <form onSubmit={handleCheckoutSubmit} className="checkout-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={checkoutData.name}
                    onChange={(e) =>
                      setCheckoutData({ ...checkoutData, name: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={checkoutData.email}
                      onChange={(e) =>
                        setCheckoutData({ ...checkoutData, email: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+92 XXX XXXXXXX"
                      value={checkoutData.phone}
                      onChange={(e) =>
                        setCheckoutData({ ...checkoutData, phone: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    placeholder="Street address, apartment, suite, etc."
                    value={checkoutData.address}
                    onChange={(e) =>
                      setCheckoutData({ ...checkoutData, address: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={checkoutData.city}
                      onChange={(e) =>
                        setCheckoutData({ ...checkoutData, city: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      placeholder="ZIP / Postal code"
                      value={checkoutData.zipCode}
                      onChange={(e) =>
                        setCheckoutData({ ...checkoutData, zipCode: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="form-input payment-method" required>
                    <option value="">Select payment method</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="easypaisa">EasyPaisa</option>
                  </select>
                </div>
                
                <div className="checkout-modal__footer">
                  <button
                    type="button"
                    className="btn btn--outline cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--primary submit-btn">
                    Confirm Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;