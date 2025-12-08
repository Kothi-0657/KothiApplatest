// src/layouts/AdminLayout.tsx
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const menu = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/services", label: "Services" },
  { to: "/customers", label: "customers" },
  { to: "/payments", label: "Payments" },
  { to: "/vendors", label: "Vendors" },
  { to: "/bookings", label: "Bookings" },
];

export default function AdminLayout() {
  const location = useLocation();
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <aside style={{ width: 240, background: "#0b1220", color: "#fff", padding: 20 }}>
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ margin: 0 }}>Kothi Admin</h2>
          <div style={{ color: "#c9b37a", marginTop: 6 }}>Admin Portal</div>
        </div>

        <nav>
          {menu.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              style={{
                display: "block",
                padding: "10px 12px",
                color: location.pathname.startsWith(m.to) ? "#0b1220" : "#fff",
                background: location.pathname.startsWith(m.to) ? "#c9b37a" : "transparent",
                borderRadius: 8,
                marginBottom: 8,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              {m.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, background: "#f6f7fb", padding: 24 }}>
        <header style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Admin Dashboard</h3>
            <div>
              <button style={{ marginRight: 8 }}>Profile</button>
              <button>Logout</button>
            </div>
          </div>
        </header>

        <section>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
