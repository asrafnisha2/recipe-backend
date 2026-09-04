const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    // =========================================================
    // BASIC RECIPE DETAILS
    // =========================================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================================================
    // INGREDIENTS
    // =========================================================

    ingredients: {
      type: [String],
      required: true,
    },

    // =========================================================
    // COOKING INSTRUCTIONS
    // =========================================================

    instructions: {
      type: String,
      required: true,
    },

    // =========================================================
    // CATEGORY
    // =========================================================

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================================================
    // IMAGE
    // =========================================================

    image: {
      type: String,
      default: "",
    },

    // =========================================================
    // COOKING INFORMATION
    // =========================================================

    cookingTime: {
      type: Number,
      default: 30,
    },

    servings: {
      type: Number,
      default: 4,
    },

    spiceLevel: {
      type: String,
      enum: ["Mild", "Medium", "Spicy"],
      default: "Medium",
    },

    // =========================================================
    // DIET INFORMATION
    // =========================================================

    dietaryType: {
      type: String,
      enum: [
        "Vegetarian",
        "Non-Vegetarian",
        "Vegan",
        "Healthy",
      ],
      default: "Vegetarian",
    },

    calories: {
      type: Number,
      default: 0,
    },

    // =========================================================
    // PRICE
    // =========================================================

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =========================================================
    // RATINGS
    // =========================================================

    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    // =========================================================
    // RECIPE STATUS
    // =========================================================

    featured: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    // =========================================================
    // VIEWS
    // =========================================================

    views: {
      type: Number,
      default: 0,
    },

    // =========================================================
    // CREATED BY
    // =========================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);
