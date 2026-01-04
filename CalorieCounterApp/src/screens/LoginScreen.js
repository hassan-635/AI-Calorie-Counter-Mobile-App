import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { normalize } from "../utils/dimensions";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    const res = await login(email, password);
    if (!res.success) {
      Alert.alert("Login Failed", res.msg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
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
          title="Login"
          onPress={handleLogin}
          style={styles.loginBtn}
        />

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.link}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, padding: normalize(25), justifyContent: "center" },
  logo: {
    fontSize: normalize(32),
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
  },
  subtitle: {
    fontSize: normalize(16),
    color: "#666",
    textAlign: "center",
    marginBottom: normalize(40),
    marginTop: 10,
  },
  loginBtn: { marginTop: normalize(10) },
  footerText: {
    textAlign: "center",
    marginTop: normalize(20),
    color: "#888",
    fontSize: normalize(14),
  },
  link: { color: "#4CAF50", fontWeight: "bold" },
});
