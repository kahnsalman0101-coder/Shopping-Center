import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext"; // Import useCurrency
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
  
  const { currencySymbol, getCurrencyInfo } = useCurrency(); // Get currency info
  
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

  // Get currency information
  const currencyInfo = getCurrencyInfo();
  const currentCurrencySymbol = currencySymbol || currencyInfo?.symbol || '₨';
  const currentCurrency = currencyInfo?.currency || 'PKR';

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `${currentCurrencySymbol} ${price?.toLocaleString() || 0}`;
  };

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

        {/* Currency info display */}
        <div className="currency-info-display">
          <span className="currency-label">Prices displayed in:</span>
          <span className="currency-value">{currentCurrency} ({currentCurrencySymbol})</span>
        </div>
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
      currency: currentCurrency,
      currencySymbol: currentCurrencySymbol,
      date: new Date().toISOString()
    };
    
    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem("fashionhub_orders") || "[]");
    localStorage.setItem("fashionhub_orders", JSON.stringify([orderDetails, ...existingOrders]));
    
    alert(
      `🎉 Order Confirmed!\n\nOrder ID: ${orderDetails.orderId}\nThank you, ${checkoutData.name}!\nTotal: ${currentCurrencySymbol} ${orderDetails.total}\n\nWe've sent order details to ${checkoutData.email}\nOur team will contact you soon for delivery.`
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

      {/* Currency info banner */}
      <div className="currency-banner">
        <span className="currency-banner-text">
          💱 All prices are in {currentCurrency} ({currentCurrencySymbol})
        </span>
        <span className="currency-banner-note">
          Shipping rates and taxes calculated based on your location
        </span>
      </div>

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
                    <p className="cart-item__price">{formatPrice(itemPrice)}</p>
                  </div>
                  
                  <div className="cart-item__meta-row">
                    <span className="cart-item__meta-item">
                      <span className="meta-label">Product Code:</span> {item.productCode || "N/A"}
                    </span>
                    {item.category && (
                      <span className="cart-item__meta-item">
                        <span className="meta-label">Category:</span> {item.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="cart-item__meta-row">
                    <span className="cart-item__meta-item">
                      <span className="meta-label">Price:</span> {formatPrice(itemPrice)} × {item.quantity}
                    </span>
                  </div>
                  
                  {/* Display original price if discounted */}
                  {item.originalPrice && item.originalPrice > itemPrice && (
                    <div className="cart-item__original-price">
                      <span className="original-price-label">Original:</span>
                      <span className="original-price-value">{formatPrice(item.originalPrice)}</span>
                      <span className="discount-save">
                        Save {formatPrice((item.originalPrice - itemPrice) * item.quantity)}
                      </span>
                    </div>
                  )}
                  
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
                    <span className="quantity-label">Quantity</span>
                  </div>
                  
                  <p className="cart-item__subtotal">
                    Subtotal: <span className="subtotal-value">{formatPrice(item.quantity * itemPrice)}</span>
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
          <div className="cart-summary__header">
            <h3 className="cart-summary__title">Order Summary</h3>
            <div className="cart-currency-info">
              <span className="cart-currency-label">Currency:</span>
              <span className="cart-currency-value">{currentCurrency} ({currentCurrencySymbol})</span>
            </div>
          </div>
          
          <div className="cart-summary__details">
            <div className="cart-summary__row">
              <span className="cart-summary__label">Subtotal ({cartStats.totalItems} items)</span>
              <span className="cart-summary__value">{formatPrice(cartStats.totalPrice || 0)}</span>
            </div>
            <div className="cart-summary__row">
              <span className="cart-summary__label">Shipping</span>
              <span className={`cart-summary__value ${cartStats.isFreeShipping ? "cart-summary__value--free" : ""}`}>
                {cartStats.isFreeShipping ? 'FREE' : formatPrice(cartStats.shippingCost || 0)}
              </span>
            </div>
            <div className="cart-summary__row">
              <span className="cart-summary__label">Tax (16%)</span>
              <span className="cart-summary__value">{formatPrice(cartStats.tax || 0)}</span>
            </div>
            
            {/* Coupon Section */}
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
                    -{currentCurrencySymbol} {couponApplied.type === "percentage" 
                      ? (couponApplied.amount || 0).toFixed(0)
                      : (couponApplied.value || 0)}
                  </span>
                </div>
              )}
              <div className="coupon-suggestions">
                <span className="coupon-suggestions__label">Try:</span>
                <button className="coupon-suggestion" onClick={() => setCouponCode("WELCOME10")}>WELCOME10</button>
                <button className="coupon-suggestion" onClick={() => setCouponCode("FASHION20")}>FASHION20</button>
                <button className="coupon-suggestion" onClick={() => setCouponCode("SUMMER25")}>SUMMER25</button>
              </div>
            </div>
            
            <div className="cart-summary__divider"></div>
            
            <div className="cart-summary__row cart-summary__row--total">
              <span className="cart-summary__label">Total Amount</span>
              <span className="cart-total">{formatPrice(calculateFinalTotal())}</span>
            </div>

            {/* Shipping info */}
            {cartStats.isFreeShipping ? (
              <div className="free-shipping-message">
                <span>🚚</span> You've qualified for free shipping!
              </div>
            ) : (
              <div className="shipping-progress">
                <span className="shipping-progress__text">
                  Add {formatPrice(5000 - (cartStats.totalPrice || 0))} more for free shipping
                </span>
                <div className="shipping-progress__bar">
                  <div 
                    className="shipping-progress__fill"
                    style={{ width: `${Math.min(100, ((cartStats.totalPrice || 0) / 5000) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
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
              <span>📦</span> Free Shipping over {formatPrice(5000)}
            </div>
            <div className="badge">
              <span>↩️</span> 30-Day Returns
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
              <div className="checkout-currency-info">
                <span>All amounts in {currentCurrency} ({currentCurrencySymbol})</span>
              </div>
            </div>
            
            <div className="checkout-modal__content">
              <div className="order-summary-modal">
                <h4 className="order-summary-modal__title">Order Details</h4>
                <div className="order-items">
                  {cartItems.map(item => {
                    const itemPrice = getItemPrice(item);
                    return (
                      <div key={item.id} className="order-item">
                        <span className="order-item__name">
                          {item.name} 
                          <span className="order-item__quantity">× {item.quantity}</span>
                        </span>
                        <span className="order-item__price">{formatPrice(item.quantity * itemPrice)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="order-summary-totals">
                  <div className="order-summary-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartStats.totalPrice || 0)}</span>
                  </div>
                  <div className="order-summary-row">
                    <span>Shipping</span>
                    <span>{cartStats.isFreeShipping ? 'FREE' : formatPrice(cartStats.shippingCost || 0)}</span>
                  </div>
                  <div className="order-summary-row">
                    <span>Tax</span>
                    <span>{formatPrice(cartStats.tax || 0)}</span>
                  </div>
                  {couponApplied && (
                    <div className="order-summary-row order-summary-row--discount">
                      <span>Discount</span>
                      <span className="discount-value">
                        -{currentCurrencySymbol} {couponApplied.type === "percentage" 
                          ? (couponApplied.amount || 0).toFixed(0)
                          : (couponApplied.value || 0)}
                      </span>
                    </div>
                  )}
                  <div className="order-summary-row order-summary-row--total">
                    <span>Total Amount</span>
                    <span className="order-total">{formatPrice(calculateFinalTotal())}</span>
                  </div>
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

                <div className="payment-note">
                  <span>💡 Note:</span> All transactions are secure and encrypted. Your payment information is never stored on our servers.
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