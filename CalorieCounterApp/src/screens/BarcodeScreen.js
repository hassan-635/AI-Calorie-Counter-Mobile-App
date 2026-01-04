import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, Alert, Button } from "react-native";
// Import CameraView instead of BarCodeScanner
import { CameraView, useCameraPermissions } from "expo-camera";
import { FoodContext } from "../context/FoodContext";

export default function BarcodeScreen({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { analyzeBarcode, addFood } = useContext(FoodContext);

  // 1. Handle Permissions
  if (!permission) {
    return <View />; // Loading state
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // 2. Handle Scanning logic
  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    const res = await analyzeBarcode(data);

    if (res.success) {
      Alert.alert("Product Scanned", res.data.foodName, [
        {
          text: "Save",
          onPress: () => {
            addFood(res.data);
            navigation.navigate("Dashboard");
          },
        },
        { text: "Cancel", onPress: () => setScanned(false) },
      ]);
    } else {
      Alert.alert("Error", "Product not found", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        // Enable barcode scanning
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "upc_a"], // Add types relevant to food products
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <View style={styles.overlay}>
          <Text style={styles.text}>Processing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  overlay: { position: "absolute", bottom: 100, alignSelf: "center" },
  text: {
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 5,
  },
});
