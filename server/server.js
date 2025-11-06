const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Load environment variables FIRST
dotenv.config();

// imported routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { handleWebHook } = require("./controllers/paymentController");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both ports
  })
);

// Stripe webhook needs raw body, so handle it BEFORE json parsing
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  handleWebHook
);

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//routes

app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.get("/", (req, res) => {
  res.send("API is running");
});

//connect to database
console.log("Attempting to connect to MongoDB...");
console.log(
  "MongoDB URI:",
  process.env.MONGO_URI ? "URI exists" : "URI missing"
);

// Add connection options to handle timeouts and retries
const mongoOptions = {
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
  maxPoolSize: 10,
  retryWrites: true,
  w: "majority",
};

mongoose
  .connect(process.env.MONGO_URI, mongoOptions)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("❌ MongoDB connection error:", error.message);
    console.log("Full error:", error);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server runnning @ ", PORT);
});
