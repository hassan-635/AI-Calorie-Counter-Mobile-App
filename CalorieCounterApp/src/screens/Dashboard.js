import React, { useEffect, useContext, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon"; // Import Confetti
import { AuthContext } from "../context/AuthContext";
import { FoodContext } from "../context/FoodContext";
import { normalize } from "../utils/dimensions";
import NutrientCard from "../components/NutrientCard";
import FoodItem from "../components/FoodItem";
import CustomButton from "../components/CustomButton";

const { width } = Dimensions.get("window");

const Dashboard = ({ navigation, route }) => {
  const { user, logout, loadUser } = useContext(AuthContext); // Added loadUser to refresh streak
  const { logs, fetchTodayLogs } = useContext(FoodContext);
  const [refreshing, setRefreshing] = useState(false);
  const confettiRef = useRef(null);

  // Animations
  const headerSlide = useRef(new Animated.Value(-100)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  // Gamification: Trigger Confetti if passed param
  useEffect(() => {
    if (route.params?.triggerConfetti) {
      setTimeout(() => {
        confettiRef.current?.start();
        loadUser(); // Refresh user to get updated streak
      }, 500);
      // Clear param to prevent firing on every focus?
      // Navigation params persist, but start() is only called on effect or ref.
      // Setting param to false is safer but requires setParams.
      navigation.setParams({ triggerConfetti: false });
    }
  }, [route.params?.triggerConfetti]);

  useEffect(() => {
    fetchTodayLogs();

    Animated.parallel([
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        delay: 200,
      }),
    ]).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodayLogs();
    await loadUser(); // Refresh streak
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning,";
    if (hours < 18) return "Good Afternoon,";
    return "Good Evening,";
  };

  const totalCalories = logs.reduce((sum, item) => sum + item.calories, 0);
  const goal = 2000;

  const calculateNutrients = () => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    logs.forEach((item) => {
      if (item.nutrients) {
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
      {/* Confetti (Hidden by default, fires on ref) */}
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        ref={confettiRef}
        fadeOut={true}
      />

      {/* Header */}
      <Animated.View
        style={[
          styles.headerContainer,
          { transform: [{ translateY: headerSlide }] },
        ]}
      >
        <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{user?.name || "Friend"}! ✨</Text>
            </View>

            {/* Streak Indicator */}
            <View style={styles.rightHeader}>
              <View style={styles.streakBadge}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={styles.streakText}>{user?.streak || 0}</Text>
              </View>
              <TouchableOpacity
                style={styles.historyBtn}
                onPress={() => navigation.navigate("HistoryScreen")}
              >
                <Text style={styles.historyText}>📜</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Circle (Overlapping) */}
          <View style={styles.progressSection}>
            <View style={styles.outerCircle}>
              <LinearGradient
                colors={["#fff", "#f0f2f5"]}
                style={styles.innerCircle}
              >
                <Text style={styles.caloriesText}>
                  {parseFloat(totalCalories).toFixed(0)}
                </Text>
                <Text style={styles.caloriesLabel}>Kcal Today</Text>
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={{ opacity: contentFade }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2575fc"
          />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: 60 }} />

        {/* Nutrient Grid */}
        <View style={styles.nutrientContainer}>
          <NutrientCard
            label="Protein"
            value={nutrients.protein}
            unit="g"
            color="#FF6B6B"
            icon="🥩"
          />
          <NutrientCard
            label="Carbs"
            value={nutrients.carbs}
            unit="g"
            color="#4ECDC4"
            icon="🥖"
          />
          <NutrientCard
            label="Fat"
            value={nutrients.fat}
            unit="g"
            color="#FFD93D"
            icon="🥑"
          />
        </View>

        <CustomButton
          title="+ Log New Meal"
          onPress={() => navigation.navigate("AddFood")}
          style={styles.addBtn}
          color="#2575fc"
        />

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Today's Logs 📝</Text>
          {logs.length > 0 ? (
            logs.map((item, index) => (
              <View key={item._id} style={styles.logItemWrapper}>
                <FoodItem
                  name={item.foodName}
                  calories={item.calories}
                  time={new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  delay={index * 100}
                />
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No meals logged yet today.</Text>
              <Text style={styles.emptySub}>Tap above to get started!</Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  headerContainer: {
    zIndex: 10,
    backgroundColor: "transparent",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 80, // Space for overlap
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "500",
  },
  userName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  rightHeader: {
    alignItems: "flex-end",
    gap: 10,
  },
  streakBadge: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  streakEmoji: { fontSize: 14, marginRight: 5 },
  streakText: { color: "#fff", fontWeight: "bold" },

  historyBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  historyText: { fontSize: 16 },

  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 12 },

  progressSection: {
    position: "absolute",
    bottom: -60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.2)", // Glow ring
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2575fc",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  caloriesText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2575fc",
  },
  caloriesLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nutrientContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    marginTop: 10,
  },
  addBtn: { marginBottom: 30 },
  listSection: { flex: 1 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginLeft: 5,
  },
  logItemWrapper: { marginBottom: 15 },

  emptyState: { alignItems: "center", padding: 40, opacity: 0.6 },
  emptyText: { fontSize: 16, fontWeight: "600", color: "#888" },
  emptySub: { fontSize: 14, color: "#aaa", marginTop: 5 },
});

export default Dashboard;
