const mongoose = require("mongoose");

const FoodLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodName: { type: String, required: true },
    calories: { type: Number, required: true },
    nutrients: {
      protein: { type: String, default: "0g" },
      carbs: { type: String, default: "0g" },
      fat: { type: String, default: "0g" },
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"], // Sab small letters mein rakho
      default: "snack",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.FoodLog || mongoose.model("FoodLog", FoodLogSchema);
