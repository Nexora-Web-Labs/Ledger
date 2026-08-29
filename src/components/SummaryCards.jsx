import { useMemo } from "react";
import { fmt } from "../data.js";

export default function SummaryCards({ transactions }) {
  const { incomeSum, expenseSum, incomeCount, expenseCount, balance, topCat } = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income");
    const expense = transactions.filter((t) => t.type === "expense");
    const incomeSum = income.reduce((s, t) => s + t.amount, 0);
    const expenseSum = expense.reduce((s, t) => s + t.amount, 0);
    const byCat = {};
    expense.forEach((t) => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
    const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    return {
      incomeSum, expenseSum, incomeCount: income.length, expenseCount: expense.length,
      balance: incomeSum - expenseSum, topCat: top || null,
    };
  }, [transactions]);

  return (
    <div className="summary-grid">
      <div className="sum-card income">
        <div className="sum-label">Income</div>
        <div className="sum-value pos mono">{fmt(incomeSum)}</div>
        <div className="sum-note">{incomeCount} entries</div>
      </div>
      <div className="sum-card expense">
        <div className="sum-label">Expenses</div>
        <div className="sum-value neg mono">{fmt(expenseSum)}</div>
        <div className="sum-note">{expenseCount} entries</div>
      </div>
      <div className="sum-card balance">
        <div className="sum-label">Net balance</div>
        <div className={`sum-value mono ${balance >= 0 ? "pos" : "neg"}`}>{fmt(balance)}</div>
        <div className="sum-note">Income minus expenses</div>
      </div>
      <div className="sum-card top">
        <div className="sum-label">Top category</div>
        <div className="sum-value" style={{ fontSize: 19 }}>{topCat ? topCat[0] : "—"}</div>
        <div className="sum-note">{topCat ? fmt(topCat[1]) + " spent" : "No expenses yet"}</div>
      </div>
    </div>
  );
}
