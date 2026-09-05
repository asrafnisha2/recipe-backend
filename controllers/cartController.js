const Cart = require("../models/cartModel");
const Recipe = require("../models/Recipe");



const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({
      user: userId,
    }).populate("items.recipe");

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        totalAmount: 0,
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get cart",
      error: error.message,
    });
  }
};


const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { recipeId, quantity = 1 } = req.body;

    if (!recipeId) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID is required",
      });
    }

    const requestedQuantity = Number(quantity);

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    let cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        totalAmount: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.recipe &&
        item.recipe.toString() === recipeId
    );

    if (existingItem) {
      existingItem.quantity += requestedQuantity;
    } else {
      cart.items.push({
        recipe: recipe._id,
        title: recipe.title,
        price: recipe.price || 0,
        quantity: requestedQuantity,
        image: recipe.image || "",
      });
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );

    await cart.save();

    await cart.populate("items.recipe");

    res.status(200).json({
      success: true,
      message: "Recipe added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add recipe to cart",
      error: error.message,
    });
  }
};



const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { recipeId } = req.params;
    const { quantity } = req.body;

    const newQuantity = Number(quantity);

    if (
      !Number.isInteger(newQuantity) ||
      newQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (cartItem) =>
        cartItem.recipe &&
        cartItem.recipe.toString() === recipeId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found in cart",
      });
    }

    item.quantity = newQuantity;

    cart.totalAmount = cart.items.reduce(
      (total, cartItem) =>
        total +
        Number(cartItem.price || 0) *
          Number(cartItem.quantity || 0),
      0
    );

    await cart.save();

    await cart.populate("items.recipe");

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { recipeId } = req.params;

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        !item.recipe ||
        item.recipe.toString() !== recipeId
    );

    cart.totalAmount = cart.items.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );

    await cart.save();

    await cart.populate("items.recipe");

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove item",
      error: error.message,
    });
  }
};



const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};




module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
