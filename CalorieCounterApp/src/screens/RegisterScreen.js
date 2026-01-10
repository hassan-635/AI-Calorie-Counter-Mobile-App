import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { normalize } from "../utils/dimensions";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    console.log("Register Button Pressed:", { name, email, password });
    const res = await register(name, email, password);
    setLoading(false);

    console.log("Register Response:", res);

    if (res.success) {
      Alert.alert("Success", "Welcome! Your account has been created! 🎉");
    } else {
      console.error("Registration Error:", res.msg);
      Alert.alert(
        "Error",
        res.msg || "Signup Failed. Please check your internet connection."
      );
    }
  };

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#f093fb"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your fitness journey today!</Text>

          <CustomInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <CustomButton
            title={loading ? "Creating Account..." : "Sign Up"}
            onPress={handleRegister}
            color="#667eea"
            disabled={loading}
          />

          {loading && (
            <ActivityIndicator
              size="large"
              color="#667eea"
              style={{ marginTop: 15 }}
            />
          )}

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.linkContainer}
          >
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.link}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: normalize(20),
    justifyContent: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: normalize(25),
    padding: normalize(30),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: normalize(32),
    fontWeight: "bold",
    color: "#667eea",
    textAlign: "center",
    marginBottom: normalize(8),
  },
  subtitle: {
    fontSize: normalize(15),
    color: "#666",
    textAlign: "center",
    marginBottom: normalize(30),
  },
  linkContainer: {
    marginTop: normalize(20),
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    color: "#666",
    fontSize: normalize(14),
  },
  link: {
    color: "#667eea",
    fontWeight: "bold",
  },
});
