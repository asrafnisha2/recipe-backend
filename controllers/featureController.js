const Recipe = require("../models/Recipe");
const Review = require("../models/reviewModel");
const Notification = require("../models/notificationModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/User");

// =========================================================
// VIEW RECIPE
// =========================================================

const viewRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.json({
      recipe,
    });
  } catch (error) {
    console.error("View recipe error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================================================
// GET REVIEWS
// =========================================================

const getReviews = async (req, res) => {
  try {
    const mongoose = require("mongoose");

    const reviews = await Review.find({
      recipe: req.params.id,
    })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    const aggregate = await Review.aggregate([
      {
        $match: {
          recipe: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      reviews,
      summary: {
        rating: aggregate[0]?.avg || 0,
        count: aggregate[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================================================
// CREATE / UPDATE REVIEW
// =========================================================

const upsertReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment?.trim()) {
      return res.status(400).json({
        message: "Rating and comment are required",
      });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    const review = await Review.findOneAndUpdate(
      {
        user: req.user.userId,
        recipe: req.params.id,
      },
      {
        rating: Number(rating),
        comment: comment.trim(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).populate("user", "name profileImage");

    const aggregate = await Review.aggregate([
      {
        $match: {
          recipe: recipe._id,
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    recipe.rating = Number((aggregate[0]?.avg || 0).toFixed(1));
    recipe.ratingCount = aggregate[0]?.count || 0;

    await recipe.save();

    res.json({
      message: "Review saved",
      review,
      summary: {
        rating: recipe.rating,
        count: recipe.ratingCount,
      },
    });
  } catch (error) {
    console.error("Upsert review error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already reviewed this recipe",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================================================
// GET NOTIFICATIONS
// =========================================================

const getNotifications = async (req, res) => {
  try {
    const items = await Notification.find({
      user: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      notifications: items,
      unread: items.filter((item) => !item.isRead).length,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================================================
// MARK NOTIFICATIONS AS READ
// =========================================================

const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.json({
      message: "Notifications marked as read",
    });
  } catch (error) {
    console.error("Mark notifications read error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================================================
// CREATE ORDER
// =========================================================

const createOrder = async (req, res) => {
  try {
    const {
      deliveryAddress,
      phone,
      paymentMethod = "UPI",
    } = req.body;

    // Get logged-in user's cart
    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    // Check cart
    if (!cart || !cart.items.length) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Check delivery details
    if (!deliveryAddress || !phone) {
      return res.status(400).json({
        message: "Delivery details are required",
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user.userId,

      items: cart.items.map((item) => ({
        recipe: item.recipe,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),

      totalAmount: cart.totalAmount,

      paymentMethod,

      paymentStatus:
        paymentMethod === "COD"
          ? "Pending"
          : "Paid",

      orderStatus: "Confirmed",

      deliveryAddress,

      phone,
    });

    // Clear cart after successful order
    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    // Create notification
    await Notification.create({
      user: req.user.userId,

      type: "order",

      title: "Order placed",

      message: `Order #${order._id
        .toString()
        .slice(-8)} has been placed successfully.`,

      referenceId: order._id,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
};

// =========================================================
// GET ORDERS
// =========================================================

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    })
      .populate("items.recipe", "title image")
      .sort({ createdAt: -1 });

    res.json({
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================================================
// GET RECOMMENDATIONS
// =========================================================

const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    const preferred =
      user?.preferences?.favoriteCategory;

    let query = {};

    if (preferred) {
      query.category = new RegExp(preferred, "i");
    }

    let recipes = await Recipe.find(query)
      .sort({
        featured: -1,
        trending: -1,
        rating: -1,
        views: -1,
      })
      .limit(8);

    if (recipes.length < 4) {
      recipes = await Recipe.find({})
        .sort({
          rating: -1,
          views: -1,
        })
        .limit(8);
    }

    res.json({
      recipes,
    });
  } catch (error) {
    console.error("Get recommendations error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================================================
// ADMIN STATS
// =========================================================

const adminStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const [
      users,
      recipes,
      orders,
      revenueData,
    ] = await Promise.all([
      User.countDocuments(),

      Recipe.countDocuments(),

      Order.countDocuments(),

      Order.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),
    ]);

    const popular = await Recipe.find({})
      .sort({
        views: -1,
        rating: -1,
      })
      .limit(5)
      .select("title views rating");

    res.json({
      stats: {
        users,
        recipes,
        orders,
        revenue: revenueData[0]?.total || 0,
      },

      popular,
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  viewRecipe,
  getReviews,
  upsertReview,
  getNotifications,
  markNotificationsRead,
  createOrder,
  getOrders,
  getRecommendations,
  adminStats,
};