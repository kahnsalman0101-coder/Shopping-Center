import React, { useState } from 'react';
import Product from '../components/Product';
import '../style/Home.css';

function Home() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const handleOfferClick = (discount) => {
    alert(`Applying ${discount} discount!`);
    // Add your discount logic here
  };

  return (
    <div className="home-page">
      {/* Hero Banner */}
     

      {/* Special Offers Buttons */}
      <div className="offers-section">
        <h2>Special Offers</h2>
        <div className="offer-buttons">
          <button 
            className="offer-btn"
            onClick={() => handleOfferClick('20%')}
          >
            20% OFF
          </button>
          <button 
            className="offer-btn"
            onClick={() => handleOfferClick('30%')}
          >
            30% OFF
          </button>
          <button 
            className="offer-btn"
            onClick={() => handleOfferClick('40%')}
          >
            40% OFF
          </button>
          <button 
            className="offer-btn"
            onClick={() => handleOfferClick('50%')}
          >
            50% OFF
          </button>
        </div>
      </div>

      {/* Filter & Sort Dropdowns */}
      <div className="filter-sort-section">
        <div className="dropdown-container">
          <div className="dropdown-group">
            <label>Filter:</label>
            <select 
              className="dropdown"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="all">All Products</option>
              <option value="new">New Arrivals</option>
              <option value="sale">On Sale</option>
              <option value="men">Men's Wear</option>
              <option value="women">Women's Wear</option>
              <option value="kids">Kids & Teens</option>
            </select>
          </div>

          <div className="dropdown-group">
            <label>Sort by:</label>
            <select 
              className="dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <Product filter={activeFilter} sort={sortBy} />
      </div>
    </div>
  );
}

export default Home;