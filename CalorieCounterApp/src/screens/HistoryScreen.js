import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import api from "../utils/api";
import { normalize } from "../utils/dimensions";

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/food/logs");
      const logs = res.data;

      // Group by Date
      const grouped = {};
      logs.forEach((item) => {
        const date = new Date(item.createdAt).toDateString(); // "Mon Jan 10 2026"
        if (!grouped[date]) {
          grouped[date] = { date, calories: 0, count: 0 };
        }
        grouped[date].calories += item.calories;
        grouped[date].count += 1;
      });

      // Convert to array and sort (Newest first)
      const sortedHistory = Object.values(grouped).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setHistory(sortedHistory);
      setLoading(false);
    } catch (err) {
      console.log("History Error:", err);
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.cardContainer}>
        <LinearGradient colors={["#ffffff", "#f8f9fa"]} style={styles.card}>
          <View style={styles.leftCol}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.subText}>{item.count} items</Text>
          </View>
          <View style={styles.rightCol}>
            <Text style={styles.calorieText}>
              {parseFloat(item.calories).toFixed(2)} kcal
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>History</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2575fc"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.date}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No history available yet.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
  },
  headerContainer: {
    backgroundColor: "transparent",
    marginBottom: 10,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#2575fc",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  backBtn: {
    padding: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  list: {
    padding: 20,
  },
  cardContainer: {
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: "#888",
  },
  calorieText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6a11cb",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
  },
});

export default HistoryScreen;
