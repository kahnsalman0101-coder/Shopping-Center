import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext'; // Import useCurrency
import ProductCard from './ProductCard';
import '../style/ProductGrid.css';

const ProductsGrid = ({ category = 'all', isOnSale = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { selectedCountry, convertPrice, getCurrencyInfo } = useCurrency(); // Get currency functions

  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
      setTimeout(() => {
        // Store base prices in PKR
        const allProducts = [
          {
            id: 1,
            productCode: "AJLFC-08",
            productName: "EMBROIDERED JAVERIA NET UNSTITCHED",
            basePricePKR: 8850, // Store base price in PKR
            baseDiscountedPricePKR: 6195, // Store base discounted price in PKR
            fabricType: "NET",
            pieces: 3,
            imageUrl: "/dress/download (1).jpeg",
            category: "net"
          },
          {
            id: 2,
            productCode: "AJLFC-09",
            productName: "SILK EMBROIDERED DRESS",
            basePricePKR: 7500,
            baseDiscountedPricePKR: 5250,
            fabricType: "SILK",
            pieces: 2,
            imageUrl: "/dress/download (1).jpeg",
            category: "silk"
          },
          {
            id: 3,
            productCode: "AJLFC-10",
            productName: "COTTON PRINT UNSTITCHED",
            basePricePKR: 3500,
            baseDiscountedPricePKR: 2450,
            fabricType: "COTTON",
            pieces: 3,
            imageUrl: "/dress/download (1).jpeg",
            category: "cotton"
          },
          {
            id: 4,
            productCode: "AJLFC-11",
            productName: "CHIFFON PARTY WEAR",
            basePricePKR: 6500,
            baseDiscountedPricePKR: 4550,
            fabricType: "CHIFFON",
            pieces: 2,
            imageUrl: "/dress/download (1).jpeg",
            category: "chiffon"
          },
          {
            id: 5,
            productCode: "AJLFC-12",
            productName: "VELVET WINTER COLLECTION",
            basePricePKR: 9500,
            baseDiscountedPricePKR: 6650,
            fabricType: "VELVET",
            pieces: 3,
            imageUrl: "/dress/download (1).jpeg",
            category: "velvet"
          },
          {
            id: 6,
            productCode: "AJLFC-13",
            productName: "ORGANZA BRIDAL WEAR",
            basePricePKR: 12000,
            baseDiscountedPricePKR: 8400,
            fabricType: "ORGANZA",
            pieces: 2,
            imageUrl: "/dress/download (1).jpeg",
            category: "organza"
          },
          {
            id: 7,
            productCode: "AJLFC-14",
            productName: "LAWN SUMMER COLLECTION",
            basePricePKR: 2800,
            baseDiscountedPricePKR: 1960,
            fabricType: "LAWN",
            pieces: 3,
            imageUrl: "/dress/download (1).jpeg",
            category: "lawn"
          }
        ];

        // Get current currency info
        const currencyInfo = getCurrencyInfo();
        
        // Convert prices based on selected country
        const productsWithConvertedPrices = allProducts.map(product => {
          const convertedOriginal = convertPrice(product.basePricePKR);
          const convertedDiscounted = convertPrice(product.baseDiscountedPricePKR);
          
          return {
            ...product,
            originalPrice: convertedOriginal,
            discountedPrice: convertedDiscounted,
            currencySymbol: currencyInfo.symbol,
            currency: currencyInfo.currency,
            discountPercentage: Math.round(((product.basePricePKR - product.baseDiscountedPricePKR) / product.basePricePKR) * 100)
          };
        });

        let filteredProducts = productsWithConvertedPrices;
        
        if (category !== 'all') {
          filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
          );
        }
        
        if (isOnSale) {
          filteredProducts = filteredProducts.filter(product => 
            product.baseDiscountedPricePKR < product.basePricePKR
          );
        }
        
        setProducts(filteredProducts);
        setLoading(false);
      }, 500);
    };

    fetchProducts();
  }, [category, isOnSale, selectedCountry, convertPrice, getCurrencyInfo]); // Add currency dependencies

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.productName,
      price: product.discountedPrice,
      originalPrice: product.originalPrice,
      basePricePKR: product.basePricePKR,
      baseDiscountedPricePKR: product.baseDiscountedPricePKR,
      img: product.imageUrl,
      category: product.fabricType,
      quantity: 1,
      productCode: product.productCode,
      pieces: product.pieces,
      currencySymbol: product.currencySymbol,
      currency: product.currency
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
            product={product}
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