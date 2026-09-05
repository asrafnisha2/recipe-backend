const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {


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

    
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    

    profileImage: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

  

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

    

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],

   

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

  

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    

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