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


router.get("/", getAllRecipes);

router.get("/:id", getRecipeById);



router.post(
  "/",
  protect,
  upload.single("image"),
  addRecipe
);

router.put(
  "/:id",
  protect,
  updateRecipe
);

router.delete(
  "/:id",
  protect,
  deleteRecipe
);

module.exports = router;