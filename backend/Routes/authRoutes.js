const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({
        message: "User logged in successfully",
        userId: user._id,
        name: user.name,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
