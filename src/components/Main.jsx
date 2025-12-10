import { Link } from "react-router-dom";
import "../style/Main.css";

function Main() {
  const products = [
    {
      id: 1,
      name: "LD-04 4PC STITCHED | UNSTITCHED",
      price: "Rs.13,500",
      img: process.env.PUBLIC_URL + "/dress/download (1).jpeg",
    },
    {
      id: 2,
      name: "BLS-58 3PC STITCHED | UNSTITCHED",
      price: "Rs.9,750",
      img: process.env.PUBLIC_URL + "/dress/download (3).jpeg",
    },
    {
      id: 3,
      name: "LD-03 4PC STITCHED | UNSTITCHED",
      price: "Rs.13,500",
      img: process.env.PUBLIC_URL + "/dress/download (4).jpeg",
    },
    {
      id: 4,
      name: "BLS-63 3PC STITCHED | UNSTITCHED",
      price: "Rs.9,750",
      img: process.env.PUBLIC_URL + "/dress/download (2).jpeg",
    },
  ];

  return (
    <main className="main-container">
      <h1 className="title">Our Latest Collection</h1>

      <div className="product-grid">
        {products.map((product, index) => (
          <div key={`${product.id}-${index}`} className="product-card">
            <img
              src={product.img}
              alt={product.name}
              className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">{product.price}</p>
            <Link to="/details" className="product-button">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Main;
