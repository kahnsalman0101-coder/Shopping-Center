import React, { useState, useRef, useEffect } from 'react';
import { 
  FaUserCircle, 
  FaSignOutAlt, 
  FaHeart, 
  FaShoppingBag, 
  FaCog,
  FaHistory,
  FaMapMarkerAlt,
  FaChevronDown 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../style/UserDropDown.css';

function UserDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <button 
        className="user-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <div className="user-avatar">
          <FaUserCircle />
        </div>
        <span className="user-name">{user?.name?.split(' ')[0] || 'Account'}</span>
        <FaChevronDown className={`dropdown-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {/* User Info */}
          <div className="user-info">
            <div className="user-info-avatar">
              <FaUserCircle />
            </div>
            <div className="user-info-details">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          {/* Menu Items */}
          <div className="dropdown-items">
            <button 
              className="dropdown-item"
              onClick={() => handleItemClick('/profile')}
            >
              <FaUserCircle />
              <span>My Profile</span>
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleItemClick('/orders')}
            >
              <FaHistory />
              <span>Order History</span>
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleItemClick('/wishlist')}
            >
              <FaHeart />
              <span>Wishlist</span>
              <span className="badge">3</span>
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleItemClick('/cart')}
            >
              <FaShoppingBag />
              <span>Shopping Cart</span>
              <span className="badge">2</span>
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleItemClick('/addresses')}
            >
              <FaMapMarkerAlt />
              <span>Saved Addresses</span>
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleItemClick('/settings')}
            >
              <FaCog />
              <span>Account Settings</span>
            </button>
          </div>

          <div className="dropdown-divider"></div>

          {/* Logout */}
          <button className="dropdown-item logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;