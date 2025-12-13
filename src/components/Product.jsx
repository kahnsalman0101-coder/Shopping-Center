import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Product.css";

function Product() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: null,
    previewUrl: ""
  });

  // Initial products (same as your original data)
  const initialProducts = [
    {
      id: 1,
      name: "UNSTITCHED",
      price: "Rs.13,500",
      img: process.env.PUBLIC_URL + "/dress/download (1).jpeg",
    },
    {
      id: 2,
      name: "UNSTITCHED 1",
      price: "Rs.9,750",
      img: process.env.PUBLIC_URL + "/dress/download (3).jpeg",
    },
    {
      id: 3,
      name: "UNSTITCHED 2",
      price: "Rs.13,500",
      img: process.env.PUBLIC_URL + "/dress/download (4).jpeg",
    },
    {
      id: 4,
      name: "UNSTITCHED 3",
      price: "Rs.9,750",
      img: process.env.PUBLIC_URL + "/dress/download (1).jpeg",
    },
    {
      id: 5,
      name: "UNSTITCHED 4",
      price: "Rs.13,500",
      img: process.env.PUBLIC_URL + "/dress/download (1).jpeg",
    },
    {
      id: 6,
      name: "UNSTITCHED 5",
      price: "Rs.13,500",
      img: process.env.PUBLIC_URL + "/dress/download (1).jpeg",
    },
    {
      id: 7,
      name: "UNSTITCHED 6",
      price: "Rs.13,500",
      img: process.env.PUBLIC_URL + "/dress/download (1).jpeg",
    },
    {
      id: 8,
      name: "UNSTITCHED 7",
      price: "Rs.13,500",
      img: process.env.PUBLIC_URL + "/dress/download (1).jpeg",
    },
  ];

  // Check admin status on component mount
  useEffect(() => {
    // In a real app, you would check authentication here
    // For demo, you can set isAdmin to true or use localStorage
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
    
    // Load products from localStorage or use initial
    const savedProducts = JSON.parse(localStorage.getItem("products"));
    if (savedProducts && savedProducts.length > 0) {
      setAllProducts(savedProducts);
    } else {
      setAllProducts(initialProducts);
      localStorage.setItem("products", JSON.stringify(initialProducts));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({
          ...newProduct,
          image: file,
          previewUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProduct = (e) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert("Please fill all fields and select an image");
      return;
    }

    const newProductObj = {
      id: allProducts.length + 1,
      name: newProduct.name,
      price: newProduct.price,
      img: newProduct.previewUrl // In production, you'd upload to a server
    };

    const updatedProducts = [...allProducts, newProductObj];
    setAllProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    
    // Reset form and close modal
    setNewProduct({
      name: "",
      price: "",
      image: null,
      previewUrl: ""
    });
    setShowUploadModal(false);
    
    alert("Product added successfully!");
  };

  const handleRemoveProduct = (id) => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      const updatedProducts = allProducts.filter(product => product.id !== id);
      setAllProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
    }
  };

  const toggleAdminMode = () => {
    const newAdminStatus = !isAdmin;
    setIsAdmin(newAdminStatus);
    localStorage.setItem("isAdmin", newAdminStatus.toString());
  };

  return (
    <section className="product-section">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="admin-controls">
          <div className="admin-header">
            <h2>Admin Gallery Management</h2>
            <div className="admin-actions">
              <button 
                className="admin-btn upload-btn"
                onClick={() => setShowUploadModal(true)}
              >
                📤 Upload New Product
              </button>
              <button 
                className="admin-btn toggle-admin-btn"
                onClick={toggleAdminMode}
              >
                👤 Exit Admin Mode
              </button>
            </div>
          </div>
          
          <div className="admin-stats">
            <p>Total Products: {allProducts.length}</p>
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Upload New Product</h3>
              <button 
                className="close-btn"
                onClick={() => setShowUploadModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUploadProduct} className="upload-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="e.g., Rs.13,500"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {newProduct.previewUrl && (
                  <div className="image-preview">
                    <img 
                      src={newProduct.previewUrl} 
                      alt="Preview" 
                      style={{maxWidth: "200px", marginTop: "10px"}}
                    />
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Upload Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="product-grid">
        {allProducts.map((item) => (
          <div key={item.id} className="product-card">
            {/* Admin delete button */}
            {isAdmin && (
              <button 
                className="delete-btn"
                onClick={() => handleRemoveProduct(item.id)}
                title="Remove product"
              >
                ✕
              </button>
            )}
            
            <img src={item.img} alt={item.name} className="product-img" />
            <div className="product-info">
              <h3>{item.name}</h3>
              <p className="price">{item.price}</p>
              <button
                className="buy-btn"
                onClick={() => navigate(`/product/${item.id}`, { state: item })}
              >
                🛒 View Details
              </button>
            </div>
          </div>
        ))}
           {/* Admin Toggle Button (Visible to all users) */}
      {!isAdmin && (
        <div className="admin-toggle-section">
          <button 
            className="admin-toggle-btn"
            onClick={toggleAdminMode}
          >
            🔐 Admin Access
          </button>
          <small className="admin-hint">
            Click to enter admin mode for gallery management
          </small>
        </div>
      )}

      </div>
    </section>
  );
}

export default Product;