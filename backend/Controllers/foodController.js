const FoodLog = require("../Models/FoodLog");

// 1. ANALYZE FOOD (Mock Response - No API needed)
exports.analyzeFood = async (req, res) => {
  try {
    const { query } = req.body;

    // Fake data for testing frontend
    const mockData = {
      foodName: query || "Test Food",
      calories: 250,
      nutrients: {
        protein: "15g",
        fat: "10g",
        carbs: "30g",
      },
    };

    console.log("Mocking data for query:", query);
    res.status(200).json(mockData);
  } catch (error) {
    res.status(500).json({ message: "Mock Search Failed" });
  }
};

// 2. BARCODE (OpenFoodFacts - usually works, but adding fallback)
const axios = require("axios");
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
