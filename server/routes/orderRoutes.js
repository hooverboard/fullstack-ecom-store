const express = require("express");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.use(userAuthMiddleware);

router.post("/orders", createOrder);
router.get("/user-orders", getUserOrders);
router.get("/all-orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;
