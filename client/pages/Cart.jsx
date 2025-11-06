import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/userContext";
import { CartContext } from "../context/cartContext";
import toast from "react-hot-toast";
import "../src/App.css";
import "../src/css/Cart.css";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const {
    cartItems,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useContext(CartContext);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const result = await updateQuantity(productId, newQuantity);
    if (result.success) {
      toast.success("Cart updated");
    } else {
      toast.error("Failed to update cart");
    }
  };

  const handleRemoveItem = async (productId) => {
    const result = await removeFromCart(productId);
    if (result.success) {
      toast.success("Item removed from cart");
    } else {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      toast.success("Cart cleared");
    } else {
      toast.error("Failed to clear cart");
    }
  };

  const total = getCartTotal().toFixed(2);

  if (!user) {
    return (
      <div className="cart-container">
        <Navbar />
        <div className="cart-content">
          <div className="cart-header">
            <h1 className="cart-title">Your Shopping Cart</h1>
          </div>
          <div className="empty-cart">
            <p>Please login to view your cart</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-container">
        <Navbar />
        <div className="cart-content">
          <div className="cart-header">
            <h1 className="cart-title">Your Shopping Cart</h1>
          </div>
          <div className="empty-cart">
            <p>Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <Navbar />

      <div className="cart-content">
        <div className="cart-header">
          <h1 className="cart-title">Your Shopping Cart</h1>
          {cartItems.length > 0 && (
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          )}
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <p>Add some products to get started!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.description}</p>
                  <span className="cart-item-price">${item.product.price}</span>
                </div>
                <div className="cart-item-quantity">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(item.product._id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => {
                navigate("/checkout");
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
