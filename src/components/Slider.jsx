import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Slider.css";

function Slider() {
  const navigate = useNavigate();
  const [textIndex, setTextIndex] = useState(0);

  const texts = [
    "✨ Discover Timeless Fashion ✨",
    "🌸 Luxury Lawn & Festive Collection 🌸",
    "💃 Style That Speaks Elegance 💃",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div
      className="slider-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/dress/downloada.jpeg"})`,
      }}
    >
      <div className="slider-overlay">
        <div className="slider-content">
          <h1 key={textIndex} className="slider-text fade-in">
            {texts[textIndex]}
          </h1>
          <button className="shop-btn" onClick={() => navigate("/products")}>
            🛍️ Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Slider;
