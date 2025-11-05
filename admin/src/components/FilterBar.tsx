import React, { useState } from "react";

type Props = {
  from?: string;
  to?: string;
  onFilter: (payload: { from?: string; to?: string }) => void;
  cityData?: { city: string; bookings: number; revenue: number }[];
};

export default function FilterBar({ from, to, onFilter, cityData = [] }: Props) {
  const [showCityTable, setShowCityTable] = useState(false);
  const [localFrom, setLocalFrom] = useState(from || "");
  const [localTo, setLocalTo] = useState(to || "");

  const applyFilter = () => {
    onFilter({ from: localFrom, to: localTo });
  };

  return (
    <div
      style={{
        background: "#1a1a1a",
        padding: "16px",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        marginBottom: 24,
        color: "#fff",
      }}
    >
      {/* Filter controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "#aaa" }}>From:</label>
            <input
              type="date"
              value={localFrom}
              onChange={(e) => setLocalFrom(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#aaa" }}>To:</label>
            <input
              type="date"
              value={localTo}
              onChange={(e) => setLocalTo(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button style={applyBtnStyle} onClick={applyFilter}>
            Apply Filters
          </button>
          <button
            style={toggleBtnStyle}
            onClick={() => setShowCityTable(!showCityTable)}
          >
            {showCityTable ? "Hide City Data" : "Show City Data"}
          </button>
        </div>
      </div>

      {/* City-wise distribution table */}
      {showCityTable && (
        <div style={{ marginTop: 20, background: "#111", borderRadius: 8, padding: 12 }}>
          <h4 style={{ color: "#d4af37", marginBottom: 8 }}>City-wise Distribution</h4>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>City</th>
                <th>Bookings</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {cityData.length > 0 ? (
                cityData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.city}</td>
                    <td>{row.bookings}</td>
                    <td>₹{row.revenue.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", color: "#999" }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* 🎨 Styles */
const inputStyle: React.CSSProperties = {
  background: "#222",
  color: "#fff",
  border: "1px solid #333",
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 14,
};

const applyBtnStyle: React.CSSProperties = {
  background: "#d4af37",
  color: "#000",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  cursor: "pointer",
  fontWeight: 600,
};

const toggleBtnStyle: React.CSSProperties = {
  background: "#333",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: 8,
  padding: "8px 16px",
  cursor: "pointer",
  fontWeight: 500,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  color: "#fff",
  fontSize: 14,
};

Object.assign(tableStyle, {
  th: { textAlign: "left", borderBottom: "1px solid #333", padding: "8px" },
  td: { borderBottom: "1px solid #222", padding: "8px" },
});
