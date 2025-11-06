import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../src/css/Home.css";
import StoreProduct from "../components/StoreProduct";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Attempting to fetch products...");
        const response = await axios.get("/api/products/all");
        console.log("Response received:", response);
        setProducts(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  console.log(products);
  return (
    <div className="home-page">
      <Navbar />

      {/* Store Banner  & Banner Overlay*/}
      <img
        src="/images/banner.jpg"
        alt="Store Banner"
        className="store-banner"
      />

      <div className="banner-ad">
        <h2>DJI Mini Pro 4</h2>
        <button>Shop Now</button>
      </div>

      <div className="browse-categories">
        <h1>Browse by category</h1>
        <div className="categories">
          <button>Phones</button>
          <button>Tablets</button>
          <button>Accessories</button>
          <button>Music</button>
          <button>TVs</button>
          <button>Monitors</button>
          <button>Gaming</button>
        </div>
      </div>

      <div className="featured-product">
        <div className="featured-content">
          <h1>
            Enhance Your Music <br />
            Experience
          </h1>

          <span className="countdown-timer">
            <span>DD</span>
            <span>HH</span>
            <span>MM</span>
            <span>SS</span>
          </span>

          <button className="featured-product-btn">Check It Out</button>
        </div>

        <div className="featured-image">
          <img src="/images/iphone-17-blue-nobg.png" alt="iPhone 17 blue" />
        </div>
      </div>

      <div className="explore-products">
        <h2>Explore our products</h2>
        <div className="products-grid">
          {/* map over products here */}
          {products.slice(0, 8).map((product) => (
            <StoreProduct
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
        <button className="view-all-button">Ver Todos</button>
      </div>
    </div>
  );
}
