import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { normalize } from "../utils/dimensions";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      Alert.alert("Login Failed", res.msg);
    }
  };

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#f093fb"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.logo}>🍎 CalorieCounter</Text>
          <Text style={styles.subtitle}>Welcome back! Log in to continue.</Text>

          <CustomInput
            placeholder="Email Address"
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
            title={loading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            color="#667eea"
            style={styles.loginBtn}
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
            onPress={() => navigation.navigate("Register")}
            style={styles.linkContainer}
          >
            <Text style={styles.footerText}>
              Don't have an account? <Text style={styles.link}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
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
  logo: {
    fontSize: normalize(36),
    fontWeight: "bold",
    color: "#667eea",
    textAlign: "center",
  },
  subtitle: {
    fontSize: normalize(15),
    color: "#666",
    textAlign: "center",
    marginBottom: normalize(30),
    marginTop: normalize(10),
  },
  loginBtn: {
    marginTop: normalize(10),
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
