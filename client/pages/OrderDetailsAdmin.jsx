import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/userContext";
import "../src/App.css";
import toast from "react-hot-toast";
import axios from "axios";

export default function OrderDetailsAdmin() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  // Redirect to login if user is not admin
  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard/login");
    }
  }, [user, loading, navigate]);

  // Redirect if no order data
  useEffect(() => {
    if (!loading && !order) {
      toast.error("No order data found.");
      navigate("/admin/manage-orders");
    }
  }, [order, loading, navigate]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });

      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        // Update the order data in state if needed
        // For now, just show success message
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="main-card">
          <p>Order not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="order-details-container">
        <div className="order-details-header">
          <button
            className="back-btn"
            onClick={() => navigate("/admin/manage-orders")}
          >
            ← Back to Orders
          </button>
          <h1>Order Details</h1>
        </div>

        <div className="order-details-content">
          {/* Order Summary Card */}
          <div className="order-summary-card">
            <div className="order-summary-header">
              <h2>Order #{order._id.slice(-6)}</h2>
              <div className="order-badges">
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
              <div className="order-info-item">
                <label>Customer Email:</label>
                <span>{order.user?.email || "N/A"}</span>
              </div>
              <div className="order-info-item">
                <label>Order Date:</label>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="order-info-item">
                <label>Total Amount:</label>
                <span className="amount">${order.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="order-info-item">
                <label>Payment Method:</label>
                <span>Credit Card (Stripe)</span>
              </div>
            </div>

            {/* Status Update Section */}
            <div className="status-update-section">
              <label htmlFor="status-select">Update Order Status:</label>
              <select
                id="status-select"
                value={order.orderStatus || "pending"}
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                className="status-select-large"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Shipping Information */}
          {order.shippingAddress && (
            <div className="shipping-card">
              <h3>Shipping Details</h3>
              <div className="address-details">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p>Phone: {order.shippingAddress.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="order-items-card">
            <h3>Order Items ({order.items?.length || 0})</h3>
            <div className="order-items-list">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="order-item-detail">
                    <div className="item-image">
                      <img
                        src={item.product?.image || "/placeholder-image.jpg"}
                        alt={item.product?.name || "Product"}
                      />
                    </div>
                    <div className="item-info">
                      <h4>{item.product?.name || "Product Name"}</h4>
                      <p className="item-description">
                        {item.product?.description ||
                          "No description available"}
                      </p>
                      <div className="item-details">
                        <span className="item-price">
                          ${item.price?.toFixed(2)}
                        </span>
                        <span className="item-quantity">
                          Qty: {item.quantity}
                        </span>
                        <span className="item-total">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No items found in this order.</p>
              )}
            </div>
          </div>

          {/* Order Total Breakdown */}
          <div className="order-total-card">
            <h3>Order Summary</h3>
            <div className="total-breakdown">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>${((order.totalAmount || 0) * 0.9).toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Shipping:</span>
                <span>$5.00</span>
              </div>
              <div className="total-line">
                <span>Tax:</span>
                <span>${((order.totalAmount || 0) * 0.1 - 5).toFixed(2)}</span>
              </div>
              <div className="total-line total-final">
                <span>Total:</span>
                <span>${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
