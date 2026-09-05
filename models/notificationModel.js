const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
  

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    
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



    title: {
      type: String,
      required: true,
      trim: true,
    },

   

    message: {
      type: String,
      required: true,
      trim: true,
    },

  

    isRead: {
      type: Boolean,
      default: false,
    },

  
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
