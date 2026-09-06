import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import "./Dashboard.css";
import BudgetOverview from "../BudgetOverview";
import AIInsights from "../AIInsights";
import BudgetPlanner from "../BudgetPlanner";
import MoMComparison from "../components/MoMComparison";
import BudgetAlerts from "../BudgetAlerts.jsx";
import RecurringExpenses from "../RecurringExpenses.jsx";
import ScenarioSimulator from "../ScenarioSimulator.jsx";
import BudgetRollover from "../BudgetRollover.jsx";
import SeasonalExpensePlanner from "../SeasonalExpensePlanner.jsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaWallet, FaChartLine, FaTrophy, FaList } from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [expenseRes, budgetRes] = await Promise.allSettled([
        axios.get("/expenses"),
        axios.get("/budgets"),
      ]);

      if (expenseRes.status === "fulfilled") {
        setExpenses(expenseRes.value.data || []);
      }
      if (budgetRes.status === "fulfilled") {
        setBudgets(budgetRes.value.data || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete("/users/profile");
        localStorage.clear();
        navigate("/login");
      } catch (err) {
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  const filteredExpenses = expenses.filter((item) =>
    (item.title || item.description || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (item.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const categoryTotals = expenses.reduce((acc, curr) => {
    const cat = curr.category || "Other";
    acc[cat] = (acc[cat] || 0) + Number(curr.amount || 0);
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#6366f1",
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
        ],
      },
    ],
  };

  const monthlyTotals = expenses.reduce((acc, curr) => {
    const d = new Date(curr.date || curr.created_at);
    const month = d.toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + Number(curr.amount || 0);
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: "Monthly Spending",
        data: Object.values(monthlyTotals),
        backgroundColor: "#6366f1",
        borderRadius: 6,
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: "Trend",
        data: Object.values(monthlyTotals),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  const exportToCSV = () => {
    const headers = ["Title", "Category", "Amount", "Date"];
    const rows = filteredExpenses.map((exp) => [
      `"${exp.title || exp.description || ""}"`,
      `"${exp.category || ""}"`,
      Number(exp.amount || 0),
      `"${new Date(exp.date || exp.created_at).toLocaleDateString("en-IN")}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumns = ["Title", "Category", "Date", "Amount"];
    const tableRows = filteredExpenses.map((exp) => [
      exp.title || exp.description || "-",
      exp.category || "-",
      new Date(exp.date || exp.created_at).toLocaleDateString("en-IN"),
      `Rs. ${Number(exp.amount || 0).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 20,
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 9 },
    });

    doc.save(`Monthly_Report_${new Date().toISOString().slice(0, 7)}.pdf`);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard fade-in p-4">
      {/* Top Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold m-0" style={{ color: "var(--slate-900)" }}>
            Financial Overview
          </h2>
          <p className="text-muted small m-0">
            Monitor your spending, budgets, and savings goals
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={exportToCSV}>
            Export CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={exportToPDF}>
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-soft p-3 rounded-xl">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-indigo-50 text-primary rounded-circle">
                <FaWallet size={20} />
              </div>
              <div>
                <small className="text-muted fw-semibold">Total Spent</small>
                <h4 className="fw-bold m-0">₹{totalSpent.toLocaleString()}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-soft p-3 rounded-xl">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-emerald-50 text-success rounded-circle">
                <FaChartLine size={20} />
              </div>
              <div>
                <small className="text-muted fw-semibold">Transactions</small>
                <h4 className="fw-bold m-0">{expenses.length}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-soft p-3 rounded-xl">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-amber-50 text-warning rounded-circle">
                <FaTrophy size={20} />
              </div>
              <div>
                <small className="text-muted fw-semibold">Top Category</small>
                <h5 className="fw-bold m-0">
                  {Object.keys(categoryTotals).sort(
                    (a, b) => categoryTotals[b] - categoryTotals[a]
                  )[0] || "N/A"}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card border-0 shadow-soft p-3 rounded-xl">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-purple-50 text-purple rounded-circle">
                <FaList size={20} />
              </div>
              <div>
                <small className="text-muted fw-semibold">Monthly Avg</small>
                <h4 className="fw-bold m-0">
                  ₹
                  {Math.round(
                    totalSpent / (Object.keys(monthlyTotals).length || 1)
                  ).toLocaleString()}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Threshold & Overspending Alerts */}
      <BudgetAlerts expenses={expenses} budgets={budgets} />

      {/* Analytics Visuals */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-soft p-3 rounded-xl h-100">
            <h6 className="fw-semibold mb-3">Expenses by Category</h6>
            <div style={{ height: 260 }}>
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-soft p-3 rounded-xl h-100">
            <h6 className="fw-semibold mb-3">Monthly Trend</h6>
            <div style={{ height: 260 }}>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Budget & Prediction Widgets */}
      <BudgetOverview />
      <AIInsights userId={1} />
      <BudgetPlanner userId={1} />
      <RecurringExpenses />
      <BudgetRollover userId={1}/>
      <SeasonalExpensePlanner />
      <MoMComparison userId={1} />

      {/* Spending Pattern Trend Line */}
      <div className="col-12 mb-4">
        <div className="card border-0 shadow-soft rounded-xl">
          <div className="card-body">
            <h6 className="fw-semibold">Spending Pattern</h6>
            <div style={{ height: 280 }}>
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="card border-0 shadow-soft rounded-xl mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-semibold m-0">Recent Transactions</h6>
            <a
              href="/expenses"
              className="text-primary text-decoration-none small fw-semibold"
            >
              View All
            </a>
          </div>

          <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: "260px" }}
            />
          </div>

          <div className="list-group list-group-flush">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-bottom"
              >
                <div>
                  <div className="fw-semibold text-dark">
                    {expense.title || expense.description}
                  </div>
                  <small className="text-secondary">
                    {new Date(expense.date || expense.created_at).toLocaleDateString("en-IN")} •{" "}
                    {expense.category}
                  </small>
                </div>
                <div className="text-end">
                  <div className="fw-bold" style={{ color: "var(--slate-900)" }}>
                    ₹{Number(expense.amount).toLocaleString()}
                  </div>
                  <small className="text-secondary">
                    {new Date(expense.created_at || expense.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="text-center mt-4">
        <button className="btn btn-danger" onClick={handleDeleteAccount}>
          Delete My Account
        </button>
      </div>
    </div>
  );
}

export default Dashboard;