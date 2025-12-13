import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext'; // Import CartContext
import '../style/Navbar.css';
import SignUpModal from './SignUpModal';
import CartModal from './CartModal'; // Import CartModal

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const mobileMenuRef = useRef(null);

  // Use CartContext instead of local state
  const { 
    cartItems, 
    cartStats, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const navItems = [
    { text: 'NEW IN', link: 'Product' },
    { text: 'UNSTITCHED', link: '#' },
    { text: 'READY TO WEAR', link: '#' },
    { text: 'WESTERN WEAR', link: '#' },
    { text: 'MENSWEAR', link: '#' },
    { text: 'KIDS & TEENS', link: '#' },
    { text: 'JEWELRY', link: '#' },
    { text: 'FRAGRANCES', link: '#' },
    { text: 'COLLECTIONS', link: '#' },
    { text: 'SPECIAL OFFERS', link: '#' },
    { text: 'WHOLESALE', link: '#' },
    { text: 'SHOPY', link: '#' },
  ];

  // Calculate cart stats from CartContext
  const cartCount = cartStats.totalItems || 0;
  const cartTotal = cartStats.totalPrice || 0;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    } else {
      alert('Please enter search terms');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Login functionality
  const handleLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      alert('Logged out successfully');
    } else {
      alert('Redirecting to login page...');
      window.location.href = '/login';
    }
  };

  // Cart functionality - Open modal
  const handleCart = () => {
    setShowCartModal(true);
  };

  // Cart modal functions
  const handleCloseCartModal = () => {
    setShowCartModal(false);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert(`Proceeding to checkout with total: Rs. ${cartTotal.toLocaleString()}`);
    // In real app: redirect to checkout page
    setShowCartModal(false);
    // Optionally navigate to checkout page
    // navigate('/checkout');
  };

  // Sign Up functionality
  const handleSignUp = () => {
    setShowSignUpModal(true);
  };

  // Sign Up success callback
  const handleSignUpSuccess = (userData) => {
    setIsLoggedIn(true);
    alert(`Welcome ${userData.name}! Your account has been created.`);
  };

  // Close sign up modal
  const closeSignUpModal = () => {
    setShowSignUpModal(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo - First Line */}
          <div className="navbar-logo">
            <h1>ASIM JOFA</h1>
            <span className="logo-subtitle">LUXURY FASHION</span>
          </div>

          {/* Shipping Info - Second Line */}
          <div className="navbar-middle">
            <div className="shipping-info">
              <span className="ship-label">Ship To:</span>
              <div className="country-selector">
                <select className="country-select" defaultValue="PK">
                  <option value="PK">🇵🇰 PK</option>
                  <option value="US">🇺🇸 US</option>
                  <option value="UK">🇬🇧 UK</option>
                  <option value="AE">🇦🇪 AE</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons and Menu Toggle - Third Line */}
          <div className="navbar-right">
            {/* Search Input/Button */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="search-btn" onClick={handleSearch}>
                🔍
              </button>
            </div>

            {/* Login/Sign Up Buttons */}
            {isLoggedIn ? (
              <button className="action-btn login-btn" onClick={handleLogin}>
                Logout
              </button>
            ) : (
              <>
                <button className="action-btn login-btn" onClick={handleLogin}>
                  Login
                </button>
                <button className="action-btn login-btn" onClick={handleSignUp}>
                  Sign Up
                </button>
              </>
            )}

            {/* Cart Button */}
            <button className="action-btn cart-btn" onClick={handleCart}>
              Cart <span className="cart-count">{cartCount}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className="hamburger"></span>
              <span className="hamburger"></span>
              <span className="hamburger"></span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation - Below the 3 lines */}
        <div className="navbar-navigation">
          <div className="nav-links-container">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="nav-link"
              >
                {item.text}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        ref={mobileMenuRef}
        className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}
      >
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <div className="mobile-logo">
              <div>ASIM JOFA</div>
              <div className="mobile-logo-subtitle">LUXURY FASHION</div>
            </div>
            <button className="mobile-close-btn" onClick={closeMenu}>✕</button>
          </div>

          {/* Mobile Search */}
          <div className="mobile-search-container">
            <input
              type="text"
              placeholder="Search products..."
              className="mobile-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="mobile-search-btn" onClick={handleSearch}>🔍</button>
          </div>

          <div className="mobile-shipping-info">
            <span className="mobile-ship-label">Shipping to:</span>
            <select className="mobile-country-select" defaultValue="PK">
              <option value="PK">Pakistan (PK)</option>
              <option value="US">United States (US)</option>
              <option value="UK">United Kingdom (UK)</option>
            </select>
          </div>

          <div className="mobile-nav-items">
            {navItems.map((item, index) => (
              <div key={index} className="mobile-nav-item">
                <a
                  href={item.link}
                  className="mobile-nav-link"
                  onClick={closeMenu}
                >
                  {item.text}
                </a>
              </div>
            ))}
          </div>

          <div className="mobile-menu-footer">
            <div className="mobile-user-info">
              {isLoggedIn ? (
                <button className="mobile-action-btn login-mobile-btn" onClick={() => { handleLogin(); closeMenu(); }}>
                  Logout
                </button>
              ) : (
                <>
                  <button className="mobile-action-btn login-mobile-btn" onClick={() => { handleLogin(); closeMenu(); }}>
                    Login
                  </button>
                  <button className="mobile-action-btn login-mobile-btn" onClick={() => { handleSignUp(); closeMenu(); }}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
            <div className="mobile-contact">
              <p>Need help? <a href="tel:+923001234567">+92 300 1234567</a></p>
              <p className="email">contact@asimjofa.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={closeSignUpModal}
        onSignUpSuccess={handleSignUpSuccess}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={showCartModal}
        onClose={handleCloseCartModal}
        cartItems={cartItems}
        cartTotal={cartTotal}
        cartCount={cartCount}
        updateQuantity={updateQuantity}
        removeItem={removeFromCart}
        clearCart={clearCart}
        handleCheckout={handleCheckout}
      />
    </>
  );
};

export default Navbar;