import React, { useEffect, useState } from "react";
import adminAPI from "../api/adminAPI";

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  city?: string;
};

type UserDetail = {
  id: number;
  totalBookings: number;
  totalPayments: number;
  pendingPayments: number;
  recentServices: { service: string; date: string; status: string }[];
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.get("/users");
      const data = res.data?.users || res.data || [];
      setUsers(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    const q = query.toLowerCase();
    const f = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.city?.toLowerCase().includes(q)
    );
    setFiltered(f);
  };

  const removeUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await adminAPI.delete(`/users/${id}`);
    loadUsers();
  };

  const viewDetails = async (id: number) => {
    try {
      const res = await adminAPI.get(`/users/${id}/details`);
      setSelectedUser(res.data);
    } catch (err) {
      console.error("User details error", err);
      alert("Could not load user details");
    }
  };

  const addUser = async () => {
    const name = prompt("Name");
    const email = prompt("Email");
    const phone = prompt("Phone (optional)");
    const city = prompt("City (optional)");
    const password = prompt("Set password for this user");

    if (!name || !email || !password) return alert("Name, Email, and Password required.");

    try {
      await adminAPI.post("/users", { name, email, phone, city, password });
      loadUsers();
    } catch (err) {
      alert("Failed to add user");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "1rem 1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontWeight: 600, fontSize: "1.4rem" }}>👥 User Management</h2>
        <button
          onClick={addUser}
          style={{
            background: "#c9b37a",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            color: "white",
            cursor: "pointer",
          }}
        >
          + Add User
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name, email or city..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ccc",
          marginBottom: 20,
          fontSize: "0.95rem",
        }}
      />

      {/* User Table */}
      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>No users found.</p>
      ) : (
        <div
          style={{
            background: "white",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f5f5f5" }}>
              <tr>
                {["Name", "Email", "Phone", "Role", "City", "Actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderBottom: "1px solid #ddd",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "#444",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr
                  key={u.id}
                  style={{
                    background: i % 2 === 0 ? "#fff" : "#fafafa",
                    borderBottom: "1px solid #eee",
                    transition: "background 0.2s",
                  }}
                >
                  <td style={{ padding: "10px 14px" }}>{u.name}</td>
                  <td style={{ padding: "10px 14px" }}>{u.email}</td>
                  <td style={{ padding: "10px 14px" }}>{u.phone || "—"}</td>
                  <td style={{ padding: "10px 14px" }}>{u.role}</td>
                  <td style={{ padding: "10px 14px" }}>{u.city || "—"}</td>
                  <td style={{ padding: "10px 14px", display: "flex", gap: 6 }}>
                    <button
                      onClick={() => {
                        const newRole = prompt("New Role", u.role);
                        if (newRole)
                          adminAPI.put(`/users/${u.id}`, { ...u, role: newRole }).then(loadUsers);
                      }}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 5,
                        border: "none",
                        background: "#ececec",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeUser(u.id)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 5,
                        border: "none",
                        background: "#ffdfdf",
                        color: "#b00000",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => viewDetails(u.id)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 5,
                        border: "none",
                        background: "#c9b37a",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details Drawer */}
      {selectedUser && (
        <div
          style={{
            marginTop: 24,
            background: "#f9f9f9",
            padding: 16,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        >
          <h3>User Details</h3>
          <p><strong>User ID:</strong> {selectedUser.id}</p>
          <p><strong>Total Bookings:</strong> {selectedUser.totalBookings}</p>
          <p><strong>Total Payments:</strong> ₹{selectedUser.totalPayments}</p>
          <p><strong>Pending Payments:</strong> ₹{selectedUser.pendingPayments}</p>

          <h4 style={{ marginTop: 12 }}>Recent Services:</h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Service</th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Date</th>
                <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedUser.recentServices.map((s, i) => (
                <tr key={i}>
                  <td style={{ padding: 8 }}>{s.service}</td>
                  <td style={{ padding: 8 }}>{new Date(s.date).toLocaleDateString()}</td>
                  <td style={{ padding: 8 }}>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => setSelectedUser(null)}
              style={{
                padding: "6px 12px",
                background: "#ddd",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
