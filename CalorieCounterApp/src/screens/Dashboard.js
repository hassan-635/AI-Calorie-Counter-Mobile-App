import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { FoodContext } from "../context/FoodContext";
import { normalize } from "../utils/dimensions";
import NutrientCard from "../components/NutrientCard";
import FoodItem from "../components/FoodItem";
import Header from "../components/Header";
import CustomButton from "../components/CustomButton";

const Dashboard = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { logs, fetchTodayLogs } = useContext(FoodContext);
  const [refreshing, setRefreshing] = useState(false);

  // Screen load hotay hi data lao
  useEffect(() => {
    fetchTodayLogs();
  }, []);

  // Pull to refresh logic
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodayLogs();
    setRefreshing(false);
  };

  // Calories Calculation (Logs mein se total nikalna)
  const totalCalories = logs.reduce((sum, item) => sum + item.calories, 0);
  const goal = 2000; // Ye user profile se bhi aa sakta hai

  // Nutrient Calculation
  const calculateNutrients = () => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    logs.forEach((item) => {
      if (item.nutrients) {
        // Parse the string values like "15g" to numbers
        totalProtein += parseFloat(item.nutrients.protein) || 0;
        totalCarbs += parseFloat(item.nutrients.carbs) || 0;
        totalFat += parseFloat(item.nutrients.fat) || 0;
      }
    });

    return {
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
    };
  };

  const nutrients = calculateNutrients();

  return (
    <View style={styles.container}>
      {/* Header with Logout */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>Hi, {user?.name || "User"}! 👋</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Calories Progress */}
        <View style={styles.progressContainer}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.circle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.circleInner}>
              <Text style={styles.remainingValue}>
                {totalCalories.toFixed(2)}
              </Text>
              <Text style={styles.remainingLabel}>kcal consumed</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Nutrient Row (Backend se calculation) */}
        <View style={styles.nutrientRow}>
          <NutrientCard
            label="Protein"
            value={nutrients.protein}
            unit="g"
            color="#FF5722"
          />
          <NutrientCard
            label="Carbs"
            value={nutrients.carbs}
            unit="g"
            color="#2196F3"
          />
          <NutrientCard
            label="Fat"
            value={nutrients.fat}
            unit="g"
            color="#FFC107"
          />
        </View>

        <CustomButton
          title="+ Add Food"
          onPress={() => navigation.navigate("AddFood")}
        />

        {/* Real Food History from MongoDB */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Today's Log</Text>
          {logs.length > 0 ? (
            logs.map((item) => (
              <FoodItem
                key={item._id}
                name={item.foodName}
                calories={item.calories}
                time={new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              No food logged yet. Start eating!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
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
  headerTitle: {
    fontSize: normalize(24),
    fontWeight: "bold",
    color: "#fff",
  },
  logoutBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(8),
    borderRadius: normalize(20),
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: normalize(14),
  },
  scrollContent: {
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(40),
  },
  progressContainer: {
    alignItems: "center",
    marginVertical: normalize(30),
  },
  circle: {
    width: normalize(200),
    height: normalize(200),
    borderRadius: normalize(100),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  circleInner: {
    width: normalize(170),
    height: normalize(170),
    borderRadius: normalize(85),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  remainingValue: {
    fontSize: normalize(40),
    fontWeight: "bold",
    color: "#667eea",
  },
  remainingLabel: {
    fontSize: normalize(16),
    color: "#666",
    fontWeight: "500",
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: normalize(25),
  },
  addBtn: { marginVertical: normalize(10), height: normalize(55) },
  historySection: { marginTop: normalize(20) },
  historyTitle: {
    fontSize: normalize(18),
    fontWeight: "bold",
    marginBottom: normalize(15),
    color: "#333",
  },
});

export default Dashboard;
