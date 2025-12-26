import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext'; // Change to useCurrency
import SignUpModal from './SignUpModal';
import CartModal from './CartModal';
import '../style/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [activeBottomMenu, setActiveBottomMenu] = useState(null);
  
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const countryRef = useRef(null);

  // Use Currency Context (not Country Context)
  const { 
    selectedCountry, 
    setSelectedCountry, 
    exchangeRates,
    countries: currencyCountries 
  } = useCurrency(); // Change to useCurrency

  const { cartItems, cartStats, updateQuantity, removeFromCart, clearCart } = useCart();

  const navItems = [
    { text: 'NEW IN', link: '/products?category=new' },
    { text: 'UNSTITCHED', link: '/products?category=unstitched' },
    { text: 'READY TO WEAR', link: '/products?category=ready-to-wear' },
    { text: 'WESTERN WEAR', link: '/products?category=western' },
    { text: 'MENSWEAR', link: '/products?category=men' },
  ];

  const mobileBottomMenuItems = [
    { text: 'STORE', icon: '🏬', color: '#000000', link: '/store' },
    { text: 'HOME', icon: '🏠', color: '#8B4513', link: '/' },
    { text: 'ACCOUNT', icon: '👤', color: '#B8860B', link: '/account' },
    { text: 'SEARCH', icon: '🔍', color: '#666666', link: '#search' },
  ];

  const storeSubmenuItems = [
    { text: 'All Products', link: '/products', icon: '🛍️' },
    { text: 'New Arrivals', link: '/products?filter=new', icon: '✨' },
    { text: 'Best Sellers', link: '/products?filter=popular', icon: '🔥' },
    { text: 'Sale', link: '/sale', icon: '💲' },
    { text: 'Collections', link: '/collections', icon: '📦' },
  ];

  // Use countries from currency context or create default
  const countries = currencyCountries || [
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
        setIsCountryOpen(false);
        setActiveBottomMenu(null);
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
      
      // Close country dropdown if clicked outside
      if (countryRef.current && !countryRef.current.contains(event.target) && isCountryOpen) {
        setIsCountryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchExpanded, isCountryOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsCountryOpen(false);
    setActiveBottomMenu(null);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsCountryOpen(false);
    setActiveBottomMenu(null);
    document.body.style.overflow = 'auto';
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    setActiveBottomMenu(searchExpanded ? null : 'SEARCH');
  };

  const toggleCountryDropdown = () => {
    setIsCountryOpen(!isCountryOpen);
  };

  // Search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setSearchExpanded(false);
      closeMenu();
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
    window.location.href = '/checkout';
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

  // Get current country name with flag
  const getCurrentCountryName = () => {
    const country = countries.find(c => c.code === selectedCountry);
    return country ? `${country.flag} ${country.code}` : '🇵🇰 PK';
  };

  // Get current country flag only
  const getCurrentCountryFlag = () => {
    const country = countries.find(c => c.code === selectedCountry);
    return country ? country.flag : '🇵🇰';
  };

  // Get country name from code
  const getCountryName = (code) => {
    const country = countries.find(c => c.code === code);
    return country ? country.name : code;
  };

  // Get currency symbol from code
  const getCurrencySymbol = (code) => {
    const country = countries.find(c => c.code === code);
    return country ? country.symbol || '₨' : '₨';
  };

  // User dropdown functionality
  const handleUserAction = () => {
    if (isLoggedIn) {
      alert('Going to your profile...');
      window.location.href = '/profile';
    } else {
      handleLogin();
    }
  };

  // Handle mobile bottom menu click
  const handleMobileBottomMenuClick = (item) => {
    setActiveBottomMenu(item.text === activeBottomMenu ? null : item.text);
    
    if (item.text === 'SEARCH') {
      toggleSearch();
      return;
    }
    
    if (item.text === 'ACCOUNT') {
      handleUserAction();
      return;
    }
    
    if (item.text === 'STORE') {
      return;
    }
    
    window.location.href = item.link;
  };

  // Handle store menu item click
  const handleStoreMenuItem = (item) => {
    window.location.href = item.link;
    setActiveBottomMenu(null);
  };

  // Handle country change
  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
    setIsCountryOpen(false);
    // Show a notification about currency change
    if (window.toast) {
      const countryName = getCountryName(countryCode);
      const currencySymbol = getCurrencySymbol(countryCode);
      window.toast.info(`Currency changed to ${currencySymbol} for ${countryName}`);
    }
  };

  return (
    <>
      {/* Main Navbar - Hidden when mobile menu is open */}
      <nav className={`navbar ${isMenuOpen ? 'hidden' : ''}`}>
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
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = item.link;
                  }}
                >
                  {item.text}
                </a>
              ))}
            </div>
          </div>

          {/* Icons and Actions - Right Section */}
          <div className="navbar-right">
            {/* Shipping Dropdown - Only show on desktop */}
            {windowWidth > 768 && (
              <div className="shipping-dropdown">
                <button className="shipping-btn">
                  <span className="country-flag">{getCurrentCountryFlag()}</span>
                  <span className="country-text">Ship to: {getCurrentCountryName()}</span>
                  <span className="dropdown-icon">▼</span>
                </button>
                <div className="shipping-dropdown-content">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      className={`country-option ${selectedCountry === country.code ? 'active' : ''}`}
                      onClick={() => handleCountryChange(country.code)}
                    >
                      <span className="country-flag">{country.flag}</span>
                      <span>{country.name} ({country.code})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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

            {/* Mobile Menu Toggle (3 Lines) */}
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

      {/* Mobile Bottom Menu - Always visible on small screens */}
      {windowWidth <= 1024 && !isMenuOpen && (
        <>
          {/* Mobile Bottom Menu */}
          <div className="mobile-bottom-menu-main">
            {mobileBottomMenuItems.map((item, index) => (
              <button
                key={index}
                className={`mobile-bottom-menu-main-item ${
                  activeBottomMenu === item.text ? 'active' : ''
                }`}
                onClick={() => handleMobileBottomMenuClick(item)}
                style={{ '--item-color': item.color }}
              >
                <span className="menu-main-item-icon" style={{ color: item.color }}>
                  {item.icon}
                </span>
                <span className="menu-main-item-text">{item.text}</span>
              </button>
            ))}
          </div>

          {/* Store Submenu Dropdown */}
          {activeBottomMenu === 'STORE' && (
            <div className="store-submenu-dropdown">
              <div className="store-submenu-header">
                <span>STORE MENU</span>
                <button 
                  className="close-submenu-btn"
                  onClick={() => setActiveBottomMenu(null)}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
              <div className="store-submenu-items">
                <a 
                  href="/" 
                  className="store-submenu-item home-item"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/';
                    setActiveBottomMenu(null);
                  }}
                >
                  <span className="submenu-icon">🏠</span>
                  <span>Home</span>
                </a>
                {storeSubmenuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    className="store-submenu-item"
                    onClick={(e) => {
                      e.preventDefault();
                      handleStoreMenuItem(item);
                    }}
                  >
                    <span className="submenu-icon">{item.icon}</span>
                    <span>{item.text}</span>
                    <i className="bi bi-chevron-right"></i>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Search Bar Dropdown */}
          {activeBottomMenu === 'SEARCH' && (
            <div className="search-bottom-dropdown">
              <div className="search-bottom-header">
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="Search products, brands, categories..."
                    className="search-bottom-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoFocus
                  />
                  <button 
                    className="search-bottom-submit"
                    onClick={handleSearch}
                    disabled={!searchQuery.trim()}
                  >
                    <i className="bi bi-search"></i>
                  </button>
                </div>
                <button 
                  className="close-search-btn"
                  onClick={() => setActiveBottomMenu(null)}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
              <div className="search-suggestions-bottom">
                <div className="suggestions-title">Popular Searches</div>
                <div className="suggestion-buttons">
                  <button className="suggestion-btn" onClick={() => setSearchQuery('Sarees')}>Sarees</button>
                  <button className="suggestion-btn" onClick={() => setSearchQuery('Dresses')}>Dresses</button>
                  <button className="suggestion-btn" onClick={() => setSearchQuery('Men Suits')}>Men Suits</button>
                  <button className="suggestion-btn" onClick={() => setSearchQuery('Kurta')}>Kurta</button>
                  <button className="suggestion-btn" onClick={() => setSearchQuery('Lehenga')}>Lehenga</button>
                  <button className="suggestion-btn" onClick={() => setSearchQuery('Shirts')}>Shirts</button>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Button - Bottom Left Corner */}
          <div className="mobile-shipping-main" ref={countryRef}>
            <button 
              className="mobile-shipping-main-btn"
              onClick={toggleCountryDropdown}
            >
              <span className="shipping-main-flag">{getCurrentCountryFlag()}</span>
              <span className="shipping-main-label">Ship to</span>
            </button>
            
            {/* Country Dropdown */}
            <div className={`mobile-country-main-dropdown ${isCountryOpen ? 'active' : ''}`}>
              <div className="country-main-dropdown-header">
                <span>Select Country</span>
              </div>
              <div className="country-main-dropdown-list">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    className={`country-main-dropdown-item ${selectedCountry === country.code ? 'selected' : ''}`}
                    onClick={() => handleCountryChange(country.code)}
                  >
                    <span className="country-main-flag">{country.flag}</span>
                    <span className="country-main-name">{country.name}</span>
                    <span className="country-main-code">{country.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Button - Bottom Right Corner */}
          <button 
            className="mobile-cart-main-btn"
            onClick={handleCart}
          >
            <i className="bi bi-bag"></i>
            {cartCount > 0 && (
              <span className="mobile-cart-main-badge">{cartCount}</span>
            )}
          </button>
        </>
      )}

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

          {/* Mobile Navigation Items */}
          <div className="mobile-nav-items">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="mobile-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = item.link;
                  closeMenu();
                }}
              >
                <span>{item.text}</span>
                <i className="bi bi-chevron-right"></i>
              </a>
            ))}
          </div>

          {/* Country Selection in Mobile Menu */}
          <div className="mobile-country-section">
            <div className="mobile-country-title">Shipping Country</div>
            <div className="mobile-country-options">
              {countries.map((country) => (
                <button
                  key={country.code}
                  className={`mobile-country-option ${selectedCountry === country.code ? 'active' : ''}`}
                  onClick={() => handleCountryChange(country.code)}
                >
                  <span className="mobile-country-flag">{country.flag}</span>
                  <span className="mobile-country-name">{country.name}</span>
                  <span className="mobile-country-code">{country.code}</span>
                  {selectedCountry === country.code && (
                    <i className="bi bi-check"></i>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search Section in Mobile Menu */}
          <div className="mobile-search-section">
            <div className="mobile-search-wrapper">
              <input
                type="text"
                placeholder="Search for products..."
                className="mobile-search-expanded-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                className="mobile-search-expanded-btn"
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
            <div className="search-suggestions">
              <span className="suggestion-label">Try:</span>
              <button className="suggestion-chip" onClick={() => setSearchQuery('Sarees')}>Sarees</button>
              <button className="suggestion-chip" onClick={() => setSearchQuery('Dresses')}>Dresses</button>
              <button className="suggestion-chip" onClick={() => setSearchQuery('Suits')}>Suits</button>
            </div>
          </div>

          {/* Account Section in Mobile Menu */}
          <div className="mobile-account-section">
            <button 
              className="mobile-account-btn"
              onClick={() => { handleUserAction(); closeMenu(); }}
            >
              <div className="account-btn-content">
                <i className="bi bi-person-circle"></i>
                <div className="account-btn-info">
                  <span className="account-btn-title">
                    {isLoggedIn ? 'My Account' : 'Login / Sign Up'}
                  </span>
                  <span className="account-btn-subtitle">
                    {isLoggedIn ? 'View profile & orders' : 'Access your account'}
                  </span>
                </div>
              </div>
              <i className="bi bi-chevron-right"></i>
            </button>
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
        selectedCountry={selectedCountry}
      />
    </>
  );
};

export default Navbar;