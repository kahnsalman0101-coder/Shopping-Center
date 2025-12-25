import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../style/CartModal.css';

const CartModal = ({ 
  isOpen, 
  onClose,
  handleCheckout
}) => {
  const { 
    cartItems, 
    cartStats,
    removeFromCart, 
    updateQuantity,
    clearCart
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'PK',
    saveInfo: false
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [discountCode, setDiscountCode] = useState('');
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Hyderabad', 'Peshawar', 'Quetta', 'Sialkot',
    'Gujranwala', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana'
  ];

  const shippingMethods = [
    { id: 'standard', name: 'Standard Shipping', price: 149, time: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 299, time: '2-3 business days' },
    { id: 'priority', name: 'Priority Shipping', price: 499, time: '1-2 business days' }
  ];

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery (COD)', icon: '💵', description: 'Pay when you receive your order' },
    { id: 'payfast', name: 'PAYFAST', icon: '🏦', description: 'Pay via Debit/Credit/Wallet/Bank Account' },
    { id: 'safepay', name: 'Safepay Checkout', icon: '🔒', description: 'Pay with debit & credit cards' },
    { id: 'card', name: 'Debit - Credit Card', icon: '💳', description: 'Secure card payment' }
  ];

  if (!isOpen) return null;

  const subtotal = cartStats.totalPrice || 0;
  const selectedShipping = shippingMethods.find(m => m.id === shippingMethod) || shippingMethods[0];
  const shippingCost = selectedShipping.price;
  const total = subtotal + shippingCost;

  const handleUserDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      setApplyDiscount(true);
      // Add your discount logic here
      alert(`Discount code "${discountCode}" applied!`);
    }
  };

  const handlePlaceOrder = () => {
    // Validate required fields
    const requiredFields = ['email', 'phone', 'firstName', 'lastName', 'address', 'city'];
    const missingFields = requiredFields.filter(field => !userDetails[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const orderData = {
      ...userDetails,
      shippingMethod: selectedShipping,
      paymentMethod: paymentMethods.find(m => m.id === paymentMethod),
      cartItems,
      subtotal,
      shippingCost,
      total,
      discountApplied: applyDiscount,
      discountCode,
      orderDate: new Date().toISOString(),
      orderId: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`
    };

    handleCheckout(orderData);
  };

  const renderPaymentMethodDetails = () => {
    switch (paymentMethod) {
      case 'cod':
        return (
          <div className="payment-method-details cod-details">
            <p>Pay cash when your order arrives</p>
            <p>Extra charges may apply for COD orders</p>
          </div>
        );
      case 'payfast':
        return (
          <div className="payment-method-details">
            <div className="payment-icons">
              <span>visa</span>
              <span>mastercard</span>
              <span>unionpay</span>
            </div>
          </div>
        );
      case 'safepay':
        return (
          <div className="payment-method-details">
            <div className="payment-icons">
              <span>visa</span>
              <span>mastercard</span>
            </div>
            <p>Secure checkout with Safepay</p>
          </div>
        );
      case 'card':
        return (
          <div className="payment-method-details">
            <div className="payment-icons">
              <span>visa</span>
              <span>mastercard</span>
            </div>
            <p>After clicking "Pay now", you will be redirected to complete your purchase securely.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title">
            <h2>🛒 {showCheckout ? 'Checkout' : 'Shopping Cart'}</h2>
            <span className="cart-count">{cartStats.totalItems || 0} items</span>
          </div>
          <button className="close-cart-btn" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some amazing products to get started</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : !showCheckout ? (
            // Cart View
            <>
              <div className="cart-items-section">
                <div className="cart-section-title">
                  <h3>Your Items ({cartItems.length})</h3>
                </div>
                <div className="cart-items-list">
                  {cartItems.map(item => {
                    const itemPrice = typeof item.price === 'string' 
                      ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
                      : Number(item.price) || 0;
                    
                    return (
                      <div key={`${item.id}-${item.quantity}`} className="cart-item">
                        <div className="item-image">
                          <img 
                            src={item.img || item.image} 
                            alt={item.name}
                            loading="lazy"
                          />
                        </div>
                        <div className="item-details">
                          <h4 className="item-name">{item.name}</h4>
                          <p className="item-category">{item.category || 'Fashion'}</p>
                          <p className="item-price">Rs {itemPrice.toLocaleString()}</p>
                        </div>
                        <div className="item-quantity-controls">
                          <button 
                            className="quantity-btn minus"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            −
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button 
                            className="quantity-btn plus"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="item-total">
                          <span className="total-amount">
                            Rs {(itemPrice * item.quantity).toLocaleString()}
                          </span>
                          <button 
                            className="remove-item-btn"
                            onClick={() => removeFromCart(item.id)}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="cart-summary-section">
                <div className="order-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>Rs {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? 'free-shipping' : ''}>
                      {shippingCost === 0 ? 'FREE' : `Rs ${shippingCost.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span>Rs {total.toLocaleString()}</span>
                  </div>
                  
                  <div className="cart-actions">
                    <button className="clear-cart-btn" onClick={clearCart}>
                      Clear Cart
                    </button>
                    <button className="checkout-btn" onClick={() => setShowCheckout(true)}>
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Checkout View
            <div className="checkout-container">
              {/* Left Column - Order Summary */}
              <div className="checkout-left">
                <div className="order-summary-checkout">
                  <div className="summary-header">
                    <h3>Order Summary</h3>
                    <button className="edit-cart-btn" onClick={() => setShowCheckout(false)}>
                      Edit Cart
                    </button>
                  </div>
                  
                  <div className="checkout-items-list">
                    {cartItems.map(item => {
                      const itemPrice = typeof item.price === 'string' 
                        ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
                        : Number(item.price) || 0;
                      
                      return (
                        <div key={item.id} className="checkout-item">
                          <div className="checkout-item-image">
                            <img src={item.img || item.image} alt={item.name} />
                          </div>
                          <div className="checkout-item-details">
                            <h4>{item.name}</h4>
                            <div className="checkout-item-info">
                              <span className="item-quantity">Quantity: {item.quantity}</span>
                              <span className="item-price">Rs {(itemPrice * item.quantity).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Discount Code */}
                  <div className="discount-section">
                    <h4>Discount code or gift card</h4>
                    <div className="discount-input-group">
                      <input
                        type="text"
                        placeholder="Discount code or gift card"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                      />
                      <button 
                        className="apply-discount-btn"
                        onClick={handleApplyDiscount}
                      >
                        Submit
                      </button>
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div className="cost-summary">
                    <h4>Cost summary</h4>
                    <div className="cost-summary-table">
                      <div className="cost-row">
                        <span className="cost-label">Item Value</span>
                        <span className="cost-value">Rs {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="cost-row">
                        <span className="cost-label">Subtotal</span>
                        <span className="cost-value">Rs {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="cost-row">
                        <span className="cost-label">Shipping</span>
                        <span className="cost-value">Rs {shippingCost.toLocaleString()}</span>
                      </div>
                      <div className="cost-row total-cost-row">
                        <span className="cost-label">Total</span>
                        <span className="cost-value">PKR Rs {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Checkout Form */}
              <div className="checkout-right">
                {/* Contact Information */}
                <div className="checkout-section">
                  <h3>Contact Information</h3>
                  <div className="contact-form">
                    <div className="form-group">
                      <label htmlFor="email">Email or mobile phone number *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleUserDetailsChange}
                        placeholder="Enter email or phone number"
                        required
                      />
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="newsletter"
                        name="newsletter"
                      />
                      <label htmlFor="newsletter">Email me with news and offers</label>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="checkout-section">
                  <h3>Delivery</h3>
                  <div className="address-form">
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <select
                        id="country"
                        name="country"
                        value={userDetails.country}
                        onChange={handleUserDetailsChange}
                      >
                        <option value="PK">Pakistan</option>
                        <option value="IN">India</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AE">UAE</option>
                      </select>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First name *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={userDetails.firstName}
                          onChange={handleUserDetailsChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last name *</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={userDetails.lastName}
                          onChange={handleUserDetailsChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">Address *</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={userDetails.address}
                        onChange={handleUserDetailsChange}
                        placeholder="Street address"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <select
                          id="city"
                          name="city"
                          value={userDetails.city}
                          onChange={handleUserDetailsChange}
                          required
                        >
                          <option value="">Select city from dropdown</option>
                          {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="postalCode">Postal code (optional)</label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={userDetails.postalCode}
                          onChange={handleUserDetailsChange}
                          placeholder="Postal code"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={userDetails.phone}
                        onChange={handleUserDetailsChange}
                        placeholder="Phone number"
                        required
                      />
                    </div>

                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="saveInfo"
                        name="saveInfo"
                        checked={userDetails.saveInfo}
                        onChange={handleUserDetailsChange}
                      />
                      <label htmlFor="saveInfo">Save this information for next time</label>
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="checkout-section">
                  <h3>Shipping method</h3>
                  <div className="shipping-methods">
                    {shippingMethods.map(method => (
                      <div 
                        key={method.id}
                        className={`shipping-method ${shippingMethod === method.id ? 'selected' : ''}`}
                        onClick={() => setShippingMethod(method.id)}
                      >
                        <div className="shipping-method-info">
                          <div className="shipping-name">{method.name}</div>
                          <div className="shipping-time">{method.time}</div>
                        </div>
                        <div className="shipping-price">Rs {method.price.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="checkout-section">
                  <h3>Payment</h3>
                  <p className="payment-security-note">All transactions are secure and encrypted.</p>
                  
                  <div className="payment-methods">
                    {paymentMethods.map(method => (
                      <div 
                        key={method.id}
                        className={`payment-method ${paymentMethod === method.id ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className="payment-method-header">
                          <span className="payment-icon">{method.icon}</span>
                          <div className="payment-method-info">
                            <div className="payment-name">{method.name}</div>
                            <div className="payment-description">{method.description}</div>
                          </div>
                        </div>
                        {paymentMethod === method.id && renderPaymentMethodDetails()}
                      </div>
                    ))}
                  </div>

                  {/* Billing Address */}
                  <div className="billing-address">
                    <h4>Billing address</h4>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="billingSame"
                        checked={billingSameAsShipping}
                        onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                      />
                      <label htmlFor="billingSame">Same as shipping address</label>
                    </div>
                    {!billingSameAsShipping && (
                      <div className="different-billing-address">
                        <p>Use a different billing address</p>
                        {/* Add billing address form here */}
                      </div>
                    )}
                  </div>
                </div>

                {/* Place Order Button */}
                <div className="place-order-section">
                  <button className="place-order-btn" onClick={handlePlaceOrder}>
                    {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'} - Rs {total.toLocaleString()}
                  </button>
                  <p className="terms-note">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;