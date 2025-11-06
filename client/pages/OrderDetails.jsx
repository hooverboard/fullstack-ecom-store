import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../src/App.css";

export default function OrderDetails({ order, onBack }) {
  const navigate = useNavigate();

  if (!order) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="order-details-container">
          <div className="error-message">
            <h2>Order not found</h2>
            <button
              onClick={() => navigate("/admin/manage-orders")}
              className="back-button"
            >
              ← Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateItemTotal = (item) => {
    return (item.priceAtPurchase * item.quantity).toFixed(2);
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="order-details-container">
        <div className="order-details-header">
          <button
            onClick={onBack || (() => navigate("/admin/manage-orders"))}
            className="back-button"
          >
            ← Back to Orders
          </button>
          <h1>Order Details</h1>
        </div>

        <div className="order-details-content">
          {/* Order Summary Card */}
          <div className="order-summary-card">
            <div className="order-summary-header">
              <h2>Order #{order._id.slice(-8)}</h2>
              <div className="order-status-badges">
                <span className={`status-badge payment-${order.paymentStatus}`}>
                  {order.paymentStatus}
                </span>
                <span
                  className={`status-badge order-${
                    order.orderStatus || "pending"
                  }`}
                >
                  {order.orderStatus || "pending"}
                </span>
              </div>
            </div>

            <div className="order-info-grid">
              <div className="info-item">
                <label>Customer:</label>
                <span>{order.user?.email || "N/A"}</span>
              </div>
              <div className="info-item">
                <label>Order Date:</label>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="info-item">
                <label>Total Amount:</label>
                <span className="total-amount">
                  ${order.totalAmount?.toFixed(2)}
                </span>
              </div>
              <div className="info-item">
                <label>Shipping Method:</label>
                <span>{order.shippingMethod || "Standard"}</span>
              </div>
            </div>
          </div>

          <div className="order-details-grid">
            {/* Shipping Address */}
            <div className="details-card">
              <h3>Shipping Details</h3>
              <div className="address-info">
                <p>
                  <strong>{order.shippingAddress?.fullName}</strong>
                </p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.zipCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="details-card order-items-card">
              <h3>Order Items ({order.items?.length || 0})</h3>
              <div className="order-items-list">
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img
                        src={item.product?.image || "/placeholder-image.jpg"}
                        alt={item.product?.name || "Product"}
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <h4>{item.product?.name || "Product Name"}</h4>
                      <p className="item-description">
                        {item.product?.description ||
                          "No description available"}
                      </p>
                      <div className="item-pricing">
                        <span className="item-price">
                          ${item.priceAtPurchase?.toFixed(2)} each
                        </span>
                        <span className="item-quantity">
                          Qty: {item.quantity}
                        </span>
                        <span className="item-total">
                          ${calculateItemTotal(item)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>
                    $
                    {(order.totalAmount - (order.shippingCost || 5)).toFixed(2)}
                  </span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>${(order.shippingCost || 5).toFixed(2)}</span>
                </div>
                <div className="total-row final-total">
                  <span>Total:</span>
                  <span>${order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {order.stripePaymentIntentId && (
            <div className="details-card">
              <h3>Payment Information</h3>
              <div className="payment-info">
                <div className="info-item">
                  <label>Payment Intent ID:</label>
                  <span className="payment-id">
                    {order.stripePaymentIntentId}
                  </span>
                </div>
                <div className="info-item">
                  <label>Payment Status:</label>
                  <span
                    className={`status-badge payment-${order.paymentStatus}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
