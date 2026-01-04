import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FoodContext } from "../context/FoodContext";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { normalize } from "../utils/dimensions";

const AddFood = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [mealType, setMealType] = useState("breakfast"); // Default to breakfast

  const { analyzeFoodText, addFood } = useContext(FoodContext);

  const mealTypes = [
    { value: "breakfast", label: "🌅 Breakfast", emoji: "🌅" },
    { value: "lunch", label: "🍱 Lunch", emoji: "🍱" },
    { value: "dinner", label: "🌙 Dinner", emoji: "🌙" },
    { value: "snack", label: "🍿 Snack", emoji: "🍿" },
  ];

  const handleTextSearch = async () => {
    if (!search) {
      Alert.alert("Required", "Please enter a food description first.");
      return;
    }

    setLoading(true);
    const res = await analyzeFoodText(search);
    setLoading(false);

    if (res.success) {
      Alert.alert(
        "Food Identified ✅",
        `${res.data.foodName}\nCalories: ${res.data.calories}\nProtein: ${res.data.nutrients.protein}`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Log Meal", onPress: () => saveEntry(res.data) },
        ]
      );
    } else {
      Alert.alert(
        "Not Found",
        "We couldn't find nutrition info for this item. Please try again."
      );
    }
  };

  const saveEntry = async (foodData) => {
    const saveRes = await addFood({
      foodName: foodData.foodName,
      calories: foodData.calories,
      nutrients: foodData.nutrients,
      mealType: mealType, // Use selected meal type
    });

    if (saveRes.success) {
      Alert.alert("Success", "Food has been added to your daily log.");
      navigation.navigate("Dashboard");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Food 🍽️</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Meal Type Selector */}
        <View style={styles.mealTypeContainer}>
          <Text style={styles.mealTypeTitle}>Select Meal Type</Text>
          <View style={styles.mealTypePills}>
            {mealTypes.map((meal) => (
              <TouchableOpacity
                key={meal.value}
                activeOpacity={0.7}
                onPress={() => setMealType(meal.value)}
                style={[
                  styles.mealPill,
                  mealType === meal.value && styles.mealPillActive,
                ]}
              >
                <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                <Text
                  style={[
                    styles.mealPillText,
                    mealType === meal.value && styles.mealPillTextActive,
                  ]}
                >
                  {meal.value.charAt(0).toUpperCase() + meal.value.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchCard}>
          <Text style={styles.sectionTitle}>Search by Text</Text>
          <Text style={styles.sectionSubtitle}>Describe what you ate</Text>

          <CustomInput
            placeholder="e.g. 1 plate of rice or 2 eggs"
            value={search}
            onChangeText={setSearch}
          />

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#667eea"
              style={{ marginTop: 20 }}
            />
          ) : (
            <CustomButton
              title="🔍 Search Nutrition"
              onPress={handleTextSearch}
              color="#667eea"
            />
          )}
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR CHOOSE METHOD</Text>
          <View style={styles.line} />
        </View>

        {/* Option Cards */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("CameraScreen")}
        >
          <LinearGradient
            colors={["#f093fb", "#f5576c"]}
            style={styles.optionCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>📷</Text>
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Take Photo</Text>
              <Text style={styles.optionSubtitle}>
                AI will analyze your food
              </Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("BarcodeScreen")}
        >
          <LinearGradient
            colors={["#4facfe", "#00f2fe"]}
            style={styles.optionCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🔍</Text>
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Scan Barcode</Text>
              <Text style={styles.optionSubtitle}>Quick product lookup</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    paddingTop: normalize(50),
    paddingBottom: normalize(20),
    paddingHorizontal: normalize(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: normalize(30),
    borderBottomRightRadius: normalize(30),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: normalize(28),
    color: "#fff",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: normalize(24),
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: normalize(20),
    paddingBottom: normalize(40),
  },
  mealTypeContainer: {
    backgroundColor: "#fff",
    borderRadius: normalize(20),
    padding: normalize(20),
    marginBottom: normalize(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mealTypeTitle: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#333",
    marginBottom: normalize(15),
  },
  mealTypePills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: normalize(10),
  },
  mealPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(15),
    borderRadius: normalize(25),
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  mealPillActive: {
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    borderColor: "#667eea",
  },
  mealEmoji: {
    fontSize: normalize(18),
    marginRight: normalize(6),
  },
  mealPillText: {
    fontSize: normalize(14),
    fontWeight: "600",
    color: "#666",
  },
  mealPillTextActive: {
    color: "#667eea",
  },
  searchCard: {
    backgroundColor: "#fff",
    borderRadius: normalize(20),
    padding: normalize(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: normalize(20),
  },
  sectionTitle: {
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#333",
    marginBottom: normalize(5),
  },
  sectionSubtitle: {
    fontSize: normalize(14),
    color: "#888",
    marginBottom: normalize(20),
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: normalize(25),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    marginHorizontal: 15,
    color: "#888",
    fontWeight: "600",
    fontSize: normalize(12),
    letterSpacing: 1,
  },
  optionCard: {
    borderRadius: normalize(20),
    padding: normalize(20),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(15),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  iconCircle: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: normalize(15),
  },
  iconText: {
    fontSize: normalize(30),
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: normalize(4),
  },
  optionSubtitle: {
    fontSize: normalize(13),
    color: "rgba(255, 255, 255, 0.8)",
  },
  arrow: {
    fontSize: normalize(24),
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddFood;
