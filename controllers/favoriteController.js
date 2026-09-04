const User = require("../models/User");
const Recipe = require("../models/Recipe");

// ================= ADD FAVORITE =================
const addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    const user = await User.findById(req.user.userId);

    if (user.favorites.includes(recipeId)) {
      return res.status(400).json({
        message: "Recipe already in favorites",
      });
    }

    user.favorites.push(recipeId);
    await user.save();

    res.status(200).json({
      message: "Recipe added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Add favorite error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= REMOVE FAVORITE =================
const removeFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const user = await User.findById(req.user.userId);

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== recipeId
    );

    await user.save();

    res.status(200).json({
      message: "Recipe removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Remove favorite error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= GET FAVORITES =================
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("favorites");

    res.status(200).json({
      count: user.favorites.length,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
};