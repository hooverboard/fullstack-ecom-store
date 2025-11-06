import Navbar from "../components/Navbar";
import "../src/css/Auth.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/userContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { email, password } = form;
    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });

      console.log("Response from backend:", data);
      // Use the login function from UserContext to set user and clear logout flag
      login(data);
      navigate("/");
      toast.success("Login successful");
    } catch (error) {
      console.log("Error during login: ", error);
      toast.error("Login failed");
    }
  }

  return (
    <div className="auth-container">
      <Navbar />

      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="auth-input"
              placeholder="Enter your email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="auth-input"
              placeholder="Enter your password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to="/register">Create one here</Link>
        </div>
      </div>
    </div>
  );
}
