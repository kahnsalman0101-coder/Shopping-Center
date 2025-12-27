// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminProductForm from './AdminProductForm';
import '../style/AdminPanel.css';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const getInitialProducts = () => {
    return [
      {
        id: 1,
        productCode: "AJLFC-08",
        productName: "EMBROIDERED JAVERIA NET UNSTITCHED",
        basePricePKR: 8850,
        baseDiscountedPricePKR: 6195,
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
  };

  const fetchProducts = () => {
    setLoading(true);
    setTimeout(() => {
      const savedProducts = localStorage.getItem('products');
      let allProducts;
      
      if (savedProducts) {
        try {
          const parsedProducts = JSON.parse(savedProducts);
          // Ensure all products have required fields with defaults
          allProducts = parsedProducts.map(product => ({
            id: product.id || Date.now(),
            productCode: product.productCode || 'N/A',
            productName: product.productName || 'Unnamed Product',
            basePricePKR: product.basePricePKR || 0,
            baseDiscountedPricePKR: product.baseDiscountedPricePKR || 0,
            fabricType: product.fabricType || 'Unknown',
            pieces: product.pieces || 0,
            imageUrl: product.imageUrl || '/dress/default.jpg',
            category: product.category || 'uncategorized'
          }));
        } catch (error) {
          console.error('Error parsing products from localStorage:', error);
          allProducts = getInitialProducts();
        }
      } else {
        allProducts = getInitialProducts();
      }
      
      setProducts(allProducts);
      setLoading(false);
    }, 500);
  };

  const saveProductsToStorage = (productsArray) => {
    localStorage.setItem('products', JSON.stringify(productsArray));
  };

  const handleAddProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: Date.now(),
      basePricePKR: parseFloat(newProduct.basePricePKR) || 0,
      baseDiscountedPricePKR: parseFloat(newProduct.baseDiscountedPricePKR) || 0,
      pieces: parseInt(newProduct.pieces) || 0
    };

    const updatedProducts = [...products, productWithId];
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts);
    setShowAddForm(false);
    
    if (window.toast) {
      window.toast.success('Product added successfully!');
    }
  };

  const handleUpdateProduct = (updatedProduct) => {
    const updatedProducts = products.map(product =>
      product.id === updatedProduct.id ? {
        ...updatedProduct,
        basePricePKR: parseFloat(updatedProduct.basePricePKR) || 0,
        baseDiscountedPricePKR: parseFloat(updatedProduct.baseDiscountedPricePKR) || 0,
        pieces: parseInt(updatedProduct.pieces) || 0
      } : product
    );
    
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts);
    setEditingProduct(null);
    
    if (window.toast) {
      window.toast.success('Product updated successfully!');
    }
  };

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

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper function to safely format price
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return '0';
    }
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0' : numPrice.toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-user-info">
          <h2>Admin Dashboard</h2>
          <p>Welcome, {user?.name} ({user?.email})</p>
        </div>
        <div className="admin-actions">
          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingProduct(null);
              setShowAddForm(!showAddForm);
            }}
          >
            {showAddForm ? 'Cancel' : '➕ Add New Product'}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            View Store
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="admin-form-section">
          <AdminProductForm
            product={editingProduct}
            onSave={editingProduct ? handleUpdateProduct : handleAddProduct}
            onCancel={() => {
              setShowAddForm(false);
              setEditingProduct(null);
            }}
          />
        </div>
      )}

      <div className="products-management">
        <h3>Manage Products ({products.length} items)</h3>
        
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Fabric Type</th>
                <th>Category</th>
                <th>Price (PKR)</th>
                <th>Discounted (PKR)</th>
                <th>Pieces</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img 
                      src={product.imageUrl} 
                      alt={product.productName} 
                      className="product-thumbnail"
                      onError={(e) => {
                        e.target.src = '/dress/default.jpg';
                      }}
                    />
                  </td>
                  <td>{product.productCode}</td>
                  <td className="product-name-cell">{product.productName}</td>
                  <td>{product.fabricType}</td>
                  <td>{product.category}</td>
                  <td>PKR {formatPrice(product.basePricePKR)}</td>
                  <td>PKR {formatPrice(product.baseDiscountedPricePKR)}</td>
                  <td>{product.pieces || 0}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;