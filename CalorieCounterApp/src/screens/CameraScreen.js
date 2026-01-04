import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { FoodContext } from "../context/FoodContext";
import { normalize } from "../utils/dimensions";

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const { analyzeFoodImage, addFood } = useContext(FoodContext);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>
          Camera access is required to identify food.
        </Text>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
        >
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });

      const res = await analyzeFoodImage(photo.base64);
      setLoading(false);

      if (res.success) {
        Alert.alert(
          "Item Recognized!",
          `${res.data.foodName}\nCalories: ${res.data.calories} kcal`,
          [
            { text: "Retake", style: "cancel" },
            { text: "Log Food", onPress: () => saveEntry(res.data) },
          ]
        );
      } else {
        Alert.alert(
          "Analysis Failed",
          "Could not identify food. Please try again with a clearer photo."
        );
      }
    }
  };

  const saveEntry = async (data) => {
    await addFood(data);
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture} />
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end", // Fixed from flex-bottom
    alignItems: "center",
    marginBottom: 50,
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    fontSize: normalize(16),
    textAlign: "center",
    marginBottom: 20,
    color: "#444",
  },
  permissionBtn: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 10 },
  permissionBtnText: { color: "#fff", fontWeight: "bold" },
});
