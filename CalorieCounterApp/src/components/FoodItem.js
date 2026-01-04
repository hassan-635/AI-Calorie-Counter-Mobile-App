import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { normalize } from "../utils/dimensions";

const FoodItem = ({ name, calories, time }) => (
  <View style={styles.itemContainer}>
    <View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
    <Text style={styles.calories}>{calories} kcal</Text>
  </View>
);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  name: { fontSize: normalize(16), fontWeight: "500", color: "#333" },
  time: { fontSize: normalize(12), color: "#AAA", marginTop: 2 },
  calories: { fontSize: normalize(16), fontWeight: "bold", color: "#4CAF50" },
});

export default FoodItem;
