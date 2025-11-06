const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    // snapshot the unit price at purchase time
    priceAtPurchase: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Order must have at least one item.",
      },
    },

    // derived in a pre-save hook from items + shippingCost
    totalAmount: { type: Number, required: true, min: 0 },

    // Stripe (or other PSP) linkage — keep unique if you won’t reuse ids in seed data
    stripePaymentIntentId: {
      type: String,
      sparse: true, // safer than unique during local seeding
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      complement: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: "Brazil" },
    },

    shippingMethod: {
      type: String,
      enum: ["standard", "express", "overnight"],
      default: "standard",
    },
    shippingCost: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Friendly order number
orderSchema.virtual("orderNumber").get(function () {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Compute total before save: sum(items) + shippingCost
orderSchema.pre("save", function (next) {
  const itemsTotal = this.items.reduce(
    (sum, it) => sum + it.quantity * it.priceAtPurchase,
    0
  );
  this.totalAmount = Number((itemsTotal + (this.shippingCost || 0)).toFixed(2));
  next();
});

// Light, pragmatic indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

orderSchema.methods.canBeCancelled = function () {
  return ["pending", "confirmed"].includes(this.orderStatus);
};

orderSchema.methods.canBeRefunded = function () {
  return (
    this.paymentStatus === "paid" &&
    ["confirmed", "processing", "shipped"].includes(this.orderStatus)
  );
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
