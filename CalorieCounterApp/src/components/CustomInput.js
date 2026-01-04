import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { normalize } from "../utils/dimensions";

const CustomInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = "none",
}) => (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: normalize(10),
  },
  input: {
    backgroundColor: "#F9F9F9",
    padding: normalize(15),
    borderRadius: normalize(12),
    fontSize: normalize(16),
    borderWidth: 1,
    borderColor: "#EEE",
    color: "#333",
  },
});

export default CustomInput;
