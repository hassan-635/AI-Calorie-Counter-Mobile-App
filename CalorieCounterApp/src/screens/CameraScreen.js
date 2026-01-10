import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { FoodContext } from "../context/FoodContext";
import { normalize } from "../utils/dimensions";

const { width, height } = Dimensions.get("window");

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
          We need camera access to see your food! 📸
        </Text>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
        >
          <Text style={styles.permissionBtnText}>Grant Access</Text>
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
          "Yum! 😋",
          `${res.data.foodName}\nIt has about ${res.data.calories} calories.`,
          [
            { text: "Try Again", style: "cancel" },
            { text: "Add to Log", onPress: () => saveEntry(res.data) },
          ]
        );
      } else {
        Alert.alert(
          "Oops! 🤖",
          "I couldn't quite see that. Use good lighting and try again!"
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
        {/* Overlay Grid */}
        <View style={styles.overlayContainer}>
          <View style={styles.topMask} />
          <View style={styles.centerRow}>
            <View style={styles.sideMask} />
            <View style={styles.focusFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={styles.sideMask} />
          </View>
          <View style={styles.bottomMask} />
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.controlsGradient}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#fff"
                style={styles.loadingSpinner}
              />
            ) : (
              <TouchableOpacity
                style={styles.outerCapture}
                onPress={takePicture}
                activeOpacity={0.7}
              >
                <View style={styles.innerCapture} />
              </TouchableOpacity>
            )}

            <View style={{ width: 60 }} />
          </LinearGradient>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4F6F9",
  },
  permissionText: {
    fontSize: normalize(18),
    textAlign: "center",
    marginBottom: 20,
    color: "#444",
  },
  permissionBtn: {
    backgroundColor: "#667eea",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  permissionBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // Overlay Focus Frame
  overlayContainer: { flex: 1 },
  topMask: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  bottomMask: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  centerRow: { flexDirection: "row", height: 300 },
  sideMask: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  focusFrame: {
    width: 300,
    height: 300,
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#fff",
    borderWidth: 3,
  },
  topLeft: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0 },
  topRight: { top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0 },
  bottomLeft: { bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0 },
  bottomRight: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0 },

  // Controls
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  controlsGradient: {
    paddingBottom: 50,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  outerCapture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCapture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  closeBtn: {
    padding: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingSpinner: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});
