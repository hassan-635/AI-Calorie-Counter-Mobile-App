const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const FoodLog = require("../Models/FoodLog");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeBarcode = async (req, res) => {
  try {
    const code = req.params;
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v2/product/${code}.json`
    );

    if (response.data.status === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    const product = response.data.product;
    const foodData = {
      foodName: product.product_name || "Unknown Item",
      calories: product.nutriments["energy-kcal_100g"] || 0,
      nutrients: {
        protien: `${product.nutriments["protein_100g"] || 0}g`,
        fat: `${product.nutriments["fat_100g"] || 0}g`,
        carbs: `${product.nutriments["carbohydrates_100g"] || 0}g`,
      },
    };
    res.status(200).json({ foodData });
  } catch (error) {
    res.status(500).json({ message: "Barcode Scan Failed" });
  }
};

exports.analyzeImage = async (req, res) => {
  try {
    const { imageBase64, mode } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt =
      mode === "ocr"
        ? "Identify all food items in this document/page. Return only a JSON object with name, calories, protein, carbs, and fat for the first item found."
        : "Identify the food in this image. Estimate calories, protein, carbs, and fat for the serving size shown. Return as JSON.";

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
    ]);

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const foodData = JSON.parse(cleanJson);
    res.status(200).json({ foodData });
  } catch (error) {
    res.status(500).json({ message: "AI Analysis Failed" });
  }
};

exports.saveFoodEntry = async (req, res) => {
  try {
    const { foodName, calories, protein, carbs, fat, image, mealType } =
      req.body;
    const foodEntry = new FoodLog({
      userId: req.user.id,
      foodName,
      calories,
      nutrients: { protien, carbs, fat },
      image,
      mealType,
    });
    await foodEntry.save();
    res.status(200).json({ foodEntry });
  } catch (error) {
    res.status(500).json({ message: "Failed to save food entry" });
  }
};
