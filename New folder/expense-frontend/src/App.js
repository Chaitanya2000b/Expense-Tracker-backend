import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API = "http://localhost:3000/api";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
  });

  // Fetch all expenses
  const fetchExpenses = async () => {
    const res = await axios.get(`${API}/expenses`);
    setExpenses(res.data);
  };

  // Fetch monthly totals
  const fetchMonthly = async () => {
    const res = await axios.get(`${API}/monthly`);
    setMonthly(res.data);
  };

  // Load data on first render
  useEffect(() => {
    fetchExpenses();
    fetchMonthly();
  }, []);

  // Add new expense
  const addExpense = async (e) => {
    e.preventDefault();

    await axios.post(`${API}/expenses`, {
      ...form,
      amount: Number(form.amount),
    });

    setForm({ amount: "", category: "", description: "" });

    // Refresh both lists
    fetchExpenses();
    fetchMonthly();
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto", fontFamily: "Arial" }}>
      <h1>💰 Expense Tracker</h1>

      {/* Form */}
      <form onSubmit={addExpense} style={{ marginBottom: 20 }}>
        <input
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          style={{ marginRight: 8 }}
          required
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ marginRight: 8 }}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <button type="submit">Add</button>
      </form>

      {/* Expense list */}
      <h2>All Expenses</h2>
      <ul>
        {expenses.map((e) => (
          <li key={e._id}>
            ₹{e.amount} — {e.category} — {e.description}
          </li>
        ))}
      </ul>

      {/* Monthly chart */}
      <h2 style={{ marginTop: 30 }}>Monthly Spending</h2>

      {monthly.length === 0 ? (
        <p>No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthly}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default App;
