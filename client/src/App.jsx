import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing pages
import Register from "../pages/Register";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Cart from "../pages/Cart";
import AdminLogin from "../pages/adminPages/AdminLogin";
import EditProduct from "../pages/adminPages/EditProduct";
import Checkout from "../pages/Checkout";
import OrderHistory from "../pages/OrderHistory";
import AccountSettings from "../pages/AccountSettings";
import ManageOrders from "../pages/ManageOrders";
import OrderDetailsAdmin from "../pages/adminPages/OrderDetailsAdmin";

import { UserContextProvider } from "../context/userContext";
import { CartContextProvider } from "../context/cartContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <UserContextProvider>
      <CartContextProvider>
        <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/login" element={<AdminLogin />} />
            <Route
              path="/dashboard/edit-product/:id"
              element={<EditProduct />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/admin/manage-orders" element={<ManageOrders />} />
            <Route
              path="/order-details-admin"
              element={<OrderDetailsAdmin />}
            />
          </Routes>
        </Router>
      </CartContextProvider>
    </UserContextProvider>
  );
}

export default App;
