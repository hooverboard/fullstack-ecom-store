import React from "react";
import "../src/css/OrderHistory.css";

export default function OrderItem({ item }) {
  return (
    <div className="order-item-card">
      <div className="order-item-image">
        <img
          src={item.product?.image || "/placeholder-image.jpg"}
          alt={item.product?.name || "Product"}
        />
      </div>
      <div className="order-item-details">
        <h4 className="order-item-name">
          {item.product?.name || "Product Name"}
        </h4>
        <p className="order-item-description">
          {item.product?.description || "Product description"}
        </p>
        <div className="order-item-info">
          <span className="order-item-quantity">Qty: {item.quantity || 1}</span>
          <span className="order-item-price">
            R$ {((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
          </span>
        </div>
        <div className="order-item-meta">
          <span className="order-item-unit-price">
            Unit Price: R$ {(item.product?.price || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
