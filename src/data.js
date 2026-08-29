export const categories = {
  expense: [
    { name: "Food", icon: "🍜", color: "#AF4433", soft: "#F6E1DC" },
    { name: "Transport", icon: "🚕", color: "#2F5D50", soft: "#DEEAE4" },
    { name: "Housing", icon: "🏠", color: "#5B4FE9", soft: "#E4E2FB" },
    { name: "Utilities", icon: "💡", color: "#B98A1D", soft: "#F5EACD" },
    { name: "Entertainment", icon: "🎬", color: "#C0447A", soft: "#F7DEEA" },
    { name: "Health", icon: "🩺", color: "#2C7DA0", soft: "#DCEEF5" },
    { name: "Shopping", icon: "🛍️", color: "#8B5E34", soft: "#EFE2D2" },
    { name: "Other", icon: "•••", color: "#5C6659", soft: "#E7EAE3" },
  ],
  income: [
    { name: "Salary", icon: "💼", color: "#2F5D50", soft: "#DEEAE4" },
    { name: "Freelance", icon: "🧾", color: "#B98A1D", soft: "#F5EACD" },
    { name: "Investment", icon: "📈", color: "#2C7DA0", soft: "#DCEEF5" },
    { name: "Gift", icon: "🎁", color: "#C0447A", soft: "#F7DEEA" },
    { name: "Other", icon: "•••", color: "#5C6659", soft: "#E7EAE3" },
  ],
};

export function catMeta(type, name) {
  return categories[type].find((c) => c.name === name) || categories[type][categories[type].length - 1];
}

export const fmt = (n) => (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const today = new Date(2026, 7, 18);
function isoDaysAgo(n) { const d = new Date(today); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); }

export const seedTransactions = [
  { id: 1, type: "income", desc: "Monthly salary", category: "Salary", amount: 4200, date: isoDaysAgo(16) },
  { id: 2, type: "expense", desc: "Rent", category: "Housing", amount: 1350, date: isoDaysAgo(15) },
  { id: 3, type: "expense", desc: "Grocery run", category: "Food", amount: 86.4, date: isoDaysAgo(14) },
  { id: 4, type: "expense", desc: "Metro pass", category: "Transport", amount: 45, date: isoDaysAgo(13) },
  { id: 5, type: "income", desc: "Logo design client", category: "Freelance", amount: 650, date: isoDaysAgo(11) },
  { id: 6, type: "expense", desc: "Electricity bill", category: "Utilities", amount: 78.2, date: isoDaysAgo(10) },
  { id: 7, type: "expense", desc: "Movie night", category: "Entertainment", amount: 32, date: isoDaysAgo(9) },
  { id: 8, type: "expense", desc: "Dentist visit", category: "Health", amount: 120, date: isoDaysAgo(7) },
  { id: 9, type: "expense", desc: "Coffee beans + gear", category: "Shopping", amount: 54.75, date: isoDaysAgo(6) },
  { id: 10, type: "expense", desc: "Weekend groceries", category: "Food", amount: 63.1, date: isoDaysAgo(4) },
  { id: 11, type: "income", desc: "Dividend payout", category: "Investment", amount: 210, date: isoDaysAgo(3) },
  { id: 12, type: "expense", desc: "Ride share", category: "Transport", amount: 22.5, date: isoDaysAgo(2) },
  { id: 13, type: "expense", desc: "Streaming subscriptions", category: "Entertainment", amount: 28, date: isoDaysAgo(1) },
  { id: 14, type: "expense", desc: "Birthday gift", category: "Other", amount: 40, date: isoDaysAgo(0) },
];

export const todayIso = today.toISOString().slice(0, 10);
export const todayDate = today;

export function relDate(iso) {
  const d = new Date(iso + "T00:00:00");
  const diff = Math.round((today - d) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return diff + " days ago";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
