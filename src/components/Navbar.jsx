import React, { useState, useEffect, useRef } from "react";
import { 
  FaShoppingCart, 
  FaTimes, 
  FaTag, 
  FaTshirt, 
  FaShoePrints,
  FaHeart,
  FaBox,
  FaCog,
  FaSignOutAlt,
  FaGem,
  FaCrown,
  FaSun,
  FaMoon,
  FaBell,
  FaGift,
  FaShippingFast
} from "react-icons/fa";
import { FiUser, FiShoppingBag, FiSearch } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { BsGrid3X3Gap } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import AuthModal from "./AuthModal";
import "../style/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { cartItems, cartStats } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  
  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fashionhub_user');
    return saved ? JSON.parse(saved) : null;
  });

  const searchRef = useRef(null);
  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);

  // Premium fashion categories
  const fashionCategories = [
    { name: "New Arrivals", icon: "🆕", color: "#FF6B8B", path: "/new" },
    { name: "Designer Collection", icon: "👑", color: "#FFD166", path: "/designer" },
    { name: "Summer Essentials", icon: "☀️", color: "#06D6A0", path: "/summer" },
    { name: "Luxury Wear", icon: "💎", color: "#A663CC", path: "/luxury" },
    { name: "Street Style", icon: "🛹", color: "#118AB2", path: "/street" },
    { name: "Evening Gowns", icon: "✨", color: "#EF476F", path: "/gowns" },
    { name: "Casual Wear", icon: "👕", color: "#7BD3EA", path: "/casual" },
    { name: "Accessories", icon: "💍", color: "#A0E7E5", path: "/accessories" },
    { name: "Footwear", icon: "👟", color: "#FF9E6D", path: "/footwear" },
    { name: "Bags & Purses", icon: "👜", color: "#B5E5CF", path: "/bags" },
    { name: "Jewelry", icon: "💎", color: "#FFC6FF", path: "/jewelry" },
    { name: "Men's Fashion", icon: "👔", color: "#9BF6FF", path: "/men" },
    { name: "Women's Fashion", icon: "👗", color: "#FFADAD", path: "/women" },
    { name: "Kids Collection", icon: "👶", color: "#CAFFBF", path: "/kids" },
    { name: "Winter Collection", icon: "❄️", color: "#A0C4FF", path: "/winter" },
  ];

  // Handle user login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
    setShowUserMenu(false);
    // Show welcome notification
    showToast(`Welcome back, ${userData.name}! 👋`, "success");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('fashionhub_user');
    setUser(null);
    setShowUserMenu(false);
    showToast("Logged out successfully!", "info");
  };

  // Toast notification helper
  const showToast = (message, type = "info") => {
    // You can implement your toast system here
    console.log(`${type}: ${message}`);
  };

  // Search suggestions
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const mockData = [
      { text: "Silk Dresses", icon: <FaGem />, category: "Luxury", trending: true },
      { text: "Leather Jackets", icon: <FaTshirt />, category: "Outerwear", trending: true },
      { text: "Designer Handbags", icon: <FaShoppingCart />, category: "Accessories" },
      { text: "Sneakers Collection", icon: <FaShoePrints />, category: "Footwear" },
      { text: "Summer Collection 2025", icon: <FaTag />, category: "New", trending: true },
      { text: "Watches", icon: <FaTag />, category: "Accessories" },
      { text: "Sunglasses", icon: <FaTag />, category: "Accessories" },
      { text: "Formal Suits", icon: <FaTshirt />, category: "Formal" },
    ];
    
    const filtered = mockData.filter(item => 
      item.text.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setSuggestions(filtered);
    setIsLoading(false);
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      
      if (categoriesRef.current && 
          !categoriesRef.current.contains(event.target) &&
          !event.target.closest('.categories-trigger')) {
        setShowCategories(false);
      }
      
      if (userMenuRef.current && 
          !userMenuRef.current.contains(event.target) &&
          !event.target.closest('.user-trigger')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate("/products", { state: { searchQuery: query } });
      setSearchQuery("");
      setShowSuggestions(false);
      setShowMobileSearch(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  const userMenuItems = [
    { icon: <FiUser />, text: "My Profile", path: "/profile" },
    { icon: <FaBox />, text: "My Orders", path: "/orders" },
    { icon: <FaHeart />, text: "Wishlist", count: 12, path: "/wishlist" },
    { icon: <FaGift />, text: "My Rewards", badge: "New", path: "/rewards" },
    { icon: <FaShippingFast />, text: "Track Order", path: "/track" },
    { icon: <FaCog />, text: "Settings", path: "/settings" },
    { icon: <FaSignOutAlt />, text: "Logout", action: handleLogout, danger: true },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      {showNotification && (
        <div className="announcement-bar">
          <div className="announcement-content">
            <FaShippingFast className="announcement-icon" />
            <span>🎁 Free Shipping on Orders Over $99 • New Collection Launch!</span>
            <button 
              className="announcement-close"
              onClick={() => setShowNotification(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${darkMode ? 'dark' : ''}`}>
        <div className="navbar-container">
          
          {/* Left: Logo & Categories */}
          <div className="navbar-left">
            <button 
              className="categories-trigger"
              onClick={() => setShowCategories(!showCategories)}
              aria-label="Browse categories"
            >
              <BsGrid3X3Gap />
              <span>Categories</span>
            </button>

            <div className="logo" onClick={() => navigate("/")}>
              <FaGem className="logo-icon" />
              <div className="logo-text">
                <span className="logo-main">FashionHub</span>
                <span className="logo-tagline">Premium Fashion</span>
              </div>
              <HiOutlineSparkles className="logo-sparkle" />
            </div>
          </div>

          {/* Center: Search */}
          <div className="navbar-center" ref={searchRef}>
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Discover luxury fashion, brands, collections..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                {searchQuery && (
                  <button 
                    type="button"
                    className="search-clear"
                    onClick={() => setSearchQuery("")}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <button type="submit" className="search-submit">
                Search
              </button>
            </form>

            {/* Suggestions Dropdown */}
          
          </div>

          {/* Right: Actions */}
          <div className="navbar-right">
            <button 
              className="theme-toggle"
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            <button className="mobile-search-trigger" onClick={() => setShowMobileSearch(true)}>
              <FiSearch />
            </button>

            <Link to="/wishlist" className="nav-action wishlist-action">
              <FaHeart />
              <span className="action-badge">12</span>
            </Link>

            <Link to="/notifications" className="nav-action notification-action">
              <FaBell />
              <span className="action-badge">3</span>
            </Link>

            <div className="user-wrapper" ref={userMenuRef}>
              <button 
                className="user-trigger"
                onClick={() => user ? setShowUserMenu(!showUserMenu) : setShowAuthModal(true)}
              >
                <div className="user-avatar">
                  {user ? user.name.charAt(0).toUpperCase() : <FiUser />}
                  {user?.premium && <FaCrown className="premium-badge" />}
                </div>
                <span className="user-name">{user ? user.name.split(' ')[0] : 'Sign In'}</span>
              </button>

              {/* User Menu */}
              {showUserMenu && user && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <div className="menu-user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                      {user.premium && <FaCrown className="menu-premium-badge" />}
                    </div>
                    <div className="menu-user-info">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                      <div className="user-stats">
                        <span className="user-stat">
                          <FaGem /> {user.points || 0} Points
                        </span>
                        <span className="user-stat">
                          <FiShoppingBag /> {user.orders || 0} Orders
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="user-menu-items">
                    {userMenuItems.map((item, index) => (
                      <div
                        key={index}
                        className={`menu-item ${item.danger ? 'danger' : ''}`}
                        onClick={() => {
                          if (item.action) item.action();
                          else if (item.path) navigate(item.path);
                          setShowUserMenu(false);
                        }}
                      >
                        <div className="menu-item-left">
                          <span className="menu-item-icon">{item.icon}</span>
                          <span className="menu-item-text">{item.text}</span>
                        </div>
                        <div className="menu-item-right">
                          {item.count && <span className="menu-item-count">{item.count}</span>}
                          {item.badge && <span className="menu-item-badge">{item.badge}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="cart-action">
              <div className="cart-icon-wrapper">
                <FiShoppingBag />
                {cartStats?.totalItems > 0 && (
                  <span className="cart-count">{cartStats.totalItems}</span>
                )}
              </div>
              <div className="cart-info">
                <span className="cart-label">Cart</span>
                <span className="cart-total">${cartStats?.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Categories Menu */}
      {showCategories && (
        <div className="categories-menu" ref={categoriesRef}>
          <div className="categories-header">
            <h3>✨ Shop by Category</h3>
            <button className="close-categories" onClick={() => setShowCategories(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="categories-grid">
            {fashionCategories.map((category, index) => (
              <div
                key={index}
                className="category-card"
                onClick={() => {
                  navigate(category.path);
                  setShowCategories(false);
                }}
                style={{ '--category-color': category.color }}
              >
                <div className="category-icon" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <span className="category-name">{category.name}</span>
                <span className="category-arrow">→</span>
              </div>
            ))}
          </div>
          <div className="categories-footer">
            <div className="trending-tags">
              <span>🔥 Hot Now:</span>
              <button className="trending-tag">#SummerSale</button>
              <button className="trending-tag">#NewCollection</button>
              <button className="trending-tag">#LimitedEdition</button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-container">
            <div className="mobile-search-header">
              <h2>Search FashionHub</h2>
              <button 
                className="close-mobile-search"
                onClick={() => setShowMobileSearch(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form className="mobile-search-form" onSubmit={handleSearch}>
              <div className="mobile-search-input">
                <FiSearch />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                  autoFocus
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")}>
                    <FaTimes />
                  </button>
                )}
              </div>
            </form>
            {suggestions.length > 0 && (
              <div className="mobile-suggestions">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="mobile-suggestion"
                    onClick={() => {
                      setSearchQuery(suggestion.text);
                      handleSearch(new Event('submit'));
                    }}
                  >
                    <span className="mobile-suggestion-icon">{suggestion.icon}</span>
                    <span className="mobile-suggestion-text">{suggestion.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;