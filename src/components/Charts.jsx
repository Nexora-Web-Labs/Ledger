import { useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { catMeta, fmt, todayDate } from "../data.js";

export function CategoryChart({ transactions }) {
  const data = useMemo(() => {
    const byCat = {};
    transactions.filter((t) => t.type === "expense").forEach((t) => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
    return Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value, color: catMeta("expense", name).color }));
  }, [transactions]);

  if (data.length === 0) {
    return <div style={{ textAlign: "center", color: "var(--text-faint)", fontSize: 13, padding: "40px 0" }}>Add an expense to see the breakdown.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={2}>
          {data.map((d) => <Cell key={d.name} fill={d.color} stroke="#fff" strokeWidth={2} />)}
        </Pie>
        <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "#1E2A22", border: "none", borderRadius: 8, fontFamily: "IBM Plex Mono", fontSize: 11.5, color: "#fff" }} />
        <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "Inter" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({ transactions }) {
  const data = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(todayDate.getFullYear(), todayDate.getMonth() - i, 1);
      months.push({ key: d.getFullYear() + "-" + d.getMonth(), label: d.toLocaleDateString("en-US", { month: "short" }), Income: 0, Expenses: 0 });
    }
    transactions.forEach((t) => {
      const d = new Date(t.date + "T00:00:00");
      const key = d.getFullYear() + "-" + d.getMonth();
      const m = months.find((m) => m.key === key);
      if (m) { if (t.type === "income") m.Income += t.amount; else m.Expenses += t.amount; }
    });
    return months;
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 6, left: -14, bottom: 0 }}>
        <CartesianGrid stroke="#EDF0EA" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#8B9488", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#8B9488", fontSize: 10.5 }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "#1E2A22", border: "none", borderRadius: 8, fontFamily: "IBM Plex Mono", fontSize: 11.5, color: "#fff" }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "Inter" }} />
        <Bar dataKey="Income" fill="#2F5D50" radius={[6, 6, 0, 0]} maxBarSize={22} />
        <Bar dataKey="Expenses" fill="#AF4433" radius={[6, 6, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
