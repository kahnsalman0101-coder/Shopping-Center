import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./components/Cart";
import CheckoutPage from "./pages/CheckoutPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { CartProvider } from "./context/CartContext";
import { CurrencyProvider } from "./context/CurrencyContext"; // Import CurrencyProvider
import "./style/App.css";

function App() {
  return (
    <CurrencyProvider> {/* Wrap everything with CurrencyProvider */}
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/category/:category" element={<Home />} />
                <Route path="/sale" element={<Home sale={true} />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </Router>
      </CartProvider>
    </CurrencyProvider>
  );
}

export default App;