import React, { useEffect, useState } from "react";
import axios from "axios";

interface Service {
  id: string;
  category: string;
  sub_category?: string;
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
  fontSize: 14,
  width: "90%",
  boxSizing: "border-box",
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  color: "#000",
  borderRadius: 10,
  padding: 16,
  boxShadow: "0 6px 18px rgba(16,24,40,0.06)",
  border: "1px solid #e6e6e6",
  width: "100%",
  maxWidth: "100%",
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #555",
  background: "#fff",
  color: "#000",
  padding: "6px 8px",
  borderRadius: 6,
  outline: "none",
  fontSize: 13,
};

const primaryBtnStyle: React.CSSProperties = {
  backgroundColor: "#f6951fff",
  color: "#000",
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
};

const tableWrapperStyle: React.CSSProperties = {
  marginTop: 14,
  background: "#ffffff",
  padding: 12,
  borderRadius: 10,
  overflowX: "auto",
  border: "1px solid #e6e6e6",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  color: "#51687fff",
  fontSize: 13,
  minWidth: 600, // ensures table does not shrink too much
};

const headerRowStyle: React.CSSProperties = {
  backgroundColor: "#7c7979ff",
  color: "#090905ff",
  fontSize: 13,
};

const cellStyle: React.CSSProperties = {
  padding: "8px 10px",
  textAlign: "left",
  borderBottom: "1px solid #e6e6e6",
  color: "#000",
};

const actionBtnStyle: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: 4,
  border: "none",
  cursor: "pointer",
  color: "#fff",
  fontSize: 12,
};

// ---------- Component ----------
export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [form, setForm] = useState({ category: "", sub_category: "", name: "", price: "" });
  const [editing, setEditing] = useState<Service | null>(null);

  // ---------- Fetch Services ----------
  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/services");
      const data = (res.data?.data || res.data?.services || []) as Service[];
      setServices(data);

      // Extract unique subcategories for dropdown
      const uniqueSub = Array.from(
        new Set(
          data
            .map((s: Service) => s.sub_category)
            .filter((v): v is string => v !== undefined && v !== null && v !== "")
        )
      );
      setSubCategories(uniqueSub);
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
    setForm({ category: "", sub_category: "", name: "", price: "" });
    setEditing(null);
  };

  // ---------- CRUD Actions ----------
  const handleAdd = async () => {
    if (!form.category || !form.sub_category || !form.name || !form.price) {
      alert("All fields are required");
      return;
    }
    try {
      await axios.post("http://localhost:4000/api/services", {
        category: form.category,
        sub_category: form.sub_category,
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
    if (!form.category || !form.sub_category || !form.name || !form.price) {
      alert("All fields are required");
      return;
    }
    try {
      await axios.put(`http://localhost:4000/api/services/${editing.id}`, {
        category: form.category,
        sub_category: form.sub_category,
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
      category: service.category || "",
      sub_category: service.sub_category || "",
      name: service.name,
      price: String(service.price),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- UI ----------
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: "#1f2937", margin: 0, marginBottom: 12, fontSize: 18 }}>
          Manage Services
        </h2>

        {/* Form Section */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            style={{ ...inputStyle, minWidth: 100 }}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            list="subcategories"
            placeholder="Sub Category"
            value={form.sub_category}
            onChange={(e) => handleChange("sub_category", e.target.value)}
            style={{ ...inputStyle, minWidth: 100 }}
          />
          <datalist id="subcategories">
            {subCategories.map((sc) => (
              <option key={sc} value={sc} />
            ))}
          </datalist>

          <input
            placeholder="Line Item"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: 100 }}
          />

          <input
            placeholder="Price (₹)"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            style={{ ...inputStyle, width: 100 }}
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
                <th style={cellStyle}>Sub Category</th>
                <th style={cellStyle}>Line Item</th>
                <th style={cellStyle}>Price (₹)</th>
                <th style={{ ...cellStyle, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 12, color: "#acb3c2ff", textAlign: "center" }}>
                    No services found.
                  </td>
                </tr>
              ) : (
                services.map((srv) => (
                  <tr key={srv.id} style={{ borderBottom: "1px solid #e6e6e6" }}>
                    <td style={cellStyle}>{srv.category || "-"}</td>
                    <td style={cellStyle}>{srv.sub_category || "-"}</td>
                    <td style={cellStyle}>{srv.name}</td>
                    <td style={cellStyle}>{srv.price}</td>
                    <td style={{ ...cellStyle, textAlign: "center" }}>
                      <button
                        onClick={() => startEditing(srv)}
                        style={{ ...actionBtnStyle, background: "#007bff", marginRight: 6 }}
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
