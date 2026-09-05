const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);



router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);



router.put(
  "/change-password",
  authMiddleware,
  changePassword
);



router.get(
  "/favorites",
  authMiddleware,
  getFavorites
);

router.post(
  "/favorites/:recipeId",
  authMiddleware,
  addFavorite
);

router.delete(
  "/favorites/:recipeId",
  authMiddleware,
  removeFavorite
);

module.exports = router;