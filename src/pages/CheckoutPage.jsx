import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../style/CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, cartStats, clearCart } = useCart();
  const navigate = useNavigate();
  
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
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Calculate totals
  const subtotal = cartStats.totalPrice || 0;
  const selectedShipping = shippingMethods.find(m => m.id === shippingMethod) || shippingMethods[0];
  const shippingCost = selectedShipping.price;
  const discount = discountCode ? 0 : 0; // Add your discount logic here
  const total = subtotal + shippingCost - discount;

  const handleUserDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      // Add your discount validation logic here
      alert(`Discount code "${discountCode}" applied!`);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Validate required fields
    const requiredFields = ['email', 'phone', 'firstName', 'lastName', 'address', 'city'];
    const missingFields = requiredFields.filter(field => !userDetails[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsProcessing(false);
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      setIsProcessing(false);
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        ...userDetails,
        shippingMethod: selectedShipping,
        paymentMethod: paymentMethods.find(m => m.id === paymentMethod),
        cartItems,
        subtotal,
        shippingCost,
        discount,
        total,
        discountCode,
        orderDate: new Date().toISOString(),
        orderId: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`
      };

      // Here you would typically send to your backend
      console.log('Order Data:', orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success - show confirmation
      alert(`✅ Order Confirmed!\n\nOrder ID: ${orderData.orderId}\nTotal: Rs ${total.toLocaleString()}\n\nThank you for your purchase!`);
      
      // Clear cart and redirect
      clearCart();
      navigate('/order-confirmation', { state: { order: orderData } });
      
    } catch (error) {
      console.error('Order failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
              <span className="payment-icon-badge visa">visa</span>
              <span className="payment-icon-badge master">mastercard</span>
              <span className="payment-icon-badge union">unionpay</span>
            </div>
          </div>
        );
      case 'safepay':
        return (
          <div className="payment-method-details">
            <div className="payment-icons">
              <span className="payment-icon-badge visa">visa</span>
              <span className="payment-icon-badge master">mastercard</span>
            </div>
            <p>Secure checkout with Safepay</p>
          </div>
        );
      case 'card':
        return (
          <div className="payment-method-details">
            <div className="payment-icons">
              <span className="payment-icon-badge visa">visa</span>
              <span className="payment-icon-badge master">mastercard</span>
            </div>
            <p>After clicking "Pay now", you will be redirected to complete your purchase securely.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-checkout">
        <div className="empty-checkout-content">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some items to proceed to checkout</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <div className="container">
          <div className="header-content">
            <button 
              className="back-to-shop"
              onClick={() => navigate(-1)}
            >
              ← Back to Shop
            </button>
            <div className="header-logo">
              <h1>Checkout</h1>
              <span className="cart-count-badge">{cartItems.length} items</span>
            </div>
            <div className="secure-checkout">
              <span className="secure-badge">🔒 Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <main className="checkout-main container">
        {/* Left Column - Order Summary */}
        <div className="order-summary-column">
          <div className="order-summary-card">
            <div className="summary-header">
              <h2>Your Order</h2>
              <button 
                className="edit-cart-link"
                onClick={() => navigate('/cart')}
              >
                Edit Cart
              </button>
            </div>

            {/* Cart Items */}
            <div className="cart-items-section">
              {cartItems.map((item, index) => {
                const itemPrice = typeof item.price === 'string' 
                  ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
                  : Number(item.price) || 0;
                
                return (
                  <div key={item.id} className="checkout-item">
                    <div className="item-number">{index + 1}</div>
                    <div className="item-image">
                      <img src={item.img || item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4 className="item-title">{item.name}</h4>
                      <div className="item-meta">
                        <span className="item-quantity">Quantity: {item.quantity}</span>
                        <span className="item-size">Size: {item.size || 'M'}</span>
                      </div>
                    </div>
                    <div className="item-price">
                      Rs {(itemPrice * item.quantity).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Discount Code */}
            <div className="discount-section">
              <h3>Discount code or gift card</h3>
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
              <h3>Cost summary</h3>
              <table className="cost-summary-table">
                <tbody>
                  <tr>
                    <td>Item Value</td>
                    <td>Rs {subtotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Subtotal</td>
                    <td>Rs {subtotal.toLocaleString()}</td>
                  </tr>
                  <tr className="shipping-row">
                    <td>Shipping</td>
                    <td className={shippingCost === 0 ? 'free' : ''}>
                      {shippingCost === 0 ? 'FREE' : `Rs ${shippingCost.toLocaleString()}`}
                    </td>
                  </tr>
                  {discount > 0 && (
                    <tr className="discount-row">
                      <td>Discount</td>
                      <td className="discount-amount">-Rs {discount.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr className="total-row">
                    <td>Total</td>
                    <td className="total-amount">PKR Rs {total.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Need Help Section */}
            <div className="help-section">
              <h4>Need help?</h4>
              <div className="help-options">
                <div className="help-option">
                  <span className="help-icon">📞</span>
                  <div>
                    <div className="help-title">Call us</div>
                    <div className="help-desc">+92 300 1234567</div>
                  </div>
                </div>
                <div className="help-option">
                  <span className="help-icon">💬</span>
                  <div>
                    <div className="help-title">Live Chat</div>
                    <div className="help-desc">24/7 Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Checkout Form */}
        <div className="checkout-form-column">
          {/* Contact Information */}
          <div className="checkout-form-section">
            <h2>Contact Information</h2>
            <div className="form-group">
              <label htmlFor="email">Email or mobile phone number *</label>
              <input
                type="text"
                id="email"
                name="email"
                value={userDetails.email}
                onChange={handleUserDetailsChange}
                placeholder="example@email.com or +92 300 1234567"
                required
              />
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                defaultChecked
              />
              <label htmlFor="newsletter">Email me with news and offers</label>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="checkout-form-section">
            <h2>Delivery</h2>
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
                placeholder="House no., Street, Area"
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
                  placeholder="e.g., 54000"
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
                placeholder="+92 300 1234567"
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

          {/* Shipping Method */}
          <div className="checkout-form-section">
            <h2>Shipping method</h2>
            <div className="shipping-methods">
              {shippingMethods.map(method => (
                <div 
                  key={method.id}
                  className={`shipping-method-card ${shippingMethod === method.id ? 'selected' : ''}`}
                  onClick={() => setShippingMethod(method.id)}
                >
                  <div className="shipping-method-info">
                    <div className="shipping-name">{method.name}</div>
                    <div className="shipping-time">{method.time}</div>
                  </div>
                  <div className="shipping-price">
                    Rs {method.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-form-section">
            <h2>Payment</h2>
            <div className="security-note">
              <span className="lock-icon">🔒</span>
              All transactions are secure and encrypted.
            </div>

            <div className="payment-methods-list">
              {paymentMethods.map(method => (
                <div 
                  key={method.id}
                  className={`payment-method-card ${paymentMethod === method.id ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="payment-method-header">
                    <span className="method-icon">{method.icon}</span>
                    <div className="method-info">
                      <div className="method-name">{method.name}</div>
                      <div className="method-description">{method.description}</div>
                    </div>
                  </div>
                  {paymentMethod === method.id && (
                    <div className="payment-details">
                      {renderPaymentMethodDetails()}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Billing Address */}
            <div className="billing-section">
              <h3>Billing address</h3>
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
                <div className="different-billing">
                  <p>Use a different billing address</p>
                  {/* Add billing address fields here */}
                </div>
              )}
            </div>
          </div>

          {/* Place Order Button */}
          <div className="place-order-section">
            <div className="order-total-summary">
              <div className="total-line">
                <span>Subtotal</span>
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="total-line">
                <span>Shipping</span>
                <span>Rs {shippingCost.toLocaleString()}</span>
              </div>
              <div className="total-line grand-total">
                <span>Total</span>
                <span>PKR Rs {total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'} - Rs {total.toLocaleString()}
            </button>

            <div className="trust-badges">
              <div className="trust-badge">
                <span>🔒</span> Secure Payment
              </div>
              <div className="trust-badge">
                <span>🔄</span> 7-Day Returns
              </div>
              <div className="trust-badge">
                <span>🚚</span> Free Shipping*
              </div>
            </div>

            <p className="terms-note">
              By placing your order, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="checkout-footer">
        <div className="container">
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/refund">Refund Policy</a>
            <a href="/shipping">Shipping Policy</a>
            <a href="/contact">Contact Us</a>
          </div>
          <p className="copyright">© {new Date().getFullYear()} Your Store Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutPage;