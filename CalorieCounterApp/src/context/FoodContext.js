import React, { createContext, useState } from "react";
import api from "../utils/api";

export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  const addFood = async (foodData) => {
    try {
      const res = await api.post("/food/save", foodData);
      setLogs([res.data.foodEntry, ...logs]); // Dashboard list update hogi
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };

  const analyzeFoodImage = async (base64) => {
    try {
      const res = await api.post("/food/analyze-food", { imageBase64: base64 });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false };
    }
  };

  const analyzeBarcode = async (code) => {
    try {
      const res = await api.get(`/food/barcode/${code}`);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false };
    }
  };

  // FoodContext.js ke andar ye function add karein
  const fetchTodayLogs = async () => {
    try {
      const res = await api.get("/food/logs");
      // Backend returns all logs, so we filter for "Today" on frontend
      const today = new Date().toDateString();
      const todayLogs = res.data.filter(
        (item) => new Date(item.createdAt).toDateString() === today
      );
      setLogs(todayLogs);
    } catch (err) {
      console.log("Fetch Logs Error:", err);
    }
  };

  return (
    <FoodContext.Provider
      value={{
        logs,
        setLogs,
        addFood,
        analyzeFoodImage,
        analyzeBarcode,
        fetchTodayLogs,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};
