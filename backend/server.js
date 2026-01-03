require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const foodRoutes = require("./Routes/foodRoutes");
const errorHandler = require("./Middlewares/error");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); //for limit of image handling a little bt more than usual
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// Routes Placeholders (Inhe baad mein fill karenge)
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
