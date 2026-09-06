import React, { useState, useEffect } from "react";
import axios from "./services/api";
import { FaSyncAlt, FaTrash, FaPlusCircle } from "react-icons/fa";

function RecurringExpenses() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Bills & Utilities");
  const [frequency, setFrequency] = useState("monthly");
  const [nextDueDate, setNextDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    try {
      const res = await axios.get("/recurring");
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load recurring expenses", err);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !amount || !nextDueDate) return;

    setLoading(true);
    try {
      await axios.post("/recurring", {
        title,
        amount,
        category,
        frequency,
        next_due_date: nextDueDate,
      });
      setTitle("");
      setAmount("");
      setNextDueDate("");
      loadItems();
    } catch (err) {
      alert("Failed to save recurring item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/recurring/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  const totalMonthlyCommitment = items.reduce((acc, curr) => {
    const val = Number(curr.amount) || 0;
    if (curr.frequency === "yearly") return acc + val / 12;
    if (curr.frequency === "weekly") return acc + val * 4;
    return acc + val;
  }, 0);

  return (
    <div className="card border-0 shadow-soft rounded-xl mb-4 p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <FaSyncAlt className="text-primary" />
          <h6 className="fw-semibold m-0">Recurring Expenses & Subscriptions</h6>
        </div>
        <span className="badge bg-primary text-white">
          Commitment: ₹{Math.round(totalMonthlyCommitment).toLocaleString()}/mo
        </span>
      </div>

      <form onSubmit={handleAdd} className="row g-2 mb-3 align-items-end">
        <div className="col-12 col-md-3">
          <label className="small text-muted">Title</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="e.g. Netflix, Rent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="col-6 col-md-2">
          <label className="small text-muted">Amount (₹)</label>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="col-6 col-md-2">
          <label className="small text-muted">Frequency</label>
          <select
            className="form-select form-select-sm"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div className="col-6 col-md-3">
          <label className="small text-muted">Next Due Date</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={nextDueDate}
            onChange={(e) => setNextDueDate(e.target.value)}
            required
          />
        </div>
        <div className="col-6 col-md-2">
          <button type="submit" className="btn btn-primary btn-sm w-100" disabled={loading}>
            <FaPlusCircle className="me-1" /> Add
          </button>
        </div>
      </form>

      <div className="list-group list-group-flush">
        {items.length === 0 ? (
          <p className="text-muted small text-center my-2">No recurring expenses configured.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-bottom"
            >
              <div>
                <strong className="text-dark d-block">{item.title}</strong>
                <small className="text-secondary">
                  Due: {new Date(item.next_due_date).toLocaleDateString("en-IN")} • {item.frequency}
                </small>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold">₹{Number(item.amount).toLocaleString()}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger border-0"
                  onClick={() => handleDelete(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecurringExpenses;