import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { FoodContext } from "../context/FoodContext";
import Header from "../components/Header";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { normalize } from "../utils/dimensions";

const AddFood = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const { analyzeFoodText, addFood } = useContext(FoodContext);

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
      mealType: "snack",
    });

    if (saveRes.success) {
      Alert.alert("Success", "Food has been added to your daily log.");
      navigation.navigate("Dashboard");
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Log Food"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={styles.label}>What did you eat?</Text>

        <CustomInput
          placeholder="e.g. 1 plate of rice or 2 eggs"
          value={search}
          onChangeText={setSearch}
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4CAF50"
            style={{ marginTop: 20 }}
          />
        ) : (
          <CustomButton title="Search Nutrition" onPress={handleTextSearch} />
        )}

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR USE</Text>
          <View style={styles.line} />
        </View>

        <CustomButton
          title="📷 Take Food Photo (AI)"
          color="#9C27B0"
          onPress={() => navigation.navigate("CameraScreen")}
        />

        <CustomButton
          title="🔍 Scan Barcode"
          color="#3F51B5"
          onPress={() => navigation.navigate("BarcodeScreen")}
          style={{ marginTop: normalize(10) }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: normalize(20) },
  label: {
    fontSize: normalize(16),
    fontWeight: "600",
    marginBottom: normalize(10),
    color: "#444",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: normalize(20),
  },
  line: { flex: 1, height: 1, backgroundColor: "#EEE" },
  orText: {
    marginHorizontal: 10,
    color: "#AAA",
    fontWeight: "bold",
    fontSize: normalize(12),
  },
});

export default AddFood;
