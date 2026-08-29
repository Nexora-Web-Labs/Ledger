import { useState, useMemo } from "react";
import { catMeta, fmt, relDate, categories } from "../data.js";

export default function TransactionList({ transactions, onEdit, onDelete }) {
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [q, setQ] = useState("");

  const allCategoryNames = useMemo(() => {
    const names = [...categories.expense, ...categories.income].map((c) => c.name);
    return Array.from(new Set(names));
  }, []);

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return transactions
      .filter((t) => {
        if (type !== "all" && t.type !== type) return false;
        if (category !== "all" && t.category !== category) return false;
        if (query && !t.desc.toLowerCase().includes(query)) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  }, [transactions, type, category, q]);

  return (
    <>
      <div className="txn-toolbar">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All types</option>
          <option value="expense">Expenses only</option>
          <option value="income">Income only</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {allCategoryNames.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <input type="text" placeholder="Search description…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="txn-count">{rows.length} of {transactions.length}</span>
      </div>

      <div className="txn-list">
        {rows.length === 0 ? (
          <div className="empty-row">No transactions match. Try clearing filters or search.</div>
        ) : rows.map((t) => {
          const meta = catMeta(t.type, t.category);
          return (
            <div className="txn-row" key={t.id}>
              <div className="txn-cat" style={{ background: meta.soft }}>{meta.icon}</div>
              <div className="txn-main">
                <div className="txn-desc">{t.desc}</div>
                <div className="txn-meta">{t.category} · {relDate(t.date)}</div>
              </div>
              <div className="txn-leader"></div>
              <div className={`txn-amount ${t.type}`}>{t.type === "income" ? "+" : "-"}{fmt(t.amount)}</div>
              <div className="txn-actions">
                <button className="icon-btn-sm" title="Edit" onClick={() => onEdit(t)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                </button>
                <button className="icon-btn-sm danger" title="Delete" onClick={() => onDelete(t.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6"/></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
