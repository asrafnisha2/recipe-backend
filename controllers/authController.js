const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account is inactive",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("favorites");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      name,
      phone,
      profileImage,
      address,
      preferences,
      notificationsEnabled,
    } = req.body;

   

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage.trim();
    }

   
    if (address) {
      user.address = {
        street:
          address.street !== undefined
            ? address.street.trim()
            : user.address?.street || "",

        city:
          address.city !== undefined
            ? address.city.trim()
            : user.address?.city || "",

        state:
          address.state !== undefined
            ? address.state.trim()
            : user.address?.state || "",

        pincode:
          address.pincode !== undefined
            ? address.pincode.trim()
            : user.address?.pincode || "",

        country:
          address.country !== undefined
            ? address.country.trim()
            : user.address?.country || "India",
      };
    }


    if (preferences) {
      if (
        preferences.dietaryPreference !== undefined
      ) {
        const allowedDietaryPreferences = [
          "",
          "Vegetarian",
          "Non-Vegetarian",
          "Vegan",
          "Healthy",
        ];

        if (
          !allowedDietaryPreferences.includes(
            preferences.dietaryPreference
          )
        ) {
          return res.status(400).json({
            message: "Invalid dietary preference",
          });
        }
      }

      user.preferences = {
        favoriteCategory:
          preferences.favoriteCategory !== undefined
            ? preferences.favoriteCategory
            : user.preferences?.favoriteCategory || "",

        dietaryPreference:
          preferences.dietaryPreference !== undefined
            ? preferences.dietaryPreference
            : user.preferences?.dietaryPreference || "",
      };
    }

    

    if (
      notificationsEnabled !== undefined
    ) {
      user.notificationsEnabled =
        Boolean(notificationsEnabled);
    }

    await user.save();

    const updatedUser = await User.findById(
      user._id
    )
      .select("-password")
      .populate("favorites");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isCurrentPasswordCorrect =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const isSamePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (isSamePassword) {
      return res.status(400).json({
        message:
          "New password must be different from current password",
      });
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).populate("favorites");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      favorites: user.favorites || [],
    });
  } catch (error) {
    console.error(
      "Get favorites error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};



const addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const user = await User.findById(
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyFavorite =
      user.favorites.some(
        (id) => id.toString() === recipeId
      );

    if (alreadyFavorite) {
      return res.status(400).json({
        message:
          "Recipe already in favorites",
      });
    }

    user.favorites.push(recipeId);

    await user.save();

    res.status(200).json({
      message: "Added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error(
      "Add favorite error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};



const removeFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const user = await User.findById(
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.favorites =
      user.favorites.filter(
        (id) =>
          id.toString() !== recipeId
      );

    await user.save();

    res.status(200).json({
      message: "Removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error(
      "Remove favorite error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  getFavorites,
  addFavorite,
  removeFavorite,
};
