import React from "react";
import "../src/css/Product.css";
import { useNavigate } from "react-router-dom";

export default function Product({ name, description, price, image, id }) {
  const navigate = useNavigate();
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-footer">
          <span className="product-price">${price}</span>
          <button
            className="edit-btn"
            onClick={() => {
              navigate(`/dashboard/edit-product/${id}`, {
                state: {
                  name,
                  description,
                  price,
                  image,
                },
              });
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
