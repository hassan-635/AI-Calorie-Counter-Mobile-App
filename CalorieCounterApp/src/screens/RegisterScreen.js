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

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);

    if (res.success) {
      Alert.alert("Success", "Account created! Please log in.");
      navigation.goBack();
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  return (
    <LinearGradient
      colors={["#f093fb", "#f5576c", "#4facfe"]} // Brighter fun gradient
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>✨ Join Us</Text>
          <Text style={styles.subtitle}>Start your healthy journey today!</Text>

          <CustomInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
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
            title={loading ? "Creating Account..." : "Sign Up"}
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.registerBtn}
            color="#f5576c"
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.linkContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.link}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: normalize(20), justifyContent: "center" },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: normalize(30),
    padding: normalize(30),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
  },
  backBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 24,
    color: "#666",
    fontWeight: "bold",
  },
  logo: {
    fontSize: normalize(28),
    fontWeight: "bold",
    color: "#f5576c",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: normalize(15),
    color: "#888",
    textAlign: "center",
    marginBottom: normalize(25),
  },
  registerBtn: { marginTop: normalize(15) },
  linkContainer: { marginTop: normalize(20), alignItems: "center" },
  footerText: { textAlign: "center", color: "#666", fontSize: normalize(14) },
  link: { color: "#f5576c", fontWeight: "bold" },
});
