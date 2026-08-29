import { useState, useCallback, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { seedTransactions, todayDate } from "./data.js";
import SummaryCards from "./components/SummaryCards.jsx";
import TransactionForm from "./components/TransactionForm.jsx";
import TransactionList from "./components/TransactionList.jsx";
import { CategoryChart, TrendChart } from "./components/Charts.jsx";

export default function App() {
  const [transactions, setTransactions] = useLocalStorage("ledger.transactions.v1", seedTransactions);
  const [editingId, setEditingId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);

  const editingTxn = transactions.find((t) => t.id === editingId) || null;

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
  }, []);

  function handleSave(payload) {
    if (editingId) {
      setTransactions((txns) => txns.map((t) => (t.id === editingId ? { ...t, ...payload } : t)));
      setEditingId(null);
    } else {
      const nextId = transactions.length ? Math.max(...transactions.map((t) => t.id)) + 1 : 1;
      setTransactions((txns) => [{ id: nextId, ...payload }, ...txns]);
    }
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this transaction? This can't be undone.")) return;
    setTransactions((txns) => txns.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
    showToast("Transaction deleted");
  }

  return (
    <div className="wrap">
      <header className="top">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/><path d="M9 13h6M9 17h6M9 9h2"/></svg>
          </div>
          <div>
            <h1>Ledger</h1>
            <p>Personal finance, kept honestly</p>
          </div>
        </div>
        <div className="today">
          <b>{todayDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</b>
          This month's activity
        </div>
      </header>

      <SummaryCards transactions={transactions} />

      <div className="layout">
        <TransactionForm
          editingTxn={editingTxn}
          onSave={handleSave}
          onCancelEdit={() => setEditingId(null)}
          onToast={showToast}
        />

        <div>
          <div className="charts-row">
            <div className="chart-panel">
              <div className="panel-title">Monthly trend</div>
              <p className="panel-sub" style={{ marginBottom: 10 }}>Income vs. expenses, last 6 months</p>
              <TrendChart transactions={transactions} />
            </div>
            <div className="chart-panel">
              <div className="panel-title">Where it goes</div>
              <p className="panel-sub" style={{ marginBottom: 10 }}>Expense breakdown by category</p>
              <CategoryChart transactions={transactions} />
            </div>
          </div>

          <TransactionList
            transactions={transactions}
            onEdit={(t) => setEditingId(t.id)}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <div className={`toast ${toastVisible ? "show" : ""}`}>{toastMsg}</div>
    </div>
  );
}
