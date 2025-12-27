import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from './ProductCard';
import AdminProductForm from './AdminProductForm';
import '../style/ProductGrid.css';

const ProductsGrid = ({ category = 'all', isOnSale = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { addToCart } = useCart();
  const { selectedCountry, convertPrice, getCurrencyInfo } = useCurrency();
  const { isAdmin } = useAuth();

  // Complete initial products data
  const initialProducts = [
    {
      id: 1,
      productCode: "AJLFC-08",
      productName: "EMBROIDERED JAVERIA NET UNSTITCHED",
      basePricePKR: 8850,
      baseDiscountedPricePKR: 6195,
      fabricType: "NET",
      pieces: 3,
      imageUrl: "/dress/051A7626.webp",
      category: "net",
      description: "Beautifully embroidered net fabric unstitched suit"
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
      category: "silk",
      description: "Elegant silk dress with intricate embroidery"
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
      category: "cotton",
      description: "Comfortable cotton fabric with beautiful prints"
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
      category: "chiffon",
      description: "Stylish chiffon party wear collection"
    },
    {
      id: 5,
      productCode: "AJLFC-12",
      productName: "VELVET WINTER COLLECTION",
      basePricePKR: 9500,
      baseDiscountedPricePKR: 6650,
      fabricType: "VELVET",
      pieces: 3,
      imageUrl: "/WinterSlider/500x500-aura_cd6eb830-2078-42c0-9b7b-599a2db95213_600x600.webp",
      category: "velvet",
      description: "Luxurious velvet fabric for winter season"
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
      category: "organza",
      description: "Exquisite organza fabric for bridal wear"
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
      category: "lawn",
      description: "Light and breezy lawn fabric for summer"
    }
  ];

  // Clear corrupted data and reset to initial products
  const resetProductsToInitial = () => {
    localStorage.setItem('products', JSON.stringify(initialProducts));
    setProducts(initialProducts);
  };

  // Helper function to safely convert price
  const safeConvertPrice = (price) => {
    if (price === undefined || price === null) return 0;
    try {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice)) return 0;
      return convertPrice(numPrice);
    } catch (error) {
      console.error('Error converting price:', error);
      return 0;
    }
  };

  // Function to load products with proper structure
  const loadProducts = () => {
    setLoading(true);
    
    setTimeout(() => {
      let loadedProducts = [];
      
      try {
        const savedProducts = localStorage.getItem('products');
        
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          
          // Check if saved products have proper structure
          if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
            loadedProducts = parsedProducts;
          } else {
            // If saved products are corrupted, use initial products
            console.log('Saved products are corrupted, using initial products');
            loadedProducts = initialProducts;
            localStorage.setItem('products', JSON.stringify(initialProducts));
          }
        } else {
          // No saved products, use initial products
          loadedProducts = initialProducts;
          localStorage.setItem('products', JSON.stringify(initialProducts));
        }
      } catch (error) {
        console.error('Error loading products:', error);
        loadedProducts = initialProducts;
        localStorage.setItem('products', JSON.stringify(initialProducts));
      }
      
      // Process products with currency conversion
      const currencyInfo = getCurrencyInfo();
      
      const processedProducts = loadedProducts.map(product => {
        // Ensure product has all required fields
        const completeProduct = {
          id: product.id || Date.now(),
          productCode: product.productCode || `AJLFC-${Math.floor(Math.random() * 100) + 15}`,
          productName: product.productName || 'New Arrival',
          basePricePKR: product.basePricePKR || 3000,
          baseDiscountedPricePKR: product.baseDiscountedPricePKR || 2100,
          fabricType: product.fabricType || 'SILK',
          pieces: product.pieces || 3,
          imageUrl: product.imageUrl || '/dress/download (1).jpeg',
          category: product.category || 'unstitched',
          description: product.description || 'Premium quality fabric',
          originalPrice: safeConvertPrice(product.basePricePKR),
          discountedPrice: safeConvertPrice(product.baseDiscountedPricePKR),
          currencySymbol: currencyInfo?.symbol || '₨',
          currency: currencyInfo?.currency || 'PKR'
        };
        
        // Calculate discount percentage
        if (completeProduct.basePricePKR > 0 && completeProduct.baseDiscountedPricePKR > 0) {
          completeProduct.discountPercentage = Math.round(
            ((completeProduct.basePricePKR - completeProduct.baseDiscountedPricePKR) / 
             completeProduct.basePricePKR) * 100
          );
        } else {
          completeProduct.discountPercentage = 0;
        }
        
        return completeProduct;
      });
      
      // Filter products based on category and sale
      let filteredProducts = processedProducts;
      
      if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (isOnSale) {
        filteredProducts = filteredProducts.filter(product => 
          product.discountPercentage > 0
        );
      }
      
      setProducts(filteredProducts);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadProducts();
  }, [category, isOnSale, selectedCountry, convertPrice, getCurrencyInfo]);

  // Save products to localStorage
  const saveProductsToStorage = (productsArray) => {
    try {
      // Only save essential product data
      const productsToSave = productsArray.map(product => ({
        id: product.id,
        productCode: product.productCode,
        productName: product.productName,
        basePricePKR: product.basePricePKR,
        baseDiscountedPricePKR: product.baseDiscountedPricePKR,
        fabricType: product.fabricType,
        pieces: product.pieces,
        imageUrl: product.imageUrl,
        category: product.category,
        description: product.description || ''
      }));
      
      localStorage.setItem('products', JSON.stringify(productsToSave));
    } catch (error) {
      console.error('Error saving products:', error);
      if (window.toast) {
        window.toast.error('Failed to save products!');
      }
    }
  };

  // Add new product
  const handleAddProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: Date.now(),
      productCode: newProduct.productCode || `AJLFC-${Math.floor(Math.random() * 100) + 20}`,
      productName: newProduct.productName || 'New Product',
      basePricePKR: parseFloat(newProduct.basePricePKR) || 3000,
      baseDiscountedPricePKR: parseFloat(newProduct.baseDiscountedPricePKR) || 2100,
      fabricType: newProduct.fabricType || 'COTTON',
      pieces: parseInt(newProduct.pieces) || 3,
      imageUrl: newProduct.imageUrl || '/dress/download (1).jpeg',
      category: newProduct.category || 'unstitched',
      description: newProduct.description || 'Premium quality fabric'
    };

    const updatedProducts = [...products, productWithId];
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts);
    setShowAddForm(false);
    
    if (window.toast) {
      window.toast.success(`${productWithId.productName} added successfully!`);
    }
  };

  // Update existing product
  const handleUpdateProduct = (updatedProduct) => {
    const updatedProducts = products.map(product =>
      product.id === updatedProduct.id ? {
        ...updatedProduct,
        basePricePKR: parseFloat(updatedProduct.basePricePKR) || product.basePricePKR,
        baseDiscountedPricePKR: parseFloat(updatedProduct.baseDiscountedPricePKR) || product.baseDiscountedPricePKR,
        pieces: parseInt(updatedProduct.pieces) || product.pieces
      } : product
    );
    
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts);
    setEditingProduct(null);
    
    if (window.toast) {
      window.toast.success(`${updatedProduct.productName} updated successfully!`);
    }
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      saveProductsToStorage(updatedProducts);
      
      if (window.toast) {
        window.toast.success('Product deleted successfully!');
      }
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.productName,
      price: product.discountedPrice || product.originalPrice,
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
    
    if (window.toast) {
      window.toast.success(`${product.productName} added to cart!`);
    }
  };

  // Force reset products to initial state
  const handleResetProducts = () => {
    if (window.confirm('Reset all products to initial state? This will delete any custom products.')) {
      resetProductsToInitial();
      if (window.toast) {
        window.toast.success('Products reset to initial state!');
      }
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
      {/* Admin Controls */}
      {isAdmin && (
        <div className="admin-controls">
          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingProduct(null);
              setShowAddForm(!showAddForm);
            }}
          >
            {showAddForm ? 'Cancel' : '➕ Add New Product'}
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={handleResetProducts}
            style={{ marginLeft: '10px' }}
          >
            🔄 Reset Products
          </button>
          
          {showAddForm && (
            <AdminProductForm
              product={editingProduct}
              onSave={editingProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={() => {
                setShowAddForm(false);
                setEditingProduct(null);
              }}
            />
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            onAddToCart={() => handleAddToCart(product)}
            isAdmin={isAdmin}
            onEdit={() => handleEditProduct(product)}
            onDelete={() => handleDeleteProduct(product.id)}
          />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="no-products">
          <h3>No products found</h3>
          <p>Try selecting a different category</p>
          {isAdmin && (
            <button 
              className="btn btn-primary"
              onClick={handleResetProducts}
              style={{ marginTop: '10px' }}
            >
              Reset Products to Initial State
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;