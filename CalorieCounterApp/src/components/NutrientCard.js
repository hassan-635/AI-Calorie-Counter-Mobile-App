import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { normalize, SCREEN_WIDTH } from "../utils/dimensions";

const NutrientCard = ({ label, value, unit, color }) => (
  <View style={[styles.card, { borderTopColor: color }]}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valueRow}>
      <Text style={[styles.value, { color: color }]}>{value}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    width: SCREEN_WIDTH * 0.28, // Teeno cards ek line mein aa jayein
    padding: normalize(12),
    borderRadius: normalize(15),
    alignItems: "center",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    borderTopWidth: 4,
  },
  label: { fontSize: normalize(12), color: "#666", fontWeight: "600" },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: normalize(5),
  },
  value: { fontSize: normalize(18), fontWeight: "bold" },
  unit: { fontSize: normalize(10), color: "#999", marginLeft: 2 },
});

export default NutrientCard;
