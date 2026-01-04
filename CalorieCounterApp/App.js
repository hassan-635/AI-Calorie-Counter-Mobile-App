import "react-native-gesture-handler";
import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import { FoodProvider } from "./src/context/FoodContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <FoodProvider>
        <AppNavigator />
      </FoodProvider>
    </AuthProvider>
  );
}
