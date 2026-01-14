import React from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Inspections from "../screens/inspections";
import SummaryPanel from "../components/Summarypannel";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Summary", path: "summary" },
    { label: "Inspections", path: "inspections" },
    { label: "Bookings", path: "bookings" },
    { label: "Payments", path: "payments" },
    { label: "Quotes", path: "quotes" },
    { label: "Work Assessment", path: "assessment" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#020617" }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: "#020617", padding: 20 }}>
        <h3 style={{ color: "#E5E7EB" }}>RM Panel</h3>
        <p style={{ color: "#94A3B8", marginBottom: 20 }}>{user?.name}</p>

        {menu.map((m) => {
          const active = location.pathname.includes(m.path);
          return (
            <motion.div
              key={m.path}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(`/dashboard/${m.path}`)}
              style={{
                padding: "12px 14px",
                marginBottom: 10,
                borderRadius: 10,
                cursor: "pointer",
                background: active ? "#1D4ED8" : "#020617",
                color: "#E5E7EB",
              }}
            >
              {m.label}
            </motion.div>
          );
        })}

        <button
          onClick={logout}
          style={{
            marginTop: 30,
            background: "#EF4444",
            color: "#fff",
            padding: 10,
            width: "100%",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <motion.div
        style={{ flex: 1, padding: 20, overflowY: "auto" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Routes>
          <Route
            path="inspections"
            element={<Inspections frmId={user?.id!} userId={""} />}
          />
          <Route path="*" element={<h2 style={{ color: "#E5E7EB" }}>Select a module</h2>} />
        </Routes>
      </motion.div>
    </div>
  );
};

export default Dashboard;
