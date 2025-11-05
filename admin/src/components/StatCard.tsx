// src/components/StatCard.tsx
import React from "react";

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function StatCard({ title, value, subtitle }: Props) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 6px 20px rgba(11,18,32,0.08)",
      minWidth: 180
    }}>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>{subtitle}</div>}
    </div>
  );
}
