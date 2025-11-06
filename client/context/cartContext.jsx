import React, { createContext, useContext, useState, useEffect } from "react";
import { UserContext } from "./userContext";
import axios from "axios";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/cart");
      setCartItems(response.data.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post("/api/cart", {
        productId,
        quantity,
      });
      setCartItems(response.data.cart);
      return { success: true };
    } catch (error) {
      console.error("Add to cart error:", error);
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await axios.put("/api/cart", {
        productId,
        quantity: newQuantity,
      });
      setCartItems(response.data.cart);
      return { success: true };
    } catch (error) {
      console.error("Update quantity error:", error);
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`/api/cart/${productId}`);
      setCartItems(response.data.cart);
      return { success: true };
    } catch (error) {
      console.error("Remove from cart error:", error);
      return { success: false, error: error.message };
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("/api/cart");
      setCartItems([]);
      return { success: true };
    } catch (error) {
      console.error("Clear cart error:", error);
      return { success: false, error: error.message };
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartItemCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
