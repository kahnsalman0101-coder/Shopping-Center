import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaPinterest,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaApplePay
} from 'react-icons/fa';
import '../style/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section">
          <div className="footer-logo">
            <h3>ASIM JOFA</h3>
            <p className="footer-tagline">Where Style Meets Elegance</p>
          </div>
          <p className="footer-description">
            Bringing you the latest in fashion with quality and style. 
            Shop premium clothing, accessories, and more at unbeatable prices.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-link" aria-label="Pinterest">
              <FaPinterest />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Shop All</Link></li>
            <li><Link to="/products?category=new">New Arrivals</Link></li>
            <li><Link to="/products?category=best">Best Sellers</Link></li>
            <li><Link to="/products?category=sale">Sale</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <ul className="footer-links">
            <li><Link to="/products?category=men">Men's Fashion</Link></li>
            <li><Link to="/products?category=women">Women's Fashion</Link></li>
            <li><Link to="/products?category=kids">Kids & Babies</Link></li>
            <li><Link to="/products?category=accessories">Accessories</Link></li>
            <li><Link to="/products?category=footwear">Footwear</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <div className="contact-info">
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>123 Fashion Street, Style City, Lahore, Pakistan</span>
            </div>
            <div className="contact-item">
              <FaPhone />
              <span>+92 300 1234567</span>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <span>support@fashionhub.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-middle">
        <div className="payment-methods">
          <h5>We Accept:</h5>
          <div className="payment-icons">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
            <FaApplePay />
            <span>Bank Transfer</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
        
        <div className="newsletter">
          <h5>Subscribe to our Newsletter</h5>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          <p>&copy; {currentYear} Asim Jofa. All rights reserved.</p>
        </div>
        
        <div className="footer-policies">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/shipping">Shipping Policy</Link>
          <Link to="/returns">Return Policy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;