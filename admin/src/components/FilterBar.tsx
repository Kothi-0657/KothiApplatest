// admin/src/components/FilterBar.tsx
import React, { useState } from "react";

type Props = {
  from?: string;
  to?: string;
  onFilter: (p: { from?: string; to?: string; city?: string; category?: string }) => void;
};

const FilterBar: React.FC<Props> = ({ from, to, onFilter }) => {
  const [fromDate, setFromDate] = useState(from || "");
  const [toDate, setToDate] = useState(to || "");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div style={styles.container}>
      <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={styles.input} />
      <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={styles.input} />
      <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} style={styles.input} />
      <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input} />
      <button onClick={() => onFilter({ from: fromDate || undefined, to: toDate || undefined, city: city || undefined, category: category || undefined })} style={styles.button}>Apply</button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { display: "flex", gap: 8, alignItems: "center" },
  input: { padding: 8, borderRadius: 6, border: "1px solid #333", background: "#0b1220", color: "#fff" },
  button: { padding: "8px 12px", borderRadius: 6, border: "none", background: "#d4af37", cursor: "pointer" },
};

export default FilterBar;
