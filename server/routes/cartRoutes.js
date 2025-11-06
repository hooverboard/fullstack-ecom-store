const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartControllers");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

// All cart routes require authentication (but not admin)
router.use(userAuthMiddleware);

// GET /api/cart - Get user's cart
router.get("/", getCart);

// POST /api/cart - Add item to cart
router.post("/", addToCart);

// PUT /api/cart - Update cart item quantity
router.put("/", updateCartItem);

// DELETE /api/cart/:productId - Remove specific item from cart
router.delete("/:productId", removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete("/", clearCart);

module.exports = router;
