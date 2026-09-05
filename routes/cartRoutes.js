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

router.post("/", protect, addToCart);

router.get("/", protect, getCart);

router.put("/:recipeId", protect, updateCartItem);

router.delete("/:recipeId", protect, removeFromCart);

router.delete("/", protect, clearCart);

module.exports = router;
