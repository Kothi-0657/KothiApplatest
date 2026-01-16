// src/screens/Dashboard.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigate } from "react-router-dom";
import { rmApi } from "../api/rmApi";

/* ===================== TYPES ===================== */
interface DashboardStats {
  total_leads: number;
  new_leads: number;
  inspections_scheduled: number;
}

/* ===================== COMPONENT ===================== */
const Dashboard = () => {
  const navigate = useNavigate();
  const rmId = localStorage.getItem("rm_id");

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===================== AUTH GUARD ===================== */
  useEffect(() => {
    if (!rmId) {
      console.error("❌ RM not logged in");
      navigate("/login");
      return;
    }
    fetchDashboardStats();
  }, []);

  /* ===================== FETCH ===================== */
  const fetchDashboardStats = async () => {
    try {
      const res = await rmApi(`/rm/dashboard?rm_id=${rmId}`);
      setStats(res);
    } catch (err) {
      console.error("❌ Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */
  if (loading)
    return (
      <ActivityIndicator size="large" style={{ marginTop: 60 }} />
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relationship Manager</Text>
      <Text style={styles.subtitle}>Dashboard</Text>

      {/* ===================== STATS ===================== */}
      <View style={styles.statsRow}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{stats?.total_leads ?? 0}</Text>
          <Text style={styles.cardLabel}>Total Leads</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardValue}>{stats?.new_leads ?? 0}</Text>
          <Text style={styles.cardLabel}>New</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardValue}>
            {stats?.inspections_scheduled ?? 0}
          </Text>
          <Text style={styles.cardLabel}>Scheduled</Text>
        </View>
      </View>

      {/* ===================== PRIMARY ACTION ===================== */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigate("/leads")}
      >
        <Text style={styles.primaryText}>Go to Leads</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },
  title: {
    color: "#E5E7EB",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#94A3B8",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#020617",
    padding: 16,
    borderRadius: 12,
    width: "30%",
    alignItems: "center",
  },
  cardValue: {
    color: "#22C55E",
    fontSize: 22,
    fontWeight: "700",
  },
  cardLabel: {
    color: "#94A3B8",
    marginTop: 6,
    fontSize: 12,
  },
  primaryBtn: {
    marginTop: 30,
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
