import React from 'react';
import Slider from '../components/Slider';
import WinterSlider from '../components/WinterSlider';
import Main from '../components/Main';
import Product from '../components/Product';
import '../style/Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Slider />
      </section>
      
      {/* Winter Collection */}
      <section className="winter-section">
        <div className="section-header">
          <h2 className="section-title">❄️ Winter Collection 2025</h2>
          <p className="section-subtitle">Stay warm in style with our premium winter wear</p>
        </div>
        <WinterSlider />
      </section>
      
      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">⭐ Featured Products</h2>
          <p className="section-subtitle">Our handpicked selection of premium fashion</p>
        </div>
        <Main />
      </section>
      
      {/* All Products */}
      <section className="all-products-section">
        <div className="section-header">
          <h2 className="section-title">✨ Explore All Collections</h2>
          <p className="section-subtitle">Discover something for every occasion</p>
        </div>
        <Product />
      </section>
      
      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <h2>📧 Stay in Style</h2>
          <p>Subscribe to get updates on new arrivals, sales, and exclusive offers</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>
      </section>
      
      {/* Features Banner */}
      <div className="features-banner">
        <div className="feature-item">
          <div className="feature-icon">🚚</div>
          <h3>Free Shipping</h3>
          <p>On orders over Rs 5000</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">↩️</div>
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">🔒</div>
          <h3>Secure Payment</h3>
          <p>100% secure transactions</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">💖</div>
          <h3>24/7 Support</h3>
          <p>We're always here to help</p>
        </div>
      </div>
    </div>
  );
}

export default Home;