const express = require("express");

const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require("../controllers/favoriteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getFavorites);

router.post("/:recipeId", protect, addFavorite);

router.delete("/:recipeId", protect, removeFavorite);

module.exports = router;