const axios = require("axios");
const FoodLog = require("../Models/FoodLog");

// Nutrition database
const nutritionDatabase = {
  apple: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  pizza: { calories: 285, protein: 12, carbs: 36, fat: 10 },
  burger: { calories: 354, protein: 20, carbs: 30, fat: 17 },
  rice: { calories: 206, protein: 4, carbs: 45, fat: 0.4 },
  chicken: { calories: 239, protein: 27, carbs: 0, fat: 14 },
  egg: { calories: 155, protein: 13, carbs: 1, fat: 11 },
};

// Portion-aware
const estimateNutrition = (foodName, portion = "medium") => {
  const lowerFood = foodName.toLowerCase();
  const data = nutritionDatabase[lowerFood] || {
    calories: 200,
    protein: 10,
    carbs: 25,
    fat: 8,
  };
  const multipliers = { small: 0.75, medium: 1, large: 1.5 };
  const factor = multipliers[portion] || 1;

  return {
    calories: Math.round(data.calories * factor),
    protein: +(data.protein * factor).toFixed(1),
    carbs: +(data.carbs * factor).toFixed(1),
    fat: +(data.fat * factor).toFixed(1),
  };
};

// Unified Image/Text Analysis
exports.analyzeFood = async (req, res) => {
  try {
    const { query, imageBase64, portion } = req.body;

    // Image-based
    if (imageBase64) {
      try {
        const response = await axios.post(
          `${process.env.YOLO_API_URL}/predict`,
          { image_base64: imageBase64 }
        );
        const foodName = response.data.food || "Unknown";
        const nutrition = estimateNutrition(foodName, portion);
        return res.json({
          foodName,
          ...nutrition,
          confidence: response.data.confidence,
        });
      } catch (err) {
        console.error("YOLOv8 Error:", err.message);
      }
    }

    // Fallback/No Image
    return res.status(400).json({ message: "Image is required for analysis" });
  } catch (err) {
    console.error("Analyze Food Error:", err.message);
    res.status(500).json({ message: "Analysis Failed" });
  }
};

// Barcode Analysis
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
          protein: p.nutriments.proteins_100g || 0,
          fat: p.nutriments.fat_100g || 0,
          carbs: p.nutriments.carbohydrates_100g || 0,
        },
        confidence: 1,
      });
    }
    res.json({
      foodName: "Offline Item",
      calories: 100,
      nutrients: { protein: 5, fat: 2, carbs: 10 },
      confidence: 0,
    });
  } catch (err) {
    res.json({
      foodName: "Offline Item",
      calories: 100,
      nutrients: { protein: 5, fat: 2, carbs: 10 },
      confidence: 0,
    });
  }
};

const User = require("../Models/User");

// Save Food Entry
exports.saveFoodEntry = async (req, res) => {
  try {
    const { foodName, calories, nutrients, mealType } = req.body;
    if (!req.user)
      return res.status(401).json({ message: "No Token Provided" });

    const foodEntry = new FoodLog({
      userId: req.user.id,
      foodName,
      calories,
      nutrients,
      mealType: mealType || "snack",
    });

    // Gamification Logic (Streak)
    const user = await User.findById(req.user.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lastLog = user.lastLogDate ? new Date(user.lastLogDate) : null;
    if (lastLog) lastLog.setHours(0, 0, 0, 0);

    let streakUpdated = false;

    if (!lastLog) {
      // First ever log
      user.streak = 1;
      user.lastLogDate = new Date();
      streakUpdated = true;
    } else {
      const diffTime = Math.abs(today - lastLog);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        user.streak += 1;
        user.lastLogDate = new Date();
        streakUpdated = true;
      } else if (diffDays > 1) {
        // Broke streak
        user.streak = 1;
        user.lastLogDate = new Date();
        streakUpdated = true;
      }
      // If diffDays === 0 (Same day), do nothing
    }

    if (streakUpdated) {
      await user.save();
    }

    await foodEntry.save();
    res.json({
      message: "Data Saved!",
      foodEntry,
      streak: user.streak,
      streakUpdated,
    });
  } catch (error) {
    console.error("DB SAVE ERROR:", error.message);
    res
      .status(500)
      .json({ message: "Database Save Failed", error: error.message });
  }
};

// Get User Logs
exports.getUserLogs = async (req, res) => {
  try {
    const logs = await FoodLog.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
