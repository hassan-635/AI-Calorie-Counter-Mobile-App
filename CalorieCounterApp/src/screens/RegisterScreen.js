import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { normalize } from "../utils/dimensions";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext); // Make sure to add this in Context

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    // Register logic here
    const handleRegister = async () => {
      if (!name || !email || !password) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }

      const res = await register(name, email, password); // Context wala function
      if (res.success) {
        Alert.alert("Success", "Account Created!");
      } else {
        Alert.alert("Error", res.msg);
      }
    };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <CustomButton title="Sign Up" onPress={handleRegister} color="#2196F3" />

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.link}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: normalize(25),
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: normalize(28),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: normalize(15),
    color: "#777",
    textAlign: "center",
    marginBottom: normalize(30),
  },
  footerText: { textAlign: "center", color: "#888" },
  link: { color: "#2196F3", fontWeight: "bold" },
});
