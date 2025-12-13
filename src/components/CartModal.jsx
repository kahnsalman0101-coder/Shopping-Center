import React from 'react';
import { useCart } from '../context/CartContext'; // Import the context
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
  } = useCart(); // Use the context

  if (!isOpen) return null;

  // Calculate subtotal and shipping (or use cartStats from context)
  const subtotal = cartStats.totalPrice || 0;
  const shipping = cartStats.shippingCost || (subtotal > 5000 ? 0 : 500);
  const total = subtotal + shipping;

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title">
            <h2>Shopping Cart</h2>
            <span className="cart-count">{cartStats.totalItems || 0} items</span>
          </div>
          <button className="close-cart-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some items to get started</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="cart-items-list">
                {cartItems.map(item => {
                  // Calculate item price safely
                  const itemPrice = typeof item.price === 'string' 
                    ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
                    : Number(item.price) || 0;
                  
                  return (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        <img src={item.img || item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h4 className="item-name">{item.name}</h4>
                        <p className="item-category">{item.category || 'Fashion'}</p>
                        <p className="item-price">Rs. {itemPrice.toLocaleString()}</p>
                      </div>
                      <div className="item-quantity-controls">
                        <button 
                          className="quantity-btn minus"
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          -
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
                          Rs. {(itemPrice * item.quantity).toLocaleString()}
                        </span>
                        <button 
                          className="remove-item-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Summary */}
              <div className="cart-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'free-shipping' : ''}>
                    {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
                
                {/* Cart Actions */}
                <div className="cart-actions">
                  <button className="clear-cart-btn" onClick={clearCart}>
                    Clear Cart
                  </button>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>

                {/* Shipping Info */}
                <div className="shipping-info">
                  <p>🚚 Free shipping on orders over Rs. 5,000</p>
                  <p>🔄 7-day return policy</p>
                  <p>🔒 Secure checkout</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;