const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");

// Add recipe to cart
router.post("/", protect, addToCart);

// Get user's cart
router.get("/", protect, getCart);

// Update cart item quantity
router.put("/:recipeId", protect, updateCartItem);

// Remove recipe from cart
router.delete("/:recipeId", protect, removeFromCart);

// Clear cart
router.delete("/", protect, clearCart);

module.exports = router;
