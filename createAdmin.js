const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = "admin@gmail.com";
    const password = "admin123";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      existingAdmin.role = "admin";
      existingAdmin.password = await bcrypt.hash(password, 10);
      existingAdmin.isActive = true;

      await existingAdmin.save();

      console.log("Existing user converted to admin");
      console.log("Email:", email);
      console.log("Password:", password);

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "TasteNest Admin",
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Password:", password);
    console.log("Role:", admin.role);

    process.exit(0);
  } catch (error) {
    console.error("Admin creation error:", error);
    process.exit(1);
  }
};

createAdmin();