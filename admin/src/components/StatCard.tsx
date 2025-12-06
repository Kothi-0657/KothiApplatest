import React from "react";

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
};

const StatCard: React.FC<Props> = ({ title, value, subtitle }) => {
  return (
    <div style={{
      background: "#111827",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
      minWidth: 180,
      color: "#fff"
    }}>
      <div style={{ fontSize: 12, color: "#ccc", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>{subtitle}</div>}
    </div>
  );
};

export default StatCard;
