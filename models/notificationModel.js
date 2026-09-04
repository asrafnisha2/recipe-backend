const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
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
    // NOTIFICATION TYPE
    // =========================================================

    type: {
      type: String,
      enum: [
        "order",
        "payment",
        "recipe",
        "favorite",
        "system",
      ],
      default: "system",
    },

    // =========================================================
    // TITLE
    // =========================================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================================================
    // MESSAGE
    // =========================================================

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================================================
    // READ STATUS
    // =========================================================

    isRead: {
      type: Boolean,
      default: false,
    },

    // =========================================================
    // OPTIONAL REFERENCE
    // =========================================================

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);
