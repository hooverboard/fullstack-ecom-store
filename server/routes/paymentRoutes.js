const express = require("express");
const { createPaymentIntent } = require("../controllers/paymentController");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

const router = express.Router();

// Protected route
router.post("/create-payment-intent", userAuthMiddleware, createPaymentIntent);

// Note: webhook is handled directly in server.js to avoid auth middleware

module.exports = router;
