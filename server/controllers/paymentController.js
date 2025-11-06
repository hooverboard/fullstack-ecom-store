const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orderModels");
const User = require("../models/userModels");

// create payment intent
async function createPaymentIntent(req, res) {
  try {
    const { orderId, amount } = req.body;

    //payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
      currency: "brl",
      metadata: {
        orderId: orderId,
        userId: req.user.id,
      },
    });

    // Update the order with the payment intent ID
    await Order.findByIdAndUpdate(orderId, {
      stripePaymentIntentId: paymentIntent.id,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Error creating payment intent" });
  }
}

//Handle stripe webhook
const handleWebHook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    console.log("Webhook signature verification failed.", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;

      console.log("🎉 Payment succeeded! Payment Intent ID:", paymentIntent.id);
      console.log(
        "📝 Looking for order with stripePaymentIntentId:",
        paymentIntent.id
      );

      // Update order status
      const updatedOrder = await Order.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        {
          paymentStatus: "paid",
          orderStatus: "confirmed",
        },
        { new: true }
      );

      if (updatedOrder) {
        console.log("✅ Order updated successfully:", updatedOrder._id);
      } else {
        console.log(
          "❌ No order found with payment intent ID:",
          paymentIntent.id
        );
      }

      // Clear user's cart
      const userId = paymentIntent.metadata.userId;
      await User.findByIdAndUpdate(userId, { cart: [] });

      console.log("🛒 Cart cleared for user:", userId);
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;

      console.log("❌ Payment failed! Payment Intent ID:", failedPayment.id);

      const failedOrder = await Order.findOneAndUpdate(
        { stripePaymentIntentId: failedPayment.id },
        { paymentStatus: "failed" },
        { new: true }
      );

      if (failedOrder) {
        console.log("📝 Order marked as failed:", failedOrder._id);
      } else {
        console.log("❌ No order found for failed payment:", failedPayment.id);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = {
  createPaymentIntent,
  handleWebHook,
};
