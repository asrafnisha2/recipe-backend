const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // =========================================================
    // USER
    // =========================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================================================
    // ORDER ITEMS
    // =========================================================

    items: [
      {
        recipe: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Recipe",
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        image: {
          type: String,
          default: "",
        },
      },
    ],

    // =========================================================
    // TOTAL
    // =========================================================

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // =========================================================
    // PAYMENT
    // =========================================================

    paymentMethod: {
      type: String,
      enum: ["UPI", "CARD", "COD"],
      default: "UPI",
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    paymentId: {
      type: String,
      default: "",
    },

    // =========================================================
    // ORDER STATUS
    // =========================================================

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    // =========================================================
    // DELIVERY DETAILS
    // =========================================================

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================================================
    // ORDER DATE
    // =========================================================

    orderedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
