const express = require("express");
const router = express.Router();

const auth = require("../Middlewares/auth"); // Import Auth Middleware
const { register, login, getUser } = require("../Controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/user", auth, getUser); // Protected Route for Load User

module.exports = router;
