import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { FoodContext } from "../context/FoodContext";
import { LinearGradient } from "expo-linear-gradient";
import { normalize } from "../utils/dimensions";

const { width } = Dimensions.get("window");

export default function BarcodeScreen({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { analyzeBarcode, addFood } = useContext(FoodContext);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>
          Please allow camera access to scan barcodes! 🛒
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

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    const res = await analyzeBarcode(data);

    if (res.success) {
      Alert.alert("Product Found! 🎉", res.data.foodName, [
        {
          text: "Save to Log",
          onPress: () => {
            addFood(res.data);
            navigation.navigate("Dashboard");
          },
        },
        { text: "Scan Another", onPress: () => setScanned(false) },
      ]);
    } else {
      Alert.alert("Not Found ❌", "We couldn't find this product. Try again!", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "upc_a"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          {/* Top Info */}
          <View style={styles.headerArea}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.hintText}>Align code in frame</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Scan Frame */}
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Scan Line Animation (Static for now, but looks cool) */}
            <View style={styles.scanLine} />
          </View>

          {/* Results Indicator */}
          {scanned && (
            <View style={styles.resultContainer}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.processingText}>Searching Database...</Text>
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  permissionText: { marginBottom: 20, fontSize: 16 },
  permissionBtn: { backgroundColor: "#667eea", padding: 15, borderRadius: 10 },
  permissionBtnText: { color: "#fff", fontWeight: "bold" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // Dim background
    justifyContent: "center",
    alignItems: "center",
  },
  headerArea: {
    position: "absolute",
    top: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  closeBtn: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
  },
  closeText: { color: "#fff", fontWeight: "bold" },
  hintText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  scanFrame: {
    width: 280,
    height: 180,
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    borderRadius: 20,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#00f2fe",
    borderWidth: 4,
    borderRadius: 5,
  },
  topLeft: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0 },
  topRight: { top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0 },
  bottomLeft: { bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0 },
  bottomRight: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0 },

  scanLine: {
    width: "90%",
    height: 2,
    backgroundColor: "red",
    opacity: 0.6,
  },

  resultContainer: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  processingText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
});
