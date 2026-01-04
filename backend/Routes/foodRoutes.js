const express = require("express");
const router = express.Router();
const {
  analyzeBarcode,
  analyzeImage,
  analyzeText,
  saveFoodEntry,
} = require("../Controllers/foodController");
const auth = require("../Middlewares/auth");

// Barcode
router.get("/barcode/:code", auth, analyzeBarcode);

// Gemini (Image)
router.post("/analyze-image", auth, analyzeImage);

// Edamam (Text Search) - Isay lazmi add karein
router.post("/analyze-text", auth, analyzeText);

// Save Entry
router.post("/save", auth, saveFoodEntry);

module.exports = router;
