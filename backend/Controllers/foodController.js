const axios = require("axios");
const FoodLog = require("../Models/FoodLog");

const HF_TOKEN = process.env.HF_TOKEN;
const SPOON_KEY = process.env.SPOONACULAR_API_KEY;

// --- 1. BARCODE SCANNER (OpenFoodFacts - 100% Free) ---
exports.analyzeBarcode = async (req, res) => {
  try {
    const { code } = req.params; // Postman: /api/food/barcode/3017620422003

    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v2/product/${code}.json`
    );

    if (!response.data || response.data.status === 0) {
      return res
        .status(404)
        .json({ message: "Product not found in Barcode database" });
    }

    const product = response.data.product;

    // Data extract kar rahe hain
    const result = {
      foodName: product.product_name || "Unknown Item",
      calories: product.nutriments["energy-kcal_100g"] || 0,
      nutrients: {
        protein: `${product.nutriments.proteins_100g || 0}g`,
        fat: `${product.nutriments.fat_100g || 0}g`,
        carbs: `${product.nutriments.carbohydrates_100g || 0}g`,
      },
      source: "Barcode",
    };

    res.status(200).json(result);
  } catch (err) {
    console.error("Barcode Error:", err.message);
    res.status(500).json({ message: "Barcode Scan Failed" });
  }
};

// --- HELPER: Spoonacular Nutrition (For Image & Text) ---
const fetchNutritionFromSpoonacular = async (foodName) => {
  try {
    const searchRes = await axios.get(
      `https://api.spoonacular.com/api/food/ingredients/search?query=${encodeURIComponent(
        foodName
      )}&apiKey=${SPOON_KEY}`
    );

    if (!searchRes.data.results || searchRes.data.results.length === 0)
      return null;

    const foodId = searchRes.data.results[0].id;
    const nutritionRes = await axios.get(
      `https://api.spoonacular.com/api/food/ingredients/${foodId}/information?amount=100&unit=grams&apiKey=${SPOON_KEY}`
    );

    const nutrients = nutritionRes.data.nutrition?.nutrients || [];
    const getNutrient = (name) =>
      nutrients.find((n) => n.name === name)?.amount || 0;

    return {
      foodName: nutritionRes.data.name,
      calories: Math.round(getNutrient("Calories")),
      nutrients: {
        protein: `${Math.round(getNutrient("Protein"))}g`,
        fat: `${Math.round(getNutrient("Fat"))}g`,
        carbs: `${Math.round(getNutrient("Net Carbohydrates"))}g`,
      },
    };
  } catch (error) {
    return null;
  }
};

// --- 2. AI IMAGE ANALYSIS (HF + Spoonacular) ---
exports.analyzeImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(cleanBase64, "base64");

    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      imageBuffer,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/octet-stream",
        },
      }
    );

    const detectedFood = hfResponse.data[0].label.split(",")[0];
    const nutritionData = await fetchNutritionFromSpoonacular(detectedFood);

    res.status(200).json(
      nutritionData || {
        foodName: detectedFood,
        calories: 150,
        nutrients: { protein: "5g", fat: "5g", carbs: "15g" },
        note: "Estimated",
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Image Analysis Failed" });
  }
};

// --- 3. TEXT SEARCH ---
exports.analyzeText = async (req, res) => {
  try {
    const { query } = req.body;
    const data = await fetchNutritionFromSpoonacular(query);
    if (!data)
      return res.status(404).json({ message: "Nutrition data not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Text Search Failed" });
  }
};

// --- 4. SAVE ENTRY ---
exports.saveFoodEntry = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const foodEntry = new FoodLog({ ...req.body, userId: req.user.id });
    await foodEntry.save();
    res.status(200).json({ message: "Saved successfully", foodEntry });
  } catch (error) {
    res.status(500).json({ message: "Save failed" });
  }
};
