import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { normalize } from "../utils/dimensions";

const Header = ({ title, showBack = false, onBack }) => (
  <View style={styles.header}>
    {showBack && (
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
    )}
    <Text style={styles.title}>{title}</Text>
    <View style={{ width: 30 }} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: normalize(20),
    paddingTop: normalize(40),
    paddingBottom: normalize(20),
    backgroundColor: "#FFF",
  },
  title: { fontSize: normalize(20), fontWeight: "bold", color: "#333" },
  backText: { fontSize: normalize(24), color: "#333" },
});

export default Header;
