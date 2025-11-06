const express = require("express");
const {
  createProduct,
  getAllProducts,
  editProduct,
  deleteProduct,
} = require("../controllers/productController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Product routes
router.post("/create", authMiddleware, createProduct);
router.get("/all", getAllProducts);
router.delete("/delete/:id", authMiddleware, deleteProduct);
router.put("/edit/:id", authMiddleware, editProduct);

module.exports = router;
