const User = require("../models/userModels");
const Product = require("../models/productModels");

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product already exists in cart
    const existingCartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingCartItem) {
      // Update quantity if product already in cart
      existingCartItem.quantity += parseInt(quantity);
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity: parseInt(quantity),
      });
    }

    await user.save();

    // Populate cart with product details for response
    await user.populate("cart.product");

    res.status(200).json({
      message: "Item added to cart successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      cart: user.cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.quantity = parseInt(quantity);
    await user.save();

    await user.populate("cart.product");

    res.status(200).json({
      message: "Cart item updated successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();
    await user.populate("cart.product");

    res.status(200).json({
      message: "Item removed from cart successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    await user.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
