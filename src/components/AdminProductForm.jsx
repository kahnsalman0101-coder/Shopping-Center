// src/components/AdminProductForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../style/AdminProductForm.css';

const AdminProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    productCode: '',
    productName: '',
    basePricePKR: '',
    baseDiscountedPricePKR: '',
    fabricType: '',
    pieces: '',
    imageUrl: '',
    category: '',
    imagePreview: '' // For previewing selected image
  });

  const [imageFile, setImageFile] = useState(null); // For storing actual file
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        productCode: product.productCode || '',
        productName: product.productName || '',
        basePricePKR: product.basePricePKR || '',
        baseDiscountedPricePKR: product.baseDiscountedPricePKR || '',
        fabricType: product.fabricType || '',
        pieces: product.pieces || '',
        imageUrl: product.imageUrl || '',
        category: product.category || '',
        imagePreview: product.imageUrl || '' // Set preview to existing image
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection from gallery
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagePreview: reader.result,
          imageUrl: reader.result // Set imageUrl to base64 for now
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setFormData(prev => ({
      ...prev,
      imagePreview: '',
      imageUrl: ''
    }));
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Use sample image
  const handleUseSampleImage = () => {
    const sampleImages = [
      '/dress/download (1).jpeg',
      '/dress/download (2).jpeg',
      '/dress/download (3).jpeg',
      '/dress/download (4).jpeg',
      '/dress/download (5).jpeg'
    ];
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    
    setFormData(prev => ({
      ...prev,
      imagePreview: randomImage,
      imageUrl: randomImage
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.imageUrl && !formData.imagePreview) {
      alert('Please select an image for the product');
      return;
    }

    // Prepare data for saving
    const productData = {
      ...formData,
      imageUrl: formData.imageUrl || formData.imagePreview
    };
    
    // Remove preview from saved data
    delete productData.imagePreview;
    
    onSave(productData);
  };

  // Fabric types options
  const fabricTypes = [
    { value: 'NET', label: 'NET' },
    { value: 'SILK', label: 'SILK' },
    { value: 'COTTON', label: 'COTTON' },
    { value: 'CHIFFON', label: 'CHIFFON' },
    { value: 'VELVET', label: 'VELVET' },
    { value: 'ORGANZA', label: 'ORGANZA' },
    { value: 'LAWN', label: 'LAWN' },
    { value: 'LINEN', label: 'LINEN' },
    { value: 'SATIN', label: 'SATIN' },
    { value: 'GEORGETTE', label: 'GEORGETTE' }
  ];

  // Category options
  const categories = [
    { value: 'net', label: 'Net' },
    { value: 'silk', label: 'Silk' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'chiffon', label: 'Chiffon' },
    { value: 'velvet', label: 'Velvet' },
    { value: 'organza', label: 'Organza' },
    { value: 'lawn', label: 'Lawn' },
    { value: 'unstitched', label: 'Unstitched' },
    { value: 'ready-to-wear', label: 'Ready to Wear' },
    { value: 'western', label: 'Western' },
    { value: 'menswear', label: 'Menswear' },
    { value: 'bridal', label: 'Bridal' },
    { value: 'casual', label: 'Casual' }
  ];

  return (
    <div className="admin-product-form">
      <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Product Code *</label>
            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              required
              placeholder="e.g., AJLFC-001"
            />
          </div>
          
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Base Price (PKR) *</label>
            <input
              type="number"
              name="basePricePKR"
              value={formData.basePricePKR}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="Original price in PKR"
            />
          </div>
          
          <div className="form-group">
            <label>Discounted Price (PKR) *</label>
            <input
              type="number"
              name="baseDiscountedPricePKR"
              value={formData.baseDiscountedPricePKR}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="Discounted price in PKR"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fabric Type *</label>
            <select
              name="fabricType"
              value={formData.fabricType}
              onChange={handleChange}
              required
            >
              <option value="">Select fabric type</option>
              {fabricTypes.map((fabric) => (
                <option key={fabric.value} value={fabric.value}>
                  {fabric.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Number of Pieces *</label>
            <input
              type="number"
              name="pieces"
              value={formData.pieces}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g., 3"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="form-row">
          <div className="form-group full-width">
            <label>Product Image *</label>
            
            <div className="image-upload-section">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
              
              {/* Image preview */}
              {formData.imagePreview ? (
                <div className="image-preview-container">
                  <div className="image-preview-wrapper">
                    <img 
                      src={formData.imagePreview} 
                      alt="Product preview" 
                      className="image-preview"
                    />
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={handleRemoveImage}
                      title="Remove image"
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  </div>
                  <p className="image-info">
                    {imageFile ? imageFile.name : 'Image selected'}
                  </p>
                </div>
              ) : (
                <div className="image-placeholder" onClick={handleImageClick}>
                  <i className="bi bi-image"></i>
                  <p>Click to upload product image</p>
                  <span className="image-hint">or drag & drop</span>
                  <span className="image-requirements">
                    JPG, PNG up to 5MB
                  </span>
                </div>
              )}
              
              {/* Image action buttons */}
              <div className="image-actions">
                <button 
                  type="button" 
                  className="btn-image-action"
                  onClick={handleImageClick}
                >
                  <i className="bi bi-upload"></i>
                  {formData.imagePreview ? 'Change Image' : 'Upload Image'}
                </button>
                
                <button 
                  type="button" 
                  className="btn-image-action secondary"
                  onClick={handleUseSampleImage}
                >
                  <i className="bi bi-images"></i>
                  Use Sample Image
                </button>
                
                {formData.imagePreview && (
                  <button 
                    type="button" 
                    className="btn-image-action danger"
                    onClick={handleRemoveImage}
                  >
                    <i className="bi bi-trash"></i>
                    Remove Image
                  </button>
                )}
              </div>
            </div>
            
            {/* Direct URL input (alternative) */}
            <div className="image-url-section">
              <label>Or enter image URL:</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {product ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;