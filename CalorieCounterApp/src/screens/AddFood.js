import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { normalize } from "../utils/dimensions";

const { width } = Dimensions.get("window");

const AddFood = ({ navigation }) => {
  const [mealType, setMealType] = useState("breakfast");

  // Animation Values
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(contentSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const mealTypes = [
    { value: "breakfast", label: "Breakfast", emoji: "🌅" },
    { value: "lunch", label: "Lunch", emoji: "🍱" },
    { value: "dinner", label: "Dinner", emoji: "🌙" },
    { value: "snack", label: "Snack", emoji: "🍿" },
  ];

  const Card = ({ title, subtitle, icon, colors, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        friction: 8,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start();
    };

    return (
      <Animated.View
        style={{ transform: [{ scale: scaleAnim }], marginBottom: 20 }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.cardBtn}
        >
          <LinearGradient
            colors={colors}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.cardIcon}>{icon}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header - Fits Dashboard Scheme */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#6a11cb", "#2575fc"]} // Dashboard Gradient
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
          <Text style={styles.headerTitle}>Add New Meal</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={{
          opacity: contentFade,
          transform: [{ translateY: contentSlide }],
        }}
      >
        {/* Meal Type Chips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What are we eating? 🍽️</Text>
          <View style={styles.chipContainer}>
            {mealTypes.map((meal) => (
              <TouchableOpacity
                key={meal.value}
                activeOpacity={0.7}
                onPress={() => setMealType(meal.value)}
                style={[
                  styles.chip,
                  mealType === meal.value && styles.chipActive,
                ]}
              >
                <Text style={styles.chipEmoji}>{meal.emoji}</Text>
                <Text
                  style={[
                    styles.chipLabel,
                    mealType === meal.value && styles.chipLabelActive,
                  ]}
                >
                  {meal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.cardsSection}>
          <Text style={styles.sectionTitle}>Capture It 📸</Text>

          <Card
            title="Snap a Photo"
            subtitle="AI Food Recognition"
            icon="📷"
            colors={["#6a11cb", "#2575fc"]} // Matches Header
            onPress={() => navigation.navigate("CameraScreen")}
          />

          <Card
            title="Scan Barcode"
            subtitle="Instant Product Lookup"
            icon="🔍"
            colors={["#4facfe", "#00f2fe"]} // Cyan Blue Accent
            onPress={() => navigation.navigate("BarcodeScreen")}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    zIndex: 10,
    backgroundColor: "transparent",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    shadowColor: "#2575fc",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  backBtn: {
    padding: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  content: {
    padding: 25,
  },
  section: {
    marginBottom: 35,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    marginLeft: 5,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  chip: {
    width: (width - 60) / 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 5,
  },
  chipActive: {
    backgroundColor: "#f0f2ff",
    borderColor: "#2575fc", // Dashboard Blue
    borderWidth: 1.5,
  },
  chipEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  chipLabel: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  chipLabelActive: {
    color: "#2575fc",
    fontWeight: "bold",
  },
  cardsSection: {
    flex: 1,
  },
  cardBtn: {
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  cardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 25,
    borderRadius: 25,
  },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  cardIcon: {
    fontSize: 26,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },
  arrowContainer: {
    width: 30,
    alignItems: "center",
  },
  arrow: {
    fontSize: 24,
    color: "#fff",
    opacity: 0.8,
  },
});

export default AddFood;
