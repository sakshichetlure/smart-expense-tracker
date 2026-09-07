import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // ---- FETCH EXPENSES ----
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ---- FILTER & SORT ----
  const filterAndSortExpenses = useCallback(() => {
    let filtered = [...expenses];
    if (searchTerm) {
      filtered = filtered.filter(exp =>
        exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.amount.toString().includes(searchTerm)
      );
    }
    if (categoryFilter !== "All") {
      filtered = filtered.filter(exp => exp.category === categoryFilter);
    }
    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortField === "amount") {
        aVal = Number(a.amount);
        bVal = Number(b.amount);
      } else if (sortField === "category") {
        aVal = a.category;
        bVal = b.category;
      } else {
        aVal = new Date(a.created_at || Date.now());
        bVal = new Date(b.created_at || Date.now());
      }
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    setFilteredExpenses(filtered);
  }, [expenses, searchTerm, categoryFilter, sortField, sortOrder]);

  useEffect(() => {
    filterAndSortExpenses();
  }, [filterAndSortExpenses]);

  // ---- UNIQUE CATEGORIES ----
  const allCategories = ["All", ...new Set(expenses.map(exp => exp.category))];

  // ---- HANDLERS ----
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(`/expenses/${id}`);
        setExpenses(prev => prev.filter(exp => exp.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete expense");
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // ---- LOADING ----
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-secondary mt-2">Loading expenses...</p>
      </div>
    );
  }

  // ---- RENDER ----
  return (
    <div className="expenses-container fade-in">
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h4 className="fw-bold" style={{ color: 'var(--slate-900)' }}>Expense Management</h4>
        {/* Gradient Total Amount Badge */}
        <div className="bg-primary-gradient text-white px-4 py-2 rounded-3 text-center shadow-sm" style={{ minWidth: '160px' }}>
          <small className="d-block">Total Amount</small>
          <span className="fw-bold fs-5">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="card border-0 shadow-soft rounded-xl mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="fw-semibold small text-secondary">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by category or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="fw-semibold small text-secondary">Category</label>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-soft rounded-xl">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th onClick={() => handleSort('category')} style={{ cursor: 'pointer', minWidth: '120px' }}>
                  Category {sortField === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer', minWidth: '100px' }}>
                  Amount {sortField === 'amount' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('date')} style={{ cursor: 'pointer', minWidth: '120px' }}>
                  Date {sortField === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{ minWidth: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="display-1 mb-3" style={{ fontSize: '48px' }}>📭</div>
                    <h5 className="fw-semibold">No expenses found</h5>
                    <p className="text-secondary">Start tracking your expenses today.</p>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => navigate('/add-expense')}
                    >
                      + Add Your First Expense
                    </button>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="expense-row">
                    <td>
                      <span className="badge bg-light text-dark fw-normal" style={{ fontSize: '15px', padding: '6px 14px' }}>
                        {expense.category}
                      </span>
                      {!['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Other', 'Custom'].includes(expense.category) && (
                        <span className="badge bg-primary-gradient ms-1" style={{ fontSize: '11px' }}>Custom</span>
                      )}
                    </td>
                    <td className="fw-bold">₹{expense.amount}</td>
                    <td>{new Date(expense.created_at || Date.now()).toLocaleDateString()}</td>
                    <td>
                      <Link
                        to={`/edit-expense/${expense.id}`}
                        className="btn btn-sm btn-success me-1"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Expenses;
