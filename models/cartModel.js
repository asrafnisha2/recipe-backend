const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    // =========================================================
    // USER
    // =========================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // =========================================================
    // CART ITEMS
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

        price: {
          type: Number,
          default: 0,
          min: 0,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
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
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
