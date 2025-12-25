import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import '../style/ProductGrid.css';

const ProductsGrid = ({ category = 'all', isOnSale = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
      setTimeout(() => {
        const allProducts = [
          {
            id: 1,
            productCode: "AJLFC-08",
            productName: "EMBROIDERED JAVERIA NET UNSTITCHED",
            originalPrice: 8850,
            discountedPrice: 6195,
            fabricType: "NET",
            pieces: 3,
            imageUrl: "/dress/download (1).jpeg",
            category: "net"
          },
          {
            id: 2,
            productCode: "AJLFC-10",
            productName: "EMBROIDERED NET UNSTITCHED",
            originalPrice: 8350,
            discountedPrice: 5845,
            fabricType: "NET",
            pieces: 3,
            imageUrl: "/dress/download (3).jpeg",
            category: "net"
          },
          {
            id: 3,
            productCode: "AJLFC-04",
            productName: "EMBROIDERED RAW SILK UNSTITCHED",
            originalPrice: 7950,
            discountedPrice: 5565,
            fabricType: "RAW SILK",
            pieces: 3,
            imageUrl: "/dress/download (4).jpeg",
            category: "silk",
            isNew: true
          },
          {
            id: 4,
            productCode: "AJMCH-15",
            productName: "DIGITAL PRINTED LAWN UNSTITCHED",
            originalPrice: 2850,
            discountedPrice: 1995,
            fabricType: "LAWN",
            pieces: 2,
            imageUrl: "/dress/download.jpeg",
            category: "lawn"
          },
          {
            id: 5,
            productCode: "AJFO-09",
            productName: "EMBROIDERED CHIFFON UNSTITCHED",
            originalPrice: 7650,
            discountedPrice: 4590,
            fabricType: "CHIFFON",
            pieces: 3,
            imageUrl: "/dress/downloada.jpeg",
            category: "chiffon"
          },
          {
            id: 6,
            productCode: "AJLFC-02",
            productName: "EMBROIDERED ORGANZA UNSTITCHED",
            originalPrice: 8350,
            discountedPrice: 5845,
            fabricType: "ORGANZA",
            pieces: 2,
            imageUrl: "/dress/download (1).jpeg",
            category: "organza"
          },
          {
            id: 7,
            productCode: "AJIZL-16",
            productName: "EMBROIDERED CHIFFON UNSTITCHED",
            originalPrice: 8950,
            discountedPrice: 5370,
            fabricType: "CHIFFON",
            pieces: 3,
            imageUrl: "/dress/download (3).jpeg",
            category: "chiffon"
          },
          {
            id: 8,
            productCode: "AJMCH-14",
            productName: "PRINTED LAWN UNSTITCHED",
            originalPrice: 2750,
            discountedPrice: 1925,
            fabricType: "LAWN",
            pieces: 2,
            imageUrl: "/dress/download (4).jpeg",
            category: "lawn",
            isNew: true
          },
          {
            id: 9,
            productCode: "AJLFC-12",
            productName: "EMBROIDERED VELVET UNSTITCHED",
            originalPrice: 9250,
            discountedPrice: 7400,
            fabricType: "VELVET",
            pieces: 3,
            imageUrl: "/dress/downloada.jpeg",
            category: "velvet"
          },
          {
            id: 10,
            productCode: "AJMCH-16",
            productName: "DIGITAL PRINTED VOILE UNSTITCHED",
            originalPrice: 3250,
            discountedPrice: 2275,
            fabricType: "VOILE",
            pieces: 2,
            imageUrl: "/dress/download.jpeg",
            category: "voile",
            isNew: true
          },
          {
            id: 11,
            productCode: "AJFO-11",
            productName: "EMBROIDERED GEORGETTE UNSTITCHED",
            originalPrice: 8150,
            discountedPrice: 5705,
            fabricType: "GEORGETTE",
            pieces: 3,
            imageUrl: "/dress/download (1).jpeg",
            category: "georgette"
          },
          {
            id: 12,
            productCode: "AJLFC-15",
            productName: "EMBROIDERED SATIN UNSTITCHED",
            originalPrice: 7450,
            discountedPrice: 5215,
            fabricType: "SATIN",
            pieces: 3,
            imageUrl: "/dress/download (3).jpeg",
            category: "satin"
          }
        ];

        let filteredProducts = allProducts;
        
        if (category !== 'all') {
          filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
          );
        }
        
        if (isOnSale) {
          filteredProducts = filteredProducts.filter(product => 
            product.discountedPrice < product.originalPrice
          );
        }
        
        setProducts(filteredProducts);
        setLoading(false);
      }, 500);
    };

    fetchProducts();
  }, [category, isOnSale]);

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.productName,
      price: product.discountedPrice,
      originalPrice: product.originalPrice,
      img: product.imageUrl,
      category: product.fabricType,
      quantity: 1,
      productCode: product.productCode,
      pieces: product.pieces
    };
    
    addToCart(cartItem);
    
    // Show success message
    if (window.toast) {
      window.toast.success(`${product.productName} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-grid-container">
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            {...product} 
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="no-products">
          <h3>No products found</h3>
          <p>Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;