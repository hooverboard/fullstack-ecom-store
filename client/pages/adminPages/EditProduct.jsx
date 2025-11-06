import React from "react";
import "../../src/css/EditProduct.css";
import { useParams, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

export default function EditProduct() {
  const Navigate = useNavigate();
  const { user } = useContext(UserContext); // Get user context for JWT token

  // Extracting the product ID from the URL parameters
  const { id } = useParams();
  const { state } = useLocation();

  const [form, setForm] = useState({
    name: state?.name || "",
    description: state?.description || "",
    price: state?.price || "",
    image: state?.image || "",
  });

  async function handleEdit(e) {
    e.preventDefault();
    console.log("Edit button clicked, sending data:", form); // Debug log
    try {
      const response = await fetch(`/api/products/edit/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form), // Send the form data
      });

      console.log("Response status:", response.status); // Debug log

      if (response.ok) {
        const data = await response.json();
        toast.success("Product updated successfully");
        Navigate("/dashboard");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    }
  }

  async function handleDelete(e) {
    e.preventDefault();
    try {
      const deleteUrl = `/api/products/delete/${id}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        credentials: "include", // This sends cookies with the request
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        Navigate("/dashboard");
      } else {
        console.log("Response not ok, trying to parse error..."); // Debug log
        try {
          const errorData = await response.json();
          console.log("Error data:", errorData); // Debug log
          toast.error(errorData.message || "Failed to delete product");
        } catch (parseError) {
          console.log("Failed to parse error response:", parseError); // Debug log
          toast.error(`Delete failed with status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    }
  }
  return (
    <div className="edit-product-container">
      <button className="back-button" onClick={() => Navigate("/dashboard")}>
        &lt;
      </button>
      <h1 className="edit-product-title">Edit Product</h1>
      <form className="edit-product-form">
        <label className="edit-product-label">
          Product Name:
          <input
            className="edit-product-input"
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="edit-product-label">
          Price:
          <input
            className="edit-product-input"
            type="number"
            name="price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </label>
        <label className="edit-product-label">
          Description:
          <textarea
            className="edit-product-textarea"
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>
        </label>
        <label className="edit-product-label">
          Image URL:
          <input
            className="edit-product-input"
            type="url"
            name="image"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </label>
        <button className="edit-product-btn" onClick={handleEdit}>
          Update Product
        </button>
      </form>
      <div className="delete-product-form">
        <label className="edit-product-label">
          Delete Product:
          <button
            className="delete-product-btn"
            type="button"
            onClick={handleDelete}
          >
            Delete
          </button>
        </label>
      </div>
    </div>
  );
}
