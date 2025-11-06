import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/userContext";
import "../src/App.css";
import toast from "react-hot-toast";
import axios from "axios";

export default function ManageOrders() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  //Store Sales Analytics
  const [sales, setSales] = useState(0);
  const [averageOrder, setAverageOrder] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const navigate = useNavigate();

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

  // TODO: Fetch all orders from backend
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await axios.get("/api/all-orders");
        setOrders(response.data.orders);
        setSales(response.data.analytics.totalSales);
        setAverageOrder(response.data.analytics.averageOrderValue);
        setTotalOrders(response.data.analytics.totalOrders);
      } catch (error) {
        console.error("Error fetching all orders:", error);
        toast.error("Failed to fetch orders");
      }
    };

    if (!loading && user && user.role === "admin") {
      fetchAllOrders();
    }
  }, [loading, user]);

  const getFilteredOrders = () => {
    if (!searchTerm.trim()) {
      return orders;
    }

    const searchLower = searchTerm.toLowerCase();

    return orders.filter((order) => {
      const orderIdMatch = order._id.toLowerCase().includes(searchLower);
      const emailMatch = order.user?.email?.toLowerCase().includes(searchLower);
      return orderIdMatch || emailMatch;
    });
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });

      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        // Update the local state
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  return (
    <div className="dashboard">
      <Navbar />
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your store operations from here</p>
        <button
          className="manage-products-btn"
          onClick={() => navigate("/dashboard")}
        >
          🛍️ Manage Products
        </button>
      </div>

      <div className="main-card">
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-icon sales-icon">
              <span>💰</span>
            </div>
            <div className="analytics-content">
              <h3 className="analytics-title">Total Sales</h3>
              <p className="analytics-value">${sales.toFixed(2)}</p>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-icon orders-icon">
              <span>📊</span>
            </div>
            <div className="analytics-content">
              <h3 className="analytics-title">Average Order</h3>
              <p className="analytics-value">${averageOrder.toFixed(2)}</p>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-icon customers-icon">
              <span>👥</span>
            </div>
            <div className="analytics-content">
              <h3 className="analytics-title">Total Orders</h3>
              <p className="analytics-value">{totalOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="orders-section">
        <div className="orders-header">
          <h2 className="section-title">
            All Orders ({getFilteredOrders().length}
            {searchTerm ? ` of ${orders.length}` : ""})
          </h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by Order ID or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {getFilteredOrders().length > 0 ? (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredOrders().map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{order.user?.email || "N/A"}</td>
                    <td>${order.totalAmount?.toFixed(2)}</td>
                    <td>
                      <span
                        className={`status-badge payment-${order.paymentStatus}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.orderStatus || "pending"}
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <button
                        className="view-details-btn"
                        onClick={() =>
                          navigate("/order-details-admin", { state: { order } })
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-orders-message">
            <p>No orders found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
