const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC DETAILS
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // =====================================================
    // ROLE
    // =====================================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // =====================================================
    // PROFILE
    // =====================================================

    profileImage: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================================
    // ADDRESS
    // =====================================================

    address: {
      street: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "India",
      },
    },

    // =====================================================
    // FAVORITES
    // =====================================================

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],

    // =====================================================
    // FOOD PREFERENCES
    // =====================================================

    preferences: {
      favoriteCategory: {
        type: String,
        default: "",
      },

      dietaryPreference: {
        type: String,

        enum: [
          "",
          "Vegetarian",
          "Non-Vegetarian",
          "Vegan",
          "Healthy",
        ],

        default: "",
      },
    },

    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    // =====================================================
    // ACCOUNT STATUS
    // =====================================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "User",
    userSchema
  );