// admin/src/components/Chart.tsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

type LinePoint = { day: string; revenue: number };
type MonthlyPayload = {
  months: string[];
  series: { category: string; data: number[] }[];
};

type Props = {
  type?: "line" | "bar";
  data: LinePoint[] | MonthlyPayload;
  xKey?: string;
  yKey?: string;
};

const Chart: React.FC<Props> = ({ type = "line", data, xKey = "day", yKey = "revenue" }) => {
  if (type === "line") {
    const lineData = (data as LinePoint[]) || [];
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid stroke="#333" strokeDasharray="3 3" />
          <XAxis dataKey={xKey} stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip contentStyle={{ background: "#111", border: "none" }} />
          <Line type="monotone" dataKey={yKey} stroke="#d4af37" strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // bar chart for monthly: build data points combining months & series
  const payload = data as MonthlyPayload;
  const months = payload?.months || [];
  const series = payload?.series || [];

  // create array of objects: [{ month: '2025-01', 'Cleaning': 1000, 'Plumbing': 200 }, ...]
  const barData = months.map((m, idx) => {
    const obj: any = { month: m };
    series.forEach((s) => {
      obj[s.category] = s.data[idx] ?? 0;
    });
    return obj;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid stroke="#333" strokeDasharray="3 3" />
        <XAxis dataKey="month" stroke="#999" />
        <YAxis stroke="#999" />
        <Tooltip contentStyle={{ background: "#111", border: "none" }} />
        <Legend />
        {series.map((s, i) => (
          <Bar key={s.category} dataKey={s.category} stackId="a" fill={palette[i % palette.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

const palette = ["#d4af37", "#06B6D4", "#F97316", "#10B981", "#8B5CF6", "#EF4444"];

export default Chart;
