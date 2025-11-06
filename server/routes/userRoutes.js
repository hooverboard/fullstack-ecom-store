const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authControllers");

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);

module.exports = router;
