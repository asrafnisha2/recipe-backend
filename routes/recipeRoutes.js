const express = require("express");

const {
  addRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ================= PUBLIC =================

router.get("/", getAllRecipes);

router.get("/:id", getRecipeById);


// ================= PROTECTED =================

// Add recipe with image upload
router.post(
  "/",
  protect,
  upload.single("image"),
  addRecipe
);

// Update recipe
router.put(
  "/:id",
  protect,
  updateRecipe
);

// Delete recipe
router.delete(
  "/:id",
  protect,
  deleteRecipe
);

module.exports = router;