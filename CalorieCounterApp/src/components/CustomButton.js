import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { normalize } from "../utils/dimensions";

const CustomButton = ({ title, onPress, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50",
    padding: normalize(15),
    borderRadius: normalize(10),
    alignItems: "center",
    width: "100%",
  },
  text: {
    color: "white",
    fontSize: normalize(16),
    fontWeight: "bold",
  },
});

export default CustomButton;
