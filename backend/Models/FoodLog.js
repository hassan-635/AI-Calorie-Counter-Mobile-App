const mongoose = require("mongoose");

const FoodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  quantity: {
    type: String,
    default: "1 serving",
  },
  nutrients: {
    protien: { type: String, default: "0g" },
    carbs: { type: String, default: "0g" },
    fats: { type: String, default: "0g" },
  },
  image: {
    type: String, //imagge path or base64 string after gemini recognition
  },
  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    default: "snack",
  },
  consumedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.FoodLog || mongoose.model("FoodLog", FoodLogSchema);
