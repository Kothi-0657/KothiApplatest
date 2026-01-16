// src/layouts/AdminLayout.tsx
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const menu = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/services", label: "Services" },
  { to: "/customers", label: "Customers" },
  { to: "/payments", label: "Payments" },
  { to: "/vendors", label: "Vendors" },
  { to: "/bookings", label: "Bookings" },
  { to: "/paintinglist", label: "Painting Rates" },
  { to: "/user-management", label: "User Management" },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        minHeight: "100vh",
        overflow: "hidden",
        fontFamily: "Inter, system-ui, sans-serif",
        background: "#0d0d0d",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          background: "#0b1220",
          color: "#fff",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Kothi Admin</h2>
          <div style={{ color: "#c9b37a", marginTop: 6, fontSize: 13 }}>
            Admin Portal
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {menu.map((m) => {
            const active = location.pathname.startsWith(m.to);
            return (
              <Link
                key={m.to}
                to={m.to}
                style={{
                  display: "block",
                  padding: "12px 14px",
                  color: active ? "#0b1220" : "#fff",
                  background: active ? "#c9b37a" : "transparent",
                  borderRadius: 10,
                  marginBottom: 8,
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
              >
                {m.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          minWidth: 0, // 🔥 VERY IMPORTANT for full-width tables
          display: "flex",
          flexDirection: "column",
          background: "#0d0d0d",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0, color: "#fff", fontSize: 18 }}>
            Admin Dashboard
          </h3>

          <div>
            <button
              style={{
                marginRight: 10,
                padding: "6px 12px",
                background: "#1f2937",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Profile
            </button>
            <button
              style={{
                padding: "6px 12px",
                background: "#c9b37a",
                color: "#0b1220",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <section
          style={{
            flex: 1,
            width: "100%",
            padding: 24,
            overflowX: "auto", // 🔥 tables will never squeeze
          }}
        >
          <Outlet />
        </section>
      </main>
    </div>
  );
}
