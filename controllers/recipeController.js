const Recipe = require("../models/Recipe");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "tastynest/recipes",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};




const addRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      category,
      cookingTime,
      servings,
      spiceLevel,
      dietaryType,
      calories,
      price,
      featured,
      trending,
    } = req.body;


    
    if (
      !title ||
      !description ||
      !ingredients ||
      !instructions ||
      !category
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }


 
    if (!req.file) {
      return res.status(400).json({
        message: "Recipe image is required",
      });
    }



    const uploadedImage = await uploadToCloudinary(
      req.file.buffer
    );


  
    const recipe = await Recipe.create({
      title: title.trim(),

      description: description.trim(),

      ingredients: Array.isArray(ingredients)
        ? ingredients
        : [ingredients],

      instructions: instructions.trim(),

      category: category.trim(),

      image: uploadedImage.secure_url,

      cookingTime: Number(cookingTime) || 30,

      servings: Number(servings) || 4,

      spiceLevel: spiceLevel || "Medium",

      dietaryType:
        dietaryType || "Vegetarian",

      calories:
        Number(calories) || 0,

      price:
        Number(price) || 0,

      featured:
        featured === "true" ||
        featured === true,

      trending:
        trending === "true" ||
        trending === true,

      createdBy: req.user.userId,
    });



    res.status(201).json({
      message: "Recipe added successfully",
      recipe,
    });

  } catch (error) {

    console.error(
      "Add recipe error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



const getAllRecipes = async (req, res) => {
  try {

    const {
      search,
      category,
    } = req.query;

    let filter = {};


   
    if (search) {

      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },

        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];

    }


    if (
      category &&
      category !== "All"
    ) {

      filter.category = {
        $regex: `^${category}$`,
        $options: "i",
      };

    }


    const recipes = await Recipe.find(filter)
      .populate(
        "createdBy",
        "name email"
      )
      .sort({
        createdAt: -1,
      });


    res.status(200).json({
      count: recipes.length,
      recipes,
    });

  } catch (error) {

    console.error(
      "Get recipes error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



const getRecipeById = async (req, res) => {
  try {

    const recipe =
      await Recipe.findById(
        req.params.id
      ).populate(
        "createdBy",
        "name email"
      );


    if (!recipe) {

      return res.status(404).json({
        message: "Recipe not found",
      });

    }


    res.status(200).json(recipe);

  } catch (error) {

    console.error(
      "Get recipe error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



const updateRecipe = async (req, res) => {
  try {

    const recipe =
      await Recipe.findById(
        req.params.id
      );


    if (!recipe) {

      return res.status(404).json({
        message: "Recipe not found",
      });

    }


    if (
      recipe.createdBy.toString() !==
      req.user.userId
    ) {

      return res.status(403).json({
        message:
          "You can only update your own recipes",
      });

    }


    const updatedRecipe =
      await Recipe.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );


    res.status(200).json({
      message:
        "Recipe updated successfully",

      recipe: updatedRecipe,
    });

  } catch (error) {

    console.error(
      "Update recipe error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};




const deleteRecipe = async (req, res) => {
  try {

    const recipe =
      await Recipe.findById(
        req.params.id
      );


    if (!recipe) {

      return res.status(404).json({
        message: "Recipe not found",
      });

    }


    if (
      recipe.createdBy.toString() !==
      req.user.userId
    ) {

      return res.status(403).json({
        message:
          "You can only delete your own recipes",
      });

    }


    await Recipe.findByIdAndDelete(
      req.params.id
    );


    res.status(200).json({
      message:
        "Recipe deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete recipe error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



module.exports = {
  addRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};