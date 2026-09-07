import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { PREDEFINED_CATEGORIES } from "../constants/categories";

function AddExpense() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    customCategory: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      customCategory: selectedCategory === "Other" ? prev.customCategory : "",
    }));
    setShowCustomInput(selectedCategory === "Other");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      let finalCategory = formData.category;
      if (formData.category === "Other" && formData.customCategory.trim()) {
        finalCategory = formData.customCategory.trim();
      }
      const payload = {
        amount: formData.amount,
        category: finalCategory,
        date: formData.date,
      };
      await api.post("/expenses", payload);
      alert("Expense added successfully");
      navigate("/expenses");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-75">
      <div className="card border-0 shadow-soft rounded-xl" style={{ maxWidth: "480px", width: "100%" }}>
        <div className="card-header bg-primary-gradient text-white text-center py-4 rounded-top-3">
          <h4 className="fw-bold m-0">Record New Expense</h4>
          <p className="m-0 opacity-75">Enter the details of your transaction</p>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="fw-semibold">Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                step="0.01"
                autoFocus
              />
            </div>
            <div className="mb-3">
              <label className="fw-semibold">Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <small className="text-secondary">Choose expense date (defaults to today)</small>
            </div>
            <div className="mb-3">
              <label className="fw-semibold">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={handleCategoryChange}
              >
                {PREDEFINED_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {showCustomInput && (
              <div className="mb-3">
                <label className="fw-semibold">Custom Category</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter custom category"
                  value={formData.customCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, customCategory: e.target.value })
                  }
                />
                <small className="text-secondary">Example: Medical, Education, Subscription</small>
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
              {loading ? "Processing..." : "Add Expense"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
