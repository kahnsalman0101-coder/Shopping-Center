import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../style/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const product = location.state || {
    id,
    name: "Unknown Product",
    price: "N/A",
    img: "https://via.placeholder.com/350x450?text=Product+Image",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    alert(
      `✅ Order Confirmed!\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${formData.address}\n\nThank you for shopping with us 💖`
    );
    setShowModal(false);
    setFormData({ name: "", email: "", phone: "", address: "" });
  };

  return (
    <div className="product-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-detail-container">
        <div className="detail-image-container">
          <img src={product.img} alt={product.name} className="detail-img" />
        </div>

        <div className="detail-info">
          <h1 className="detail-name">{product.name}</h1>
          <p className="price">{product.price}</p>

          <p className="description">
            Step into elegance with our premium design — made with fine fabrics,
            luxurious detailing, and a timeless silhouette.
          </p>

          <div className="size-options">
            <span>Select Size:</span>
            <div className="sizes">
              <button className="size-btn">S</button>
              <button className="size-btn">M</button>
              <button className="size-btn">L</button>
              <button className="size-btn">XL</button>
            </div>
          </div>

          <div className="detail-buttons">
            <button className="add-btn" onClick={() => addToCart(product)}>
              🛒 Add to Cart
            </button>
            <button className="buy-btn" onClick={() => setShowModal(true)}>
              💖 Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* === Modal for Checkout === */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">🛍️ Checkout Details</h2>
            <form onSubmit={handleBuyNow} className="checkout-form">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="address"
                placeholder="Delivery Address"
                value={formData.address}
                onChange={handleInputChange}
                required
              ></textarea>

              <div className="modal-buttons">
                <button type="submit" className="confirm-btn">
                  ✅ Confirm Order
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
