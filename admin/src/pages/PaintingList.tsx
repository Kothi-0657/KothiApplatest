import React, { useEffect, useState } from "react";
import axios from "axios";

interface PaintingRate {
  id: string;
  paint_brand: string;
  base_type: string;
  subject_area: string;
  rate: number;
}

/* ---------- Constants ---------- */
const BASE_TYPES = ["Fresh Painting", "Re Painting"];
const SUBJECT_AREAS = ["Wall", "Ceiling"];

/* ---------- Styles (reused from services.tsx) ---------- */
const containerStyle: React.CSSProperties = {
  padding: 15,
  minHeight: "100vh",
  background: "linear-gradient(135deg, #000000, #1a1a1a)",
  color: "#fff",
  fontSize: 14,
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  color: "#000",
  borderRadius: 10,
  padding: 16,
  boxShadow: "0 6px 18px rgba(16,24,40,0.06)",
  border: "1px solid #e6e6e6",
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
  backgroundColor: "#ffd700",
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
  fontSize: 13,
};

const headerRowStyle: React.CSSProperties = {
  backgroundColor: "#333",
  color: "#ffd700",
};

const cellStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #e6e6e6",
};

const actionBtnStyle: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: 4,
  border: "none",
  cursor: "pointer",
  color: "#fff",
  fontSize: 12,
};

/* ---------- Component ---------- */
export default function PaintingList() {
  const [rates, setRates] = useState<PaintingRate[]>([]);
  const [editing, setEditing] = useState<PaintingRate | null>(null);

  const [form, setForm] = useState({
    paint_brand: "",
    base_type: "",
    subject_area: "",
    rate: "",
  });

  /* ---------- Fetch ---------- */
  const fetchRates = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/painting-rates");
      setRates(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching painting rates", err);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  /* ---------- Helpers ---------- */
  const handleChange = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm({ paint_brand: "", base_type: "", subject_area: "", rate: "" });
    setEditing(null);
  };

  /* ---------- CRUD ---------- */
  const handleAdd = async () => {
    if (!form.paint_brand || !form.base_type || !form.subject_area || !form.rate) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/painting-rates", {
        paint_brand: form.paint_brand,
        base_type: form.base_type,
        subject_area: form.subject_area,
        rate: Number(form.rate),
      });
      resetForm();
      fetchRates();
    } catch (err) {
      alert("Failed to add painting rate");
    }
  };

  const handleEdit = async () => {
    if (!editing) return;

    try {
      await axios.put(
        `http://localhost:4000/api/painting-rates/${editing.id}`,
        {
          paint_brand: form.paint_brand,
          base_type: form.base_type,
          subject_area: form.subject_area,
          rate: Number(form.rate),
        }
      );
      resetForm();
      fetchRates();
    } catch (err) {
      alert("Failed to update painting rate");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this painting rate?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/painting-rates/${id}`);
      fetchRates();
    } catch {
      alert("Failed to delete");
    }
  };

  const startEditing = (row: PaintingRate) => {
    setEditing(row);
    setForm({
      paint_brand: row.paint_brand,
      base_type: row.base_type,
      subject_area: row.subject_area,
      rate: String(row.rate),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- UI ---------- */
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: 12 }}>Manage Painting Rates</h2>

        {/* Form */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            placeholder="Paint Brand"
            value={form.paint_brand}
            onChange={(e) => handleChange("paint_brand", e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: 220 }}
          />

          <select
            value={form.base_type}
            onChange={(e) => handleChange("base_type", e.target.value)}
            style={inputStyle}
          >
            <option value="">Base Type</option>
            {BASE_TYPES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <select
            value={form.subject_area}
            onChange={(e) => handleChange("subject_area", e.target.value)}
            style={inputStyle}
          >
            <option value="">Subject Area</option>
            {SUBJECT_AREAS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            placeholder="Rate (₹)"
            value={form.rate}
            onChange={(e) => handleChange("rate", e.target.value)}
            style={{ ...inputStyle, width: 120 }}
          />

          {!editing ? (
            <button onClick={handleAdd} style={primaryBtnStyle}>Add</button>
          ) : (
            <>
              <button onClick={handleEdit} style={{ ...primaryBtnStyle, background: "#10b981" }}>
                Save
              </button>
              <button onClick={resetForm} style={{ ...primaryBtnStyle, background: "#6b7280", color: "#fff" }}>
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Table */}
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
                <th style={cellStyle}>Paint Brand</th>
                <th style={cellStyle}>Base Type</th>
                <th style={cellStyle}>Area</th>
                <th style={cellStyle}>Rate (₹)</th>
                <th style={{ ...cellStyle, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r) => (
                <tr key={r.id}>
                  <td style={cellStyle}>{r.paint_brand}</td>
                  <td style={cellStyle}>{r.base_type}</td>
                  <td style={cellStyle}>{r.subject_area}</td>
                  <td style={cellStyle}>{r.rate}</td>
                  <td style={{ ...cellStyle, textAlign: "center" }}>
                    <button
                      onClick={() => startEditing(r)}
                      style={{ ...actionBtnStyle, background: "#007bff", marginRight: 6 }}
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      style={{ ...actionBtnStyle, background: "#dc3545" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {rates.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 12 }}>
                    No painting rates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
