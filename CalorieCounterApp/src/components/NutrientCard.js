import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { normalize, SCREEN_WIDTH } from "../utils/dimensions";

const NutrientCard = ({ label, value, unit, color, icon }) => (
  <View style={styles.card}>
    <View style={[styles.iconContainer, { backgroundColor: color + "33" }]}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: color }]}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    width: SCREEN_WIDTH * 0.28,
    padding: normalize(12),
    borderRadius: normalize(18),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: normalize(12),
    color: "#888",
    fontWeight: "600",
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  value: { fontSize: normalize(16), fontWeight: "bold" },
  unit: { fontSize: normalize(10), color: "#999", marginLeft: 2 },
});

export default NutrientCard;
