const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    console.log("Register Payload:", req.body); // <-- Log 1
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists:", email); // <-- Log 2
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    console.log("User Saved in MongoDB:", user); // <-- Log 3

    const token = { user: { id: user.id } };
    jwt.sign(
      token,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name } });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Login Attempt:", req.body); // <-- Log 4
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email); // <-- Log 5
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for:", email); // <-- Log 6
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    console.log("Login Successful:", user.email); // <-- Log 7
    const token = { user: { id: user.id } };
    jwt.sign(
      token,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name } });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
