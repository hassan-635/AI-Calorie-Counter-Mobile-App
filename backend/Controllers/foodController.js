const FoodLog = require("../Models/FoodLog");

// controllers/foodController.js
exports.getUserLogs = async (req, res) => {
  try {
    const logs = await FoodLog.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 1. ANALYZE FOOD (Hugging Face API)
const axios = require("axios");

// Simple nutritional database for common foods
const nutritionDatabase = {
  // Format: { calories, protein, carbs, fat }
  apple: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  pizza: { calories: 285, protein: 12, carbs: 36, fat: 10 },
  burger: { calories: 354, protein: 20, carbs: 30, fat: 17 },
  sandwich: { calories: 250, protein: 15, carbs: 30, fat: 8 },
  salad: { calories: 150, protein: 8, carbs: 10, fat: 8 },
  rice: { calories: 206, protein: 4, carbs: 45, fat: 0.4 },
  chicken: { calories: 239, protein: 27, carbs: 0, fat: 14 },
  egg: { calories: 155, protein: 13, carbs: 1, fat: 11 },
  bread: { calories: 265, protein: 9, carbs: 49, fat: 3 },
  pasta: { calories: 371, protein: 13, carbs: 75, fat: 1.5 },
  steak: { calories: 271, protein: 25, carbs: 0, fat: 19 },
  fish: { calories: 206, protein: 22, carbs: 0, fat: 12 },
  cheese: { calories: 402, protein: 25, carbs: 1, fat: 33 },
  milk: { calories: 149, protein: 8, carbs: 12, fat: 8 },
  coffee: { calories: 2, protein: 0.3, carbs: 0, fat: 0 },
  tea: { calories: 2, protein: 0, carbs: 0.5, fat: 0 },
  cake: { calories: 257, protein: 4, carbs: 38, fat: 10 },
  cookie: { calories: 142, protein: 2, carbs: 20, fat: 6 },
  chocolate: { calories: 546, protein: 5, carbs: 61, fat: 31 },
};

const estimateNutrition = (foodName) => {
  const lowerFood = foodName.toLowerCase();

  // Try to find exact match
  if (nutritionDatabase[lowerFood]) {
    const data = nutritionDatabase[lowerFood];
    return {
      calories: data.calories,
      protein: `${data.protein}g`,
      carbs: `${data.carbs}g`,
      fat: `${data.fat}g`,
    };
  }

  // Try partial match
  for (const [key, value] of Object.entries(nutritionDatabase)) {
    if (lowerFood.includes(key) || key.includes(lowerFood)) {
      return {
        calories: value.calories,
        protein: `${value.protein}g`,
        carbs: `${value.carbs}g`,
        fat: `${value.fat}g`,
      };
    }
  }

  // Default fallback
  return {
    calories: 200,
    protein: "10g",
    carbs: "25g",
    fat: "8g",
  };
};

exports.analyzeFood = async (req, res) => {
  try {
    const { query, imageBase64 } = req.body;

    // For text-based search, return estimated nutrition
    if (query && !imageBase64) {
      const nutrition = estimateNutrition(query);
      return res.status(200).json({
        foodName: query,
        ...nutrition,
        nutrients: {
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
        },
      });
    }

    // For image analysis, use Hugging Face
    if (imageBase64) {
      if (!process.env.HF_TOKEN) {
        console.warn("HF_TOKEN is missing in environment variables.");
        // We will continue, but it might fail or hit rate limits if the API allows unauthenticated requests (unlikely for this model)
      }

      try {
        const buffer = Buffer.from(imageBase64, "base64");

        const response = await axios.post(
          "https://api-inference.huggingface.co/models/Nateraw/food",
          buffer,
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_TOKEN}`,
              "Content-Type": "application/octet-stream",
            },
          }
        );

        if (response.data && response.data.length > 0) {
          // Get the top prediction
          const prediction = response.data[0];
          const foodName = prediction.label;
          const nutrition = estimateNutrition(foodName);

          console.log("Hugging Face recognized:", foodName);

          return res.status(200).json({
            foodName: foodName,
            ...nutrition,
            nutrients: {
              protein: nutrition.protein,
              carbs: nutrition.carbs,
              fat: nutrition.fat,
            },
          });
        }
      } catch (hfError) {
        console.error("Hugging Face API Error:", hfError.message);
        if (hfError.response) {
            console.error("HF Response Data:", hfError.response.data);
            console.error("HF Response Status:", hfError.response.status);
        }
        // Fall through to fallback
      }
    }

    // Fallback response
    const nutrition = estimateNutrition(query || "Unknown Food");
    res.status(200).json({
      foodName: query || "Unknown Food",
      ...nutrition,
      nutrients: {
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
      },
    });
  } catch (error) {
    console.error("Analyze Food Error:", error.message);
    res.status(500).json({ message: "Analysis Failed" });
  }
};

// 2. BARCODE (OpenFoodFacts - usually works, but adding fallback)
exports.analyzeBarcode = async (req, res) => {
  try {
    const { code } = req.params;
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v2/product/${code}.json`
    );

    if (response.data.status === 1) {
      const p = response.data.product;
      return res.json({
        foodName: p.product_name || "Unknown",
        calories: p.nutriments["energy-kcal_100g"] || 0,
        nutrients: {
          protein: `${p.nutriments.proteins_100g || 0}g`,
          fat: `${p.nutriments.fat_100g || 0}g`,
          carbs: `${p.nutriments.carbohydrates_100g || 0}g`,
        },
      });
    }

    // Fallback if barcode API fails
    res.json({
      foodName: "Offline Item",
      calories: 100,
      nutrients: { protein: "5g", fat: "2g", carbs: "10g" },
    });
  } catch (err) {
    res.json({
      foodName: "Offline Item",
      calories: 100,
      nutrients: { protein: "5g", fat: "2g", carbs: "10g" },
    });
  }
};

// 3. SAVE ENTRY (Must Work!)
exports.saveFoodEntry = async (req, res) => {
  try {
    const { foodName, calories, nutrients, mealType } = req.body;

    // Yahan check karein ke req.user.id aa raha hai
    if (!req.user)
      return res.status(401).json({ message: "No Token Provided" });

    const foodEntry = new FoodLog({
      userId: req.user.id,
      foodName,
      calories,
      nutrients,
      mealType: mealType || "snack",
    });

    await foodEntry.save();
    res.status(200).json({ message: "Data Saved in MongoDB!", foodEntry });
  } catch (error) {
    console.error("DB SAVE ERROR:", error.message);
    res
      .status(500)
      .json({ message: "Database Save Failed", error: error.message });
  }
};
