import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
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

  return (
    <View style={styles.container}>
      {/* Header with Logout */}
      <Header title={`Hi, ${user?.name || "User"}`} />
      <TouchableOpacity style={styles.logoutPos} onPress={logout}>
        <Text style={{ color: "red" }}>Logout</Text>
      </TouchableOpacity>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Calories Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.circle}>
            <Text style={styles.remainingValue}>{goal - totalCalories}</Text>
            <Text style={styles.remainingLabel}>kcal left</Text>
          </View>
        </View>

        {/* Nutrient Row (Backend se calculation) */}
        <View style={styles.nutrientRow}>
          <NutrientCard label="Protein" value="--" unit="g" color="#FF5722" />
          <NutrientCard label="Carbs" value="--" unit="g" color="#2196F3" />
          <NutrientCard label="Fat" value="--" unit="g" color="#FFC107" />
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
                time={new Date(item.date).toLocaleTimeString([], {
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
  container: { flex: 1, backgroundColor: "#FDFDFD" },
  scrollContent: {
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(40),
  },
  progressContainer: {
    alignItems: "center",
    marginVertical: normalize(30),
  },
  circle: {
    width: normalize(180),
    height: normalize(180),
    borderRadius: normalize(90),
    borderWidth: 10,
    borderColor: "#4CAF50", // Full green later (dynamic progress)
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 5,
  },
  remainingValue: {
    fontSize: normalize(32),
    fontWeight: "bold",
    color: "#333",
  },
  remainingLabel: { fontSize: normalize(14), color: "#888" },
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
