import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

// Screens Import
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import Dashboard from "../screens/Dashboard";
import AddFood from "../screens/AddFood";
import CameraScreen from "../screens/CameraScreen";
import BarcodeScreen from "../screens/BarcodeScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          // --- Main App Flow ---
          <>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="AddFood" component={AddFood} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen name="BarcodeScreen" component={BarcodeScreen} />
            <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
          </>
        ) : (
          // --- Auth Flow ---
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
