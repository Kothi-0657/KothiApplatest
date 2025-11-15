import React, { useEffect, useState } from "react";
import adminAPI from "../api/adminAPI";
import StatCard from "../components/StatCard";
import FilterBar from "../components/FilterBar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type DashboardData = {
  totalCustomers: number;
  totalBookings: number;
  totalRevenue: number;
  graphData: { day: string; revenue: number }[];
  cityDistribution: { city: string; bookings: number; revenue: number }[];
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [filters, setFilters] = useState<{ from?: string; to?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboard(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboard = async (f = {}) => {
    try {
      setLoading(true);
      const res = await adminAPI.get("/dashboard", { params: f });
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (p: { from?: string; to?: string }) => {
    setFilters(p);
    fetchDashboard(p);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📊 Admin Dashboard</h2>

      {/* 🔍 Filter Section */}
      <FilterBar
        from={filters.from}
        to={filters.to}
        onFilter={handleFilter}
        cityData={stats?.cityDistribution || []}
      />

      {/* Stats Overview */}
      {loading ? (
        <p style={styles.loading}>Loading data...</p>
      ) : (
        <>
          <div style={styles.statsGrid}>
            <StatCard title="Total Customers" value={stats?.totalCustomers ?? "—"} />
            <StatCard title="Total Bookings" value={stats?.totalBookings ?? "—"} />
            <StatCard
              title="Total Revenue"
              value={
                stats?.totalRevenue
                  ? `₹${stats.totalRevenue.toLocaleString()}`
                  : "₹0"
              }
            />
          </div>

          {/* Revenue Chart */}
          <div style={styles.chartContainer}>
            <h3 style={styles.subHeader}>Revenue Trend (By Day)</h3>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    stats?.graphData?.map((g) => ({
                      day: g.day,
                      revenue: Number(g.revenue),
                    })) || []
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="day" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#222",
                      border: "none",
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: "#d4af37" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#d4af37"
                    strokeWidth={2}
                    dot={{ fill: "#d4af37" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* 🎨 Styles */
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 24,
    backgroundColor: "#0d0d0d",
    minHeight: "100vh",
    color: "#302d2dff",
  },
  header: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 16,
    color: "#d4af37",
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 8,
    color: "#d4af37",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 16,
  },
  chartContainer: {
    marginTop: 32,
    background: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
  },
  loading: {
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
};
