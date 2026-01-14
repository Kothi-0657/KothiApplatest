import { useEffect, useState } from "react";
import { fetchCustomers, updateCustomersStatus, deleteCustomers } from "../api/adminAPI";

interface Customers {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customers[]>([]);

  const loadCustomers = async () => {
    try {
      const list = await fetchCustomers();
      setCustomers(list);
    } catch (err) {
      console.error("Error loading Customers:", err);
      alert("Failed to load Customers");
    }
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateCustomersStatus(id, status);
      loadCustomers();
    } catch (err) {
      alert("Failed to update user");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete customer?")) return;
    await deleteCustomers(id);
    loadCustomers();
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // ---------- Styles ----------
  const containerStyle: React.CSSProperties = {
    padding: 24,
    minHeight: "100vh",
    background: "#0d0d0d",
    color: "#fff",
    width: "200%",
    maxWidth: "1200px", // optional, keeps content readable
    margin: "0 auto", // center the content
  };

  const tableWrapperStyle: React.CSSProperties = {
    marginTop: 20,
    overflowX: "auto",
    borderRadius: 8,
    border: "1px solid #333",
    background: "#111827",
    width: "100%",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px", // ensure table stretches properly
  };

  const thStyle: React.CSSProperties = {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #555",
    color: "#fff",
    backgroundColor: "#1f2937",
    fontWeight: 600,
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px",
    borderBottom: "1px solid #333",
    color: "#fff",
  };

  const selectStyle: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 4,
    border: "1px solid #555",
    background: "#0d0d0d",
    color: "#fff",
    cursor: "pointer",
  };

  const deleteBtnStyle: React.CSSProperties = {
    padding: "6px 12px",
    border: "none",
    borderRadius: 4,
    background: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  };

  // ---------- Render ----------
  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 20 }}>Customers</h2>

      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 16, textAlign: "center", color: "#888" }}>
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((u) => (
                <tr key={u.id}>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.phone}</td>
                  <td style={tdStyle}>
                    <select
                      value={u.status}
                      onChange={(e) => handleStatus(u.id, e.target.value)}
                      style={selectStyle}
                    >
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <button onClick={() => handleDelete(u.id)} style={deleteBtnStyle}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
