import React from 'react';
import '../style/CategoryFilter.css';

const CategoryFilter = ({ activeCategory, onCategoryChange, showSaleFilter = true }) => {
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'net', name: 'Net' },
    { id: 'silk', name: 'Silk' },
    { id: 'lawn', name: 'Lawn' },
    { id: 'chiffon', name: 'Chiffon' },
    { id: 'organza', name: 'Organza' },
    { id: 'velvet', name: 'Velvet' },
    { id: 'georgette', name: 'Georgette' },
    { id: 'satin', name: 'Satin' }
  ];

  return (
    <div className="category-filter">
      <div className="filter-buttons">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.name}
          </button>
        ))}
        
        {showSaleFilter && (
          <button
            className={`filter-btn sale-btn ${activeCategory === 'sale' ? 'active' : ''}`}
            onClick={() => onCategoryChange('sale')}
          >
            On Sale
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;