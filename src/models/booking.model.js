const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "pending"],
      default: "pending" // better to keep default pending until payment done
    },
    // 🔹 Payment details
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "refunded", "failed"],
      default: "unpaid"
    },
    amount: {
      type: Number,
      required: true
    },
    orderId: {
      type: String // Razorpay order_id
    },
    paymentId: {
      type: String // Razorpay payment_id
    },
    signature: {
      type: String // Razorpay signature for verification
    }
  }, 
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
