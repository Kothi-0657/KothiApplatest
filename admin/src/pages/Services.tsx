import React, { useEffect, useState } from "react";
import axios from "axios";

interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  icon?: string;
}

const categories = [
  "Home Service",
  "Home Renovations",
  "Constructions",
  "Packers and Movers",
  "Home Inspections",
];

// ---------- Styles ----------
const containerStyle: React.CSSProperties = {
  padding: 20,
  minHeight: "100vh",
  background: "linear-gradient(135deg, #000000, #1a1a1a)",
  color: "#fff",
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  color: "#000",
  borderRadius: 10,
  padding: 20,
  boxShadow: "0 6px 18px rgba(16,24,40,0.06)",
  border: "1px solid #e6e6e6",
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #555",
  background: "#fff",
  color: "#000",
  padding: "8px 10px",
  borderRadius: 8,
  outline: "none",
};

const primaryBtnStyle: React.CSSProperties = {
  backgroundColor: "#ffd700",
  color: "#000",
  padding: "9px 14px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const tableWrapperStyle: React.CSSProperties = {
  marginTop: 18,
  background: "#ffffff",
  padding: 14,
  borderRadius: 10,
  overflowX: "auto",
  border: "1px solid #e6e6e6",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  color: "#000",
};

const headerRowStyle: React.CSSProperties = {
  backgroundColor: "#333",
  color: "#ffd700",
};

const cellStyle: React.CSSProperties = {
  padding: "12px 14px",
  textAlign: "left",
  borderBottom: "1px solid #e6e6e6",
  color: "#000",
};

const actionBtnStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  color: "#fff",
};

// ---------- Component ----------
export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({ category: "", name: "", price: "" });
  const [editing, setEditing] = useState<Service | null>(null);

  // ---------- Fetch Services ----------
  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/services");
      setServices(res.data.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ---------- Form Handlers ----------
  const handleChange = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm({ category: "", name: "", price: "" });
    setEditing(null);
  };

  // ---------- CRUD Actions ----------
  const handleAdd = async () => {
    if (!form.category || !form.name || !form.price) {
      alert("All fields are required");
      return;
    }
    try {
      await axios.post("http://localhost:4000/api/services", {
        category: form.category,
        name: form.name,
        price: Number(form.price),
      });
      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service");
    }
  };

  const handleEdit = async () => {
    if (!editing) return;
    if (!form.category || !form.name || !form.price) {
      alert("All fields are required");
      return;
    }
    try {
      await axios.put(`http://localhost:4000/api/services/${editing.id}`, {
        category: form.category,
        name: form.name,
        price: Number(form.price),
      });
      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Failed to update service");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/services/${id}`);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    }
  };

  const startEditing = (service: Service) => {
    setEditing(service);
    setForm({
      category: service.category,
      name: service.name,
      price: String(service.price),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- UI ----------
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: "#1f2937", margin: 0, marginBottom: 12, fontSize: 20 }}>
          Manage Services
        </h2>

        {/* Form Section */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            style={{ ...inputStyle, minWidth: 180 }}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            placeholder="Line Item"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: 220 }}
          />

          <input
            placeholder="Price (₹)"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            style={{ ...inputStyle, width: 120 }}
          />

          {!editing ? (
            <button onClick={handleAdd} style={primaryBtnStyle}>
              Add
            </button>
          ) : (
            <>
              <button
                onClick={handleEdit}
                style={{ ...primaryBtnStyle, background: "#10b981" }}
              >
                Save
              </button>
              <button
                onClick={resetForm}
                style={{ ...primaryBtnStyle, background: "#6b7280", color: "#fff" }}
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Table Section */}
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
                <th style={cellStyle}>Category</th>
                <th style={cellStyle}>Line Item</th>
                <th style={cellStyle}>Price (₹)</th>
                <th style={{ ...cellStyle, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 20, color: "#6b7280", textAlign: "center" }}>
                    No services found.
                  </td>
                </tr>
              ) : (
                services.map((srv) => (
                  <tr key={srv.id} style={{ borderBottom: "1px solid #e6e6e6" }}>
                    <td style={cellStyle}>{srv.category}</td>
                    <td style={cellStyle}>{srv.name}</td>
                    <td style={cellStyle}>{srv.price}</td>
                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      <button
                        onClick={() => startEditing(srv)}
                        style={{ ...actionBtnStyle, background: "#007bff", marginRight: 8 }}
                      >
                        Modify
                      </button>
                      <button
                        onClick={() => handleDelete(srv.id)}
                        style={{ ...actionBtnStyle, background: "#dc3545" }}
                      >
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
    </div>
  );
}
