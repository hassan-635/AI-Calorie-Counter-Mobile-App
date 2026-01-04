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

  const analyzeFoodText = async (query) => {
    try {
      // Hamara backend route jo humne pehle banaya tha
      const res = await api.post("/food/analyze-food", { query });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, msg: "Could not find nutrition info" };
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
      const res = await api.get("/food/logs"); // Backend endpoint jo aaj ke logs dega
      setLogs(res.data);
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
        analyzeFoodText,
        analyzeFoodImage,
        analyzeBarcode,
        fetchTodayLogs,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};
