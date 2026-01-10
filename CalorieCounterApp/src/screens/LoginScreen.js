import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { normalize } from "../utils/dimensions";

const { height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      // Success auto-navigates
    } else {
      Alert.alert("Login Failed", res.msg);
    }
  };

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#f093fb"]} // Premium Mesh-like gradient
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Decorative Circle */}
          <View style={styles.decorativeCircle} />

          <Text style={styles.logo}>🍎 CalorieCounter</Text>
          <Text style={styles.subtitle}>Welcome back!</Text>

          <CustomInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <CustomButton
            title={loading ? "Logging in..." : "Log In"}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginBtn}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.linkContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.footerText}>
              New here? <Text style={styles.link}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
    backgroundColor: "rgba(255, 255, 255, 0.92)", // Enhanced Glass effect
    borderRadius: normalize(30),
    padding: normalize(35),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
    overflow: "hidden", // Contain decoration
  },
  decorativeCircle: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(118, 75, 162, 0.1)",
  },
  logo: {
    fontSize: normalize(32),
    fontWeight: "bold",
    color: "#667eea",
    textAlign: "center",
    marginBottom: normalize(5),
  },
  subtitle: {
    fontSize: normalize(16),
    color: "#888",
    textAlign: "center",
    marginBottom: normalize(35),
    letterSpacing: 0.5,
  },
  loginBtn: {
    marginTop: normalize(15),
  },
  linkContainer: {
    marginTop: normalize(25),
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
