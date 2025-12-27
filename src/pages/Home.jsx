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
            <p >Discover our premium range of clothing</p>
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
              <img src="/WinterSlider/500x500-lux-pret_ad15a7e6-261c-4a2f-b225-7bbe71205ea7_600x600.webp" alt="Casual Wear" />
              <div className="banner-content">
                <h3>Casual Wear</h3>
                <p>Comfort meets style</p>
                <button className="banner-btn">Shop Now</button>
              </div>
            </div>
            <div className="banner-card">
              <img src="/WinterSlider/500x500-unstitched_c623f23d-1579-4887-a76f-5987d86719dc_600x600.webp" alt="Embroidered" />
              <div className="banner-content">
                <h3>Embroidered</h3>
                <p>Handcrafted elegance</p>
                <button className="banner-btn">View All</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      

    </div>
  );
};

export default Home;