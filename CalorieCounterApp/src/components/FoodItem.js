import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { normalize } from "../utils/dimensions";
import { getFoodIcon } from "../utils/foodIcons";

const { width } = Dimensions.get("window");

const FoodItem = ({ name, calories, time, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const icon = getFoodIcon(name);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        tension: 50,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.leftRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>

      <View style={styles.rightRow}>
        <Text style={styles.calories}>{calories}</Text>
        <Text style={styles.calLabel}>kcal</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: normalize(15),
    borderRadius: normalize(20),
    marginBottom: normalize(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginHorizontal: 2,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 15,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F4F6F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: normalize(16),
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 4,
  },
  time: {
    fontSize: normalize(12),
    color: "#A0A0A0",
    fontWeight: "500",
  },
  rightRow: {
    alignItems: "flex-end",
    minWidth: 60,
  },
  calories: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#667eea",
  },
  calLabel: {
    fontSize: normalize(11),
    color: "#999",
  },
});

export default FoodItem;
