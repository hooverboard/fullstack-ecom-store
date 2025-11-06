import React, { useContext } from "react";
import { UserContext } from "../context/userContext";
import { CartContext } from "../context/cartContext";
import toast from "react-hot-toast";
import "../src/css/storeProduct.css";
export default function StoreProduct({ id, name, price, image }) {
  const { user } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    const result = await addToCart(id, 1);

    if (result.success) {
      toast.success(`${name} added to cart!`);
    } else {
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <div className="store-product-card">
      <div className="store-product-image">
        <img src={image} alt={name} />
      </div>
      <div className="store-product-info">
        <h3 className="store-product-name">{name}</h3>
        <div className="store-product-footer">
          <span className="store-product-price">${price}</span>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
