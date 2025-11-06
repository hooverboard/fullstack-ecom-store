const Order = require("../models/orderModels");
const Product = require("../models/productModels");

async function createOrder(req, res) {
  const {
    firstName,
    lastName,
    address,
    city,
    zip,
    country,
    items,
    total,
    state,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !address ||
    !city ||
    !zip ||
    !country ||
    !items ||
    !total ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      message: "All fields are required and items must be a non-empty array",
    });
  }

  try {
    // Transform cart items to order items with priceAtPurchase
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product._id || item.product);
      if (!product) {
        return res.status(400).json({
          message: `Product not found: ${item.product._id || item.product}`,
        });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount: total,
      paymentStatus: "paid", // Explicitly set payment status to paid
      shippingAddress: {
        fullName: `${firstName} ${lastName}`,
        street: address,
        city: city,
        zipCode: zip, // Fixed: was zipcode, now zipCode
        country: country,
        state: state,
      },
      shippingMethod: "standard",
      shippingCost: 5.0,
    });

    console.log(
      "🔍 DEBUG: Order created with paymentStatus:",
      order.paymentStatus
    );
    console.log("🔍 DEBUG: Full order object:", JSON.stringify(order, null, 2));

    return res
      .status(200)
      .json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Error creating order" });
  }
}

async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    console.log("Error fetching user orders:", error);
    return res.status(500).json({ message: "Error fetching user orders" });
  }
}

async function getAllOrders(req, res) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    // Filter orders from last 30 days
    const recentOrders = orders.filter(
      (order) => order.createdAt >= thirtyDaysAgo
    );

    return res.status(200).json({
      orders,
      analytics: {
        totalSales: recentOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        ),
        totalOrders: recentOrders.length,
        averageOrderValue:
          recentOrders.length > 0
            ? recentOrders.reduce((sum, order) => sum + order.totalAmount, 0) /
              recentOrders.length
            : 0,
      },
    });
  } catch (error) {
    console.log("Error fetching all orders:", error);
    return res.status(500).json({ message: "Error fetching all orders" });
  }
}

async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { orderStatus } = req.body;

  // Validate order status
  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(orderStatus)) {
    return res.status(400).json({
      message:
        "Invalid order status. Valid statuses are: " + validStatuses.join(", "),
    });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is admin (you may need to add admin role check here)
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }

    order.orderStatus = orderStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Error updating order status" });
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
