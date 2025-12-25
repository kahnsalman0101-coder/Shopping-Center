import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import '../style/Navbar.css';
import SignUpModal from './SignUpModal';
import CartModal from './CartModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('PK');
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);

  const { cartItems, cartStats, updateQuantity, removeFromCart, clearCart } = useCart();

  const navItems = [
    { text: 'NEW IN', link: 'Product' },
    { text: 'UNSTITCHED', link: '#' },
    { text: 'READY TO WEAR', link: '#' },
    { text: 'WESTERN WEAR', link: '#' },
    { text: 'MENSWEAR', link: '#' },
   
  ];

  const countries = [
    { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  ];

  const cartCount = cartStats.totalItems || 0;
  const cartTotal = cartStats.totalPrice || 0;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
      if (window.innerWidth <= 768) {
        setSearchExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      
      // Close search if clicked outside
      if (searchRef.current && !searchRef.current.contains(event.target) && searchExpanded) {
        setSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchExpanded]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
  };

  // Search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setSearchExpanded(false);
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
      setShowSignUpModal(true);
    }
  };

  // Cart functionality
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
    setShowCartModal(false);
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

  // Get current country name
  const getCurrentCountryName = () => {
    const country = countries.find(c => c.code === selectedCountry);
    return country ? `${country.flag} ${country.code}` : '🇵🇰 PK';
  };

  // User dropdown functionality
  const handleUserAction = () => {
    if (isLoggedIn) {
      // Show user dropdown or go to profile
      alert('Going to your profile...');
      window.location.href = '/profile';
    } else {
      handleLogin();
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo - Left Section */}
          <div className="navbar-left">
            <div className="navbar-logo">
              <h1>ASIM JOFA</h1>
              <span className="logo-subtitle">LUXURY FASHION</span>
            </div>
          </div>

          {/* Navigation Links - Center Section */}
          <div className="navbar-center">
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

          {/* Icons and Actions - Right Section */}
          <div className="navbar-right">
            {/* Shipping Dropdown */}
            <div className="shipping-dropdown">
              <button className="shipping-btn">
                <span className="country-flag">{selectedCountry === 'PK' ? '🇵🇰' : selectedCountry === 'US' ? '🇺🇸' : selectedCountry === 'UK' ? '🇬🇧' : '🇦🇪'}</span>
                <span className="country-text">Ship to: {getCurrentCountryName()}</span>
                <span className="dropdown-icon">▼</span>
              </button>
              <div className="shipping-dropdown-content">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    className={`country-option ${selectedCountry === country.code ? 'active' : ''}`}
                    onClick={() => setSelectedCountry(country.code)}
                  >
                    <span className="country-flag">{country.flag}</span>
                    <span>{country.name} ({country.code})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Icon with Expandable Input */}
            <div className="search-container" ref={searchRef}>
              <button className="search-icon-btn" onClick={toggleSearch}>
                <i className="bi bi-search"></i>
              </button>
              <div className={`search-expanded ${searchExpanded ? 'active' : ''}`}>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="search-expanded-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus={searchExpanded}
                />
              </div>
            </div>

            {/* User/Login Icon */}
            <button 
              className={`icon-btn user-btn ${isLoggedIn ? 'logged-in' : ''}`} 
              onClick={handleUserAction}
              title={isLoggedIn ? "My Account" : "Login"}
            >
              <i className="bi bi-person-fill"></i>
            </button>

            {/* Cart Icon */}
            <button className="cart-btn" onClick={handleCart} title="Shopping Cart">
              <i className="bi bi-bag"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
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
            <button className="mobile-close-btn" onClick={closeMenu}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Mobile Search */}
          <div className="mobile-search-container">
            <div className="mobile-search-wrapper">
              <input
                type="text"
                placeholder="Search products..."
                className="mobile-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="mobile-search-btn" onClick={handleSearch}>
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>

          {/* Mobile Shipping */}
          <div className="mobile-shipping-section">
            <div className="mobile-shipping-title">Ship to:</div>
            <div className="mobile-country-options">
              {countries.map((country) => (
                <button
                  key={country.code}
                  className={`mobile-country-option ${selectedCountry === country.code ? 'active' : ''}`}
                  onClick={() => setSelectedCountry(country.code)}
                >
                  <span className="country-flag">{country.flag}</span>
                  <span>{country.name} ({country.code})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
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

          {/* Mobile Action Buttons */}
          <div className="mobile-menu-footer">
            <div className="mobile-action-buttons">
              <button 
                className="login-mobile-btn" 
                onClick={() => { handleUserAction(); closeMenu(); }}
              >
                <i className="bi bi-person-fill"></i> {isLoggedIn ? "My Account" : "Login / Sign Up"}
              </button>
              <button 
                className="mobile-cart-btn" 
                onClick={() => { handleCart(); closeMenu(); }}
              >
                <i className="bi bi-bag"></i> Cart
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>
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