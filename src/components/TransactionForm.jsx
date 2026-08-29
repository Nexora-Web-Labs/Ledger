import { useState, useEffect } from "react";
import { categories, todayIso } from "../data.js";

const emptyForm = { desc: "", amount: "", category: categories.expense[0].name, date: todayIso };

export default function TransactionForm({ editingTxn, onSave, onCancelEdit, onToast }) {
  const [type, setType] = useState("expense");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTxn) {
      setType(editingTxn.type);
      setForm({ desc: editingTxn.desc, amount: editingTxn.amount, category: editingTxn.category, date: editingTxn.date });
      setErrors({});
    }
  }, [editingTxn]);

  function switchType(t) {
    setType(t);
    setForm((f) => ({ ...f, category: categories[t][0].name }));
  }

  function reset() {
    setType("expense");
    setForm(emptyForm);
    setErrors({});
    onCancelEdit();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!form.desc.trim()) newErrors.desc = true;
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) newErrors.amount = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    onSave({ type, desc: form.desc.trim(), category: form.category, amount: amt, date: form.date || todayIso });
    onToast(editingTxn ? "Transaction updated" : type === "income" ? "Income added" : "Expense added");
    reset();
  }

  return (
    <div className="panel">
      {editingTxn && (
        <div className="edit-banner">
          <span>Editing a transaction</span>
          <button type="button" onClick={reset}>Cancel</button>
        </div>
      )}
      <div className="panel-title">Add a transaction</div>
      <p className="panel-sub">Every entry updates your totals and charts instantly.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="type-toggle">
          <button type="button" className={`type-btn ${type === "expense" ? "active" : ""}`} data-type="expense" onClick={() => switchType("expense")}>Expense</button>
          <button type="button" className={`type-btn ${type === "income" ? "active" : ""}`} data-type="income" onClick={() => switchType("income")}>Income</button>
        </div>

        <div className={`field ${errors.desc ? "invalid" : ""}`}>
          <label htmlFor="desc">Description</label>
          <input id="desc" type="text" placeholder="e.g. Groceries, Client payment" autoComplete="off"
            value={form.desc} onChange={(e) => { setForm((f) => ({ ...f, desc: e.target.value })); setErrors((er) => ({ ...er, desc: false })); }} />
          <div className="field-error">Add a short description.</div>
        </div>

        <div className={`field ${errors.amount ? "invalid" : ""}`}>
          <label htmlFor="amount">Amount (USD)</label>
          <input id="amount" type="number" placeholder="0.00" step="0.01" min="0"
            value={form.amount} onChange={(e) => { setForm((f) => ({ ...f, amount: e.target.value })); setErrors((er) => ({ ...er, amount: false })); }} />
          <div className="field-error">Enter an amount greater than 0.</div>
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            {categories[type].map((c) => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
        </div>

        <button type="submit" className="btn">{editingTxn ? "Save changes" : `Add ${type}`}</button>
        <button type="button" className="btn secondary" onClick={reset}>Clear form</button>
      </form>
    </div>
  );
}
