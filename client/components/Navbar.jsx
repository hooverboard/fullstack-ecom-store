import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../src/css/Navbar.css"; // Import navbar styles
import "../src/css/Cart.css"; // Import cart styles for cart icon
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { CartContext } from "../context/cartContext";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const { getCartItemCount } = useContext(CartContext);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const cartItemCount = getCartItemCount();

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Left: Brand Name */}
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          eCom Shop
        </Link>
      </div>

      {/* Center: Store Navigation */}
      <div className="navbar-center">
        <Link className="navbar-link" to="/">
          Store
        </Link>
        {user && user.role === "admin" ? (
          <Link className="navbar-link" to="/admin/manage-orders">
            Admin Panel
          </Link>
        ) : null}
      </div>

      {/* Right: User Actions & Cart */}
      <div className="navbar-right">
        {!user ? (
          <>
            <Link className="navbar-link" to="/register">
              Register
            </Link>
            <Link className="navbar-link" to="/login">
              Login
            </Link>
          </>
        ) : (
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <button className="profile-button" onClick={toggleProfileDropdown}>
              <div className="profile-avatar">
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
              </div>
            </button>

            {isProfileDropdownOpen && (
              <div className="profile-dropdown">
                <Link
                  to="/order-history"
                  className="profile-dropdown-item"
                  onClick={closeProfileDropdown}
                >
                  Order History
                </Link>
                <Link
                  to="/account-settings"
                  className="profile-dropdown-item"
                  onClick={closeProfileDropdown}
                >
                  Account Settings
                </Link>
                <button
                  className="profile-dropdown-item logout-item"
                  onClick={() => {
                    logout();
                    closeProfileDropdown();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        <Link to="/cart" className="cart-icon-button">
          <svg
            className="cart-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8.5m-8.5 0a2 2 0 100 4 2 2 0 000-4zm8.5 0a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          {/* Cart badge - will show item count when implemented */}
          <span className="cart-badge">{cartItemCount}</span>
        </Link>
      </div>
    </nav>
  );
}
