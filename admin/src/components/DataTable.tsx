// src/components/DataTable.tsx
import React from "react";

type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
};

export default function DataTable<T>({ columns, data }: Props<T>) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8 }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #eee" }}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, idx: number) => (
          <tr key={idx}>
            {columns.map((c) => (
              <td key={c.key} style={{ padding: 12, borderBottom: "1px solid #f4f4f4" }}>
                {c.render ? c.render(row) : row[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
