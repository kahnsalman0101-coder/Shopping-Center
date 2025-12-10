import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem("fashionhub_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    // Load wishlist from localStorage
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

  // ✅ Toast notification helper
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

  // ✅ Add to cart with quantity option
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
          addedAt: new Date().toISOString()
        };
        
        showToast(
          `🎉 "${product.name}" added to cart!`,
          "success"
        );
        
        return [...prev, newItem];
      }
    });
  }, [showToast]);

  // ✅ Remove from cart
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

  // ✅ Update quantity
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

  // ✅ Clear cart
  const clearCart = useCallback(() => {
    setCartItems((prev) => {
      if (prev.length > 0) {
        showToast("🧹 Cart cleared successfully!", "error");
      }
      return [];
    });
  }, [showToast]);

  // ✅ Move item from cart to wishlist
  const moveToWishlist = useCallback((id) => {
    setCartItems((prev) => {
      const itemToMove = prev.find((p) => p.id === id);
      if (!itemToMove) return prev;

      // Remove from cart
      const updatedCart = prev.filter((p) => p.id !== id);
      
      // Add to wishlist
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

  // ✅ Add to wishlist
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

  // ✅ Remove from wishlist
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

  // ✅ Move item from wishlist to cart
  const moveToCart = useCallback((id) => {
    setWishlistItems((prev) => {
      const itemToMove = prev.find((p) => p.id === id);
      if (!itemToMove) return prev;

      // Remove from wishlist
      const updatedWishlist = prev.filter((p) => p.id !== id);
      
      // Add to cart
      addToCart(itemToMove);
      
      showToast(
        `🛍️ "${itemToMove.name}" moved to cart!`,
        "success"
      );

      return updatedWishlist;
    });
  }, [addToCart, showToast]);

  // ✅ Calculate cart statistics - USE useMemo TO PREVENT RECALCULATION
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

  // ✅ Check if item is in wishlist
  const isInWishlist = useCallback((id) => {
    return wishlistItems.some(item => item.id === id);
  }, [wishlistItems]);

  // ✅ Check if item is in cart
  const isInCart = useCallback((id) => {
    return cartItems.some(item => item.id === id);
  }, [cartItems]);

  // ✅ Get cart item by ID
  const getCartItem = useCallback((id) => {
    return cartItems.find(item => item.id === id);
  }, [cartItems]);

  // ✅ Save cart for later (temporary storage)
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

  // ✅ Load saved cart
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

  // ✅ Apply coupon/discount
  const applyCoupon = useCallback((couponCode) => {
    const coupons = {
      "WELCOME10": 0.10, // 10% off
      "FASHION20": 0.20, // 20% off
      "SUMMER25": 0.25,  // 25% off
      "FREESHIP": "freeshipping" // Free shipping
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
      // Cart items and operations
      cartItems,
      wishlistItems,
      cartStats,
      
      // Cart operations
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      moveToWishlist,
      
      // Wishlist operations
      addToWishlist,
      removeFromWishlist,
      moveToCart,
      
      // Utility functions
      isInWishlist,
      isInCart,
      getCartItem,
      
      // Advanced features
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