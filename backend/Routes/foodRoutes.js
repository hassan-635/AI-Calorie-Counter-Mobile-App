const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
const {
  analyzeBarcode,
  analyzeImage,
  saveFoodEntry,
} = require("../Controllers/foodController");

router.get("/barcode/:code", auth, analyzeBarcode);
router.post("/analyze-image", auth, analyzeImage);
router.post("/save", auth, saveFoodEntry);

module.exports = router;
