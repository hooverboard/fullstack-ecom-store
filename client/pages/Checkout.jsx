import React, { useState, useContext } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import stripePromise from "../src/utils/stripe";
import Navbar from "../components/Navbar";
import "../src/css/Checkout.css";
import { CartContext } from "../context/cartContext";
import axios from "axios";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const [processing, setProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Brazil",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert("Stripe hasn't loaded yet. Please try again.");
      return;
    }

    // Validate form
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "state",
      "zipCode",
    ];
    for (let field of requiredFields) {
      if (!form[field]) {
        alert(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return;
      }
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Create payment intent
      console.log("Creating payment intent...");
      const paymentResponse = await axios.post(
        "/api/payment/create-payment-intent",
        {
          amount: getCartTotal(),
        }
      );

      console.log("Payment intent created:", paymentResponse.data);

      // Step 2: Confirm payment with Stripe
      console.log("Confirming payment...");
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentResponse.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${form.firstName} ${form.lastName}`,
              email: form.email,
              address: {
                line1: form.street,
                city: form.city,
                state: form.state,
                postal_code: form.zipCode,
                country: "BR",
              },
            },
          },
        }
      );

      if (error) {
        console.error("Payment failed:", error);
        setProcessing(false);
        return;
      } else if (paymentIntent.status === "succeeded") {
        // Step 3: Create order only after payment succeeds
        console.log("Payment succeeded! Creating order...");
        const orderResponse = await axios.post("/api/orders", {
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.street,
          city: form.city,
          zip: form.zipCode,
          state: form.state,
          country: form.country,
          items: cartItems,
          total: getCartTotal(),
          paymentStatus: "paid", // Ensure paymentStatus is set
        });
        console.log("Order created:", orderResponse.data);
        setPaymentSucceeded(true);
        clearCart();
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setProcessing(false);
    }

    setProcessing(false);
  };

  if (paymentSucceeded) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-container">
          <div className="success-message">
            <h1>✅ Payment Successful!</h1>
            <p>
              Thank you for your order. You will receive an email confirmation
              shortly.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="place-order-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-content">
          {/* Order Summary Section */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.product._id} className="order-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="item-details">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total: R$ {getCartTotal().toFixed(2)}</strong>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="shipping-form-container">
            <h2>Shipping & Payment Information</h2>
            <form className="shipping-form" onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    required
                    onChange={handleChange}
                    value={form.firstName}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    required
                    onChange={handleChange}
                    value={form.lastName}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    onChange={handleChange}
                    value={form.email}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="street">Street Address *</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    placeholder="Enter your street address"
                    required
                    onChange={handleChange}
                    value={form.street}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter city"
                    required
                    onChange={handleChange}
                    value={form.city}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    placeholder="e.g., SP, RJ, MG"
                    required
                    onChange={handleChange}
                    value={form.state}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    placeholder="12345-678"
                    required
                    onChange={handleChange}
                    value={form.zipCode}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <select
                    id="country"
                    name="country"
                    required
                    onChange={handleChange}
                    value={form.country}
                  >
                    <option value="Brazil">Brazil</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Card Information */}
              <div className="form-group card-section">
                <label>Card Details *</label>
                <div className="card-element">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#333",
                          fontFamily: "Arial, sans-serif",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#e74c3c",
                          iconColor: "#e74c3c",
                        },
                        complete: {
                          color: "#28a745",
                        },
                      },
                      hidePostalCode: true, // Since you're collecting ZIP separately
                    }}
                  />
                </div>
                <small
                  style={{ color: "#666", marginTop: "8px", display: "block" }}
                >
                  For testing use: 4242 4242 4242 4242, any future expiry, any
                  CVV
                </small>
              </div>

              <button
                type="submit"
                className="place-order-btn"
                disabled={!stripe || processing}
              >
                {processing
                  ? "Processing..."
                  : `Pay R$ ${getCartTotal().toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Checkout component wrapped with Stripe Elements
export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
