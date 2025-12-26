import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("fashionhub_cart");
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      return parsed.map(item => ({
        ...item,
        basePricePKR: item.basePricePKR || item.originalPrice,
        baseDiscountedPricePKR: item.baseDiscountedPricePKR || item.price
      }));
    }
    return [];
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem("fashionhub_wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("fashionhub_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("fashionhub_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const showToast = useCallback((message, type = "success") => {
    const config = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    };

    switch (type) {
      case "success":
        toast.success(message, config);
        break;
      case "error":
        toast.error(message, config);
        break;
      case "warning":
        toast.warning(message, config);
        break;
      case "info":
        toast.info(message, config);
        break;
      default:
        toast(message, config);
    }
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        const updatedItem = { 
          ...exists, 
          quantity: exists.quantity + quantity 
        };
        
        if (quantity > 1) {
          showToast(
            `🛒 Added ${quantity} of "${product.name}" to cart!`,
            "success"
          );
        } else {
          showToast(
            `✨ "${product.name}" quantity increased to ${updatedItem.quantity}`,
            "info"
          );
        }
        
        return prev.map((p) =>
          p.id === product.id ? updatedItem : p
        );
      } else {
        const newItem = { 
          ...product, 
          quantity,
          addedAt: new Date().toISOString(),
          // Ensure base prices are stored
          basePricePKR: product.basePricePKR || product.originalPrice,
          baseDiscountedPricePKR: product.baseDiscountedPricePKR || product.price
        };
        
        showToast(
          `🎉 "${product.name}" added to cart!`,
          "success"
        );
        
        return [...prev, newItem];
      }
    });
  }, [showToast]);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => {
      const removedItem = prev.find((p) => p.id === id);
      if (removedItem) {
        showToast(
          `❌ Removed "${removedItem.name}" from cart`,
          "warning"
        );
      }
      return prev.filter((p) => p.id !== id);
    });
  }, [showToast]);

  const updateQuantity = useCallback((id, quantity) => {
    setCartItems((prev) => {
      const item = prev.find((p) => p.id === id);
      if (!item) return prev;

      if (quantity < 1) {
        showToast(
          `❌ Removed "${item.name}" from cart`,
          "warning"
        );
        return prev.filter((p) => p.id !== id);
      }

      if (quantity > 10) {
        showToast(
          `⚠️ Maximum quantity of 10 per item`,
          "warning"
        );
        return prev;
      }

      const updated = prev.map((p) =>
        p.id === id ? { ...p, quantity } : p
      );

      if (quantity > item.quantity) {
        showToast(
          `➕ Increased "${item.name}" quantity to ${quantity}`,
          "info"
        );
      } else {
        showToast(
          `➖ Decreased "${item.name}" quantity to ${quantity}`,
          "info"
        );
      }

      return updated;
    });
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCartItems((prev) => {
      if (prev.length > 0) {
        showToast("🧹 Cart cleared successfully!", "error");
      }
      return [];
    });
  }, [showToast]);

  const moveToWishlist = useCallback((id) => {
    setCartItems((prev) => {
      const itemToMove = prev.find((p) => p.id === id);
      if (!itemToMove) return prev;

      const updatedCart = prev.filter((p) => p.id !== id);
      
      setWishlistItems((wishlist) => {
        const existsInWishlist = wishlist.find((w) => w.id === id);
        if (existsInWishlist) {
          showToast(
            `💖 "${itemToMove.name}" is already in your wishlist!`,
            "info"
          );
          return wishlist;
        }
        
        showToast(
          `💝 "${itemToMove.name}" moved to wishlist!`,
          "success"
        );
        
        const { quantity, ...productWithoutQuantity } = itemToMove;
        return [...wishlist, productWithoutQuantity];
      });

      return updatedCart;
    });
  }, [showToast]);

  const addToWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        showToast(
          `💖 "${product.name}" is already in your wishlist!`,
          "info"
        );
        return prev;
      }
      
      showToast(
        `💝 "${product.name}" added to wishlist!`,
        "success"
      );
      
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  }, [showToast]);

  const removeFromWishlist = useCallback((id) => {
    setWishlistItems((prev) => {
      const removedItem = prev.find((p) => p.id === id);
      if (removedItem) {
        showToast(
          `💔 Removed "${removedItem.name}" from wishlist`,
          "warning"
        );
      }
      return prev.filter((p) => p.id !== id);
    });
  }, [showToast]);

  const moveToCart = useCallback((id) => {
    setWishlistItems((prev) => {
      const itemToMove = prev.find((p) => p.id === id);
      if (!itemToMove) return prev;

      const updatedWishlist = prev.filter((p) => p.id !== id);
      
      addToCart(itemToMove);
      
      showToast(
        `🛍️ "${itemToMove.name}" moved to cart!`,
        "success"
      );

      return updatedWishlist;
    });
  }, [addToCart, showToast]);

  const cartStats = useMemo(() => {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0
        : Number(item.price) || 0;
      return total + (price * item.quantity);
    }, 0);
    const shippingCost = totalPrice > 5000 ? 0 : 250;
    const tax = totalPrice * 0.16;

    return {
      totalItems,
      totalPrice,
      itemCount: cartItems.length,
      wishlistCount: wishlistItems.length,
      isFreeShipping: totalPrice > 5000,
      shippingCost,
      tax,
      grandTotal: totalPrice + shippingCost + tax
    };
  }, [cartItems, wishlistItems]);

  const isInWishlist = useCallback((id) => {
    return wishlistItems.some(item => item.id === id);
  }, [wishlistItems]);

  const isInCart = useCallback((id) => {
    return cartItems.some(item => item.id === id);
  }, [cartItems]);

  const getCartItem = useCallback((id) => {
    return cartItems.find(item => item.id === id);
  }, [cartItems]);

  const saveForLater = useCallback(() => {
    const cartData = {
      items: cartItems,
      savedAt: new Date().toISOString(),
      totalItems: cartStats.totalItems,
      totalPrice: cartStats.totalPrice
    };
    
    localStorage.setItem("fashionhub_saved_cart", JSON.stringify(cartData));
    showToast("📥 Cart saved for later!", "success");
    
    return cartData;
  }, [cartItems, cartStats, showToast]);

  const loadSavedCart = useCallback(() => {
    const savedData = localStorage.getItem("fashionhub_saved_cart");
    if (savedData) {
      const { items } = JSON.parse(savedData);
      setCartItems(items);
      showToast("📤 Saved cart loaded successfully!", "success");
      return true;
    }
    showToast("No saved cart found", "info");
    return false;
  }, [showToast]);

  const applyCoupon = useCallback((couponCode) => {
    const coupons = {
      "WELCOME10": 0.10,
      "FASHION20": 0.20,
      "SUMMER25": 0.25,
      "FREESHIP": "freeshipping"
    };

    const discount = coupons[couponCode.toUpperCase()];
    
    if (!discount) {
      showToast("Invalid coupon code", "error");
      return null;
    }

    if (discount === "freeshipping") {
      showToast("🎉 Free shipping applied!", "success");
      return { type: "freeshipping", value: cartStats.shippingCost };
    }

    const discountAmount = cartStats.totalPrice * discount;
    showToast(`🎉 Coupon applied! ${discount * 100}% off`, "success");
    
    return { type: "percentage", value: discount, amount: discountAmount };
  }, [cartStats, showToast]);

  return (
    <CartContext.Provider value={{
      cartItems,
      wishlistItems,
      cartStats,
      
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      moveToWishlist,
      
      addToWishlist,
      removeFromWishlist,
      moveToCart,
      
      isInWishlist,
      isInCart,
      getCartItem,
      
      saveForLater,
      loadSavedCart,
      applyCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};