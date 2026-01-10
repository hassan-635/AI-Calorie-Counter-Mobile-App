import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet, Animated, Platform } from "react-native";
import { normalize } from "../utils/dimensions";

const CustomInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = "none",
  keyboardType = "default",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false, // Color interpolation doesn't support native driver
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "#667eea"],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#f0f2f5", "#fff"], // Slight lightening on focus
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          borderWidth: 1.5,
          elevation: isFocused ? 5 : 0,
          shadowOpacity: isFocused ? 0.1 : 0,
        },
      ]}
    >
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: normalize(10),
    borderRadius: normalize(15),
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  input: {
    padding: normalize(16),
    fontSize: normalize(16),
    color: "#333",
  },
});

export default CustomInput;
