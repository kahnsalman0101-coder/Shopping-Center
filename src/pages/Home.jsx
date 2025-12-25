import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductsGrid from '../components/ProductsGrid';
import CategoryFilter from '../components/CategoryFilter';
import '../style/Home.css';

const Home = ({ sale = false }) => {
  const { category } = useParams();
  const [filteredCategory, setFilteredCategory] = useState(category || 'all');
  const [isOnSale, setIsOnSale] = useState(sale);

  useEffect(() => {
    if (category) {
      setFilteredCategory(category);
    }
    setIsOnSale(sale);
  }, [category, sale]);

  const handleCategoryChange = (category) => {
    setFilteredCategory(category);
  };
  return (
    <div className="home-page">
      
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Collections</h2>
            <p>Discover our premium range of clothing</p>
          </div>
          
          <CategoryFilter 
            activeCategory={filteredCategory} 
            onCategoryChange={handleCategoryChange}
            showSaleFilter={true}
          />
          
          <ProductsGrid 
            category={filteredCategory}
            isOnSale={isOnSale}
          />
        </div>
      </section>

      <section className="banner-section">
        <div className="container">
          <div className="banner-grid">
            <div className="banner-card large">
              <img src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800" alt="Luxury Collection" />
              <div className="banner-content">
                <h3>Luxury Collection</h3>
                <p>Exclusive designs for special occasions</p>
                <button className="banner-btn">Explore</button>
              </div>
            </div>
            <div className="banner-card">
              <img src="https://images.unsplash.com/photo-1585487000160-6eb9ce6b5aae?w=400" alt="Casual Wear" />
              <div className="banner-content">
                <h3>Casual Wear</h3>
                <p>Comfort meets style</p>
                <button className="banner-btn">Shop Now</button>
              </div>
            </div>
            <div className="banner-card">
              <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" alt="Embroidered" />
              <div className="banner-content">
                <h3>Embroidered</h3>
                <p>Handcrafted elegance</p>
                <button className="banner-btn">View All</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h4>Free Shipping</h4>
              <p>On orders over Rs. 5000</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">↩️</div>
              <h4>Easy Returns</h4>
              <p>14-day return policy</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h4>Secure Payment</h4>
              <p>100% secure transactions</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">☎️</div>
              <h4>24/7 Support</h4>
              <p>Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;