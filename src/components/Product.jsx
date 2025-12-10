import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Product.css";

function Product() {
  const navigate = useNavigate();

  const allProducts = [
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

  return (
    <section className="product-section">

      <div className="product-grid">
        {allProducts.map((item) => (
          <div key={item.id} className="product-card">
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
      </div>
    </section>
  );
}

export default Product;
