import React from "react";
import Navbar from "../components/Navbar";
import OrderItem from "../components/OrderItem";
import "../src/css/OrderHistory.css";
import { useContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user-orders");
        setOrders(response.data.orders); // Fix: use .orders
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    console.log("Orders state updated:", orders);
  }, [orders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: "pending",
      paid: "paid",
      processing: "processing",
      shipped: "shipped",
      delivered: "delivered",
      cancelled: "cancelled",
    };
    return statusMap[status] || "pending";
  };

  return (
    <div>
      <Navbar />
      <div className="order-history-container">
        <h1 className="order-history-title">Order History</h1>

        {loading ? (
          <div className="empty-orders">
            <h3>Loading...</h3>
          </div>
        ) : error ? (
          <div className="empty-orders">
            <h3>{error}</h3>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <h3>No Orders Yet</h3>
            <p>
              You haven't placed any orders yet. Start shopping to see your
              order history here!
            </p>
            <a href="/" className="empty-orders-button">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-header-top">
                    <h2 className="order-number">Order #{order.orderNumber}</h2>
                    <span
                      className={`order-status ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="order-meta">
                    <div className="order-meta-item">
                      <span className="order-meta-label">Order Date</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="order-meta-item">
                      <span className="order-meta-label">Payment Status</span>
                      <span
                        className={`order-status ${getStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="order-meta-item">
                      <span className="order-meta-label">Shipping Address</span>
                      <span>
                        {order.address}, {order.city}, {order.state} {order.zip}
                      </span>
                    </div>
                    <div className="order-meta-item">
                      <span className="order-meta-label">Total Amount</span>
                      <span className="order-total">
                        R$ {(order.totalAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-items">
                  <h3 className="order-items-title">
                    Items ({order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"})
                  </h3>
                  <div className="order-items-list">
                    {order.items.map((item, index) => (
                      <OrderItem
                        key={`${order._id}-${item.product._id}-${index}`}
                        item={item}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
