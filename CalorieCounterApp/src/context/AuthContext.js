import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api"; // Jo humne axios instance banaya tha

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. App load hotay hi token check karo
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        // Backend ko default header mein token bhej do
        api.defaults.headers.common["x-auth-token"] = storedToken;
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const newToken = res.data.token;

      await AsyncStorage.setItem("token", newToken);
      api.defaults.headers.common["x-auth-token"] = newToken;

      setToken(newToken);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, msg: err.response?.data?.msg || "Login Failed" };
    }
  };

  // 3. Register Function
  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const newToken = res.data.token;

      await AsyncStorage.setItem("token", newToken);
      api.defaults.headers.common["x-auth-token"] = newToken;

      setToken(newToken);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        msg: err.response?.data?.msg || "Signup Failed",
      };
    }
  };

  // 4. Logout Function
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    delete api.defaults.headers.common["x-auth-token"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
