const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
  

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

    

    ingredients: {
      type: [String],
      required: true,
    },

  

    instructions: {
      type: String,
      required: true,
    },

    
    category: {
      type: String,
      required: true,
      trim: true,
    },

 

    image: {
      type: String,
      default: "",
    },



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

    

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    

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

  

    featured: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },


    views: {
      type: Number,
      default: 0,
    },

 
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
