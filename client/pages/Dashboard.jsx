import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Product from "../components/Product";
import { UserContext } from "../context/userContext";
import "../src/App.css"; // Import the main CSS file
import "../src/css/Product.css"; // Import product-specific CSS
import axios from "axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Redirect to login if user is not admin
  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      toast.error("Timed out, please login again");
      navigate("/dashboard/login");
    }
  }, [user, loading, navigate]);

  //usestate for form & change handling
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  //fetch user profile

  //fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("api/products/all");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //handle opening and closing the product form
  const handleAddProductClick = () => {
    setShowAddForm(!showAddForm);
  };

  //handle form submission for new product
  async function handleSubmit(e) {
    e.preventDefault();
    const { name, description, price, image } = form;
    try {
      console.log("Attempting to create product...");
      const { data } = await axios.post("/api/products/create", {
        name,
        description,
        price,
        image,
      });
      console.log("Product created successfully", data);
      toast.success("Product created successfully");
    } catch (error) {
      console.error("error creating product", error);
      toast.error("Error creating product");
    }
  }
  return (
    <div className="dashboard">
      <Navbar />
      <div className="welcome-message">
        <h1>Admin Dashboard</h1>
        <p>Manage your products and store from here.</p>
      </div>

      {/* Admin Actions Section */}
      <div className="admin-actions-section">
        <button className="admin-action-button" onClick={handleAddProductClick}>
          {showAddForm ? "Cancel" : "Add New Product"}
        </button>
      </div>

      {/* Add Product Section */}
      <div className="add-product-section">
        <div
          className={`add-product-form-container ${showAddForm ? "show" : ""}`}
        >
          <form className="add-product-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="productName" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                name="name"
                className="form-input"
                placeholder="Enter product name"
                required
                onChange={handleChange}
                value={form.name}
              />
            </div>

            <div className="form-group">
              <label htmlFor="productDescription" className="form-label">
                Description
              </label>
              <textarea
                id="productDescription"
                name="description"
                className="form-textarea"
                placeholder="Enter product description"
                required
                onChange={handleChange}
                value={form.description}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="productPrice" className="form-label">
                Price
              </label>
              <input
                type="number"
                id="productPrice"
                name="price"
                className="form-input"
                placeholder="Enter price (e.g., 29.99)"
                step="0.01"
                min="0"
                required
                onChange={handleChange}
                value={form.price}
              />
            </div>

            <div className="form-group">
              <label htmlFor="productImage" className="form-label">
                Image URL
              </label>
              <input
                type="url"
                id="productImage"
                name="image"
                className="form-input"
                placeholder="Enter image URL"
                required
                onChange={handleChange}
                value={form.image}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                Add Product
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={handleAddProductClick}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <h2 className="section-title">Your Products</h2>
        <div className="products-list">
          {products.length > 0 ? (
            products.map((product) => (
              <Product
                key={product._id || product.id}
                id={product._id || product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
              />
            ))
          ) : (
            <div className="no-products-message">
              <p>No products found. Add your first product above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
