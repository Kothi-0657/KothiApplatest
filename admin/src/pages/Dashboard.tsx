// admin/src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import adminAPI from "../api/adminAPI";
import StatCard from "../components/StatCard";
import FilterBar from "../components/FilterBar";
import DataTable from "../components/DataTable";
import Chart from "../components/Chart";

type DashboardResponse = {
  totalCustomers: number;
  totalBookings: number;
  totalRevenue: number;
  graphData: { day: string; revenue: number }[];
  monthly: { months: string[]; series: { category: string; data: number[] }[] };
  cityDistribution: { city: string; bookings: number; revenue: number }[];
  customersList: any[];
  vendorsList: any[];
  paymentsList: any[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ from?: string; to?: string; city?: string; category?: string }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (f = {}) => {
    try {
      setLoading(true);
      const res = await adminAPI.get("/api/dashboard/extended", { params: f });
      setData(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onFilter = (f: any) => {
    setFilters(f);
    loadData(f);
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={{ flex: 1 }} />
        <FilterBar
          from={filters.from}
          to={filters.to}
          onFilter={(p) => onFilter({ ...filters, ...p })}
        />
      </div>

      <div style={styles.statsRow}>
        <StatCard title="Total Customers" value={data?.totalCustomers ?? "—"} />
        <StatCard title="Total Bookings" value={data?.totalBookings ?? "—"} />
        <StatCard title="Total Revenue" value={data ? `₹${data.totalRevenue.toLocaleString()}` : "—"} />
      </div>

      <div style={styles.chartsRow}>
        <div style={styles.chartBox}>
          <h3 style={styles.boxTitle}>Revenue Trend (by day)</h3>
          <Chart type="line" data={data?.graphData || []} xKey="day" yKey="revenue" />
        </div>

        <div style={styles.chartBox}>
          <h3 style={styles.boxTitle}>Monthly Sales by Service Type</h3>
          <Chart type="bar" data={data?.monthly || { months: [], series: [] }} />
        </div>
      </div>

      <div style={styles.tablesRow}>
        <div style={styles.tableCard}>
          <h3 style={styles.boxTitle}>Customers — Progress Report</h3>
          <DataTable
            columns={[
              { title: "Name", dataIndex: "name" },
              { title: "Phone", dataIndex: "phone" },
              { title: "City", dataIndex: "city" },
              { title: "Requested", dataIndex: "requested" },
              { title: "Accepted", dataIndex: "accepted" },
              { title: "Completed", dataIndex: "completed" },
              { title: "Total Bookings", dataIndex: "total_bookings" },
              { title: "Last Booked", dataIndex: "last_booked_at" },
            ]}
            data={data?.customersList || []}
          />
        </div>

        <div style={styles.tableCard}>
          <h3 style={styles.boxTitle}>Vendors & Allocated Services</h3>
          <DataTable
            columns={[
              { title: "Vendor", dataIndex: "name" },
              { title: "Phone", dataIndex: "phone" },
              { title: "Email", dataIndex: "email" },
              { title: "Total Jobs", dataIndex: "total_jobs" },
              { title: "Services Offered", dataIndex: "services_offered_count" },
              { title: "Bookings Assigned", dataIndex: "bookings_assigned" },
            ]}
            data={data?.vendorsList || []}
          />
        </div>

        <div style={styles.tableCardFull}>
          <h3 style={styles.boxTitle}>Recent Payments</h3>
          <DataTable
            columns={[
              { title: "Ref", dataIndex: "payment_ref" },
              { title: "Amount", dataIndex: "amount" },
              { title: "Currency", dataIndex: "currency" },
              { title: "Status", dataIndex: "status" },
              { title: "Method", dataIndex: "method" },
              { title: "Booking Ref", dataIndex: "booking_ref" },
              { title: "Service", dataIndex: "service_name" },
              { title: "Created At", dataIndex: "created_at" },
            ]}
            data={data?.paymentsList || []}
          />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 20,
    background: "#0d0d0d",
    minHeight: "100vh",
    color: "#fff",
  },
  headerRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  title: { margin: 0, color: "#d4af37" },
  statsRow: { display: "flex", gap: 12, marginTop: 12 },
  chartsRow: { display: "flex", gap: 12, marginTop: 20, alignItems: "stretch" },
  chartBox: { flex: 1, background: "#111827", padding: 12, borderRadius: 8 },
  boxTitle: { color: "#d4af37", margin: "0 0 8px 0" },
  tablesRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 },
  tableCard: { background: "#0b1220", padding: 12, borderRadius: 8 },
  tableCardFull: { background: "#0b1220", padding: 12, borderRadius: 8, gridColumn: "1 / span 2" },
};
