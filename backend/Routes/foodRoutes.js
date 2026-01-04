const express = require("express");
const router = express.Router();
const {
  analyzeBarcode,
  analyzeFood,
  saveFoodEntry,
} = require("../Controllers/foodController");
const auth = require("../Middlewares/auth");

// Barcode
router.get("/barcode/:code", auth, analyzeBarcode);

// Unified Food Analysis (Image or Text)
router.post("/analyze-food", auth, analyzeFood);

// Legacy routes redirected (optional, or just remove them)
router.post("/analyze-image", auth, analyzeFood);
router.post("/analyze-text", auth, analyzeFood);

// Save Entry
router.post("/save", auth, saveFoodEntry);

module.exports = router;
