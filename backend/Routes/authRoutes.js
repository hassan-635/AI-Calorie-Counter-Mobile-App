const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { register, login } = require("../Controllers/authController");

router.post("/signup", register);
router.post("/login", login);

module.exports = router;
