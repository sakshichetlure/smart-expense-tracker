import React, { useState } from "react";
import { FaSlidersH, FaCalculator, FaPiggyBank } from "react-icons/fa";

function ScenarioSimulator({ expenses = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("Dining Out");
  const [reductionPercent, setReductionPercent] = useState(15);
  const [oneTimeExpense, setOneTimeExpense] = useState(0);
  const [timelineMonths, setTimelineMonths] = useState(6);

  // Extract unique categories from current expenses
  const categories = Array.from(
    new Set(expenses.map((e) => e.category || "General"))
  );

  // Calculate average monthly spending for the selected category
  const categoryTotal = expenses
    .filter((e) => (e.category || "General") === selectedCategory)
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // Baseline monthly assumption (default fallback if data is minimal)
  const baselineMonthly = categoryTotal > 0 ? Math.round(categoryTotal) : 3000;

  // Projections
  const monthlySavings = Math.round((baselineMonthly * reductionPercent) / 100);
  const projectedTotalSavings = (monthlySavings * timelineMonths) - Number(oneTimeExpense || 0);

  return (
    <div className="card border-0 shadow-soft rounded-xl mb-4 p-3">
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaSlidersH className="text-primary" />
        <h6 className="fw-semibold m-0">What-If Spending Simulator</h6>
      </div>

      <div className="row g-3">
        {/* Controls */}
        <div className="col-12 col-md-6">
          <label className="small text-muted mb-1">Target Spending Category</label>
          <select
            className="form-select form-select-sm mb-3"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))
            ) : (
              <option value="Dining Out">Dining Out</option>
            )}
          </select>

          <label className="small text-muted d-flex justify-content-between">
            <span>Cut spending by:</span>
            <strong>{reductionPercent}%</strong>
          </label>
          <input
            type="range"
            className="form-range mb-3"
            min="5"
            max="60"
            step="5"
            value={reductionPercent}
            onChange={(e) => setReductionPercent(Number(e.target.value))}
          />

          <div className="row g-2">
            <div className="col-6">
              <label className="small text-muted">Timeline (Months)</label>
              <select
                className="form-select form-select-sm"
                value={timelineMonths}
                onChange={(e) => setTimelineMonths(Number(e.target.value))}
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
              </select>
            </div>
            <div className="col-6">
              <label className="small text-muted">Planned Irregular Cost (₹)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="e.g. 5000"
                value={oneTimeExpense}
                onChange={(e) => setOneTimeExpense(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Projection Output */}
        <div className="col-12 col-md-6 d-flex flex-column justify-content-center">
          <div className="p-3 bg-light rounded-xl border">
            <div className="d-flex align-items-center gap-2 mb-2 text-primary">
              <FaCalculator />
              <span className="fw-semibold small">Simulation Summary</span>
            </div>
            <p className="small text-secondary mb-2">
              If you cut <strong>{reductionPercent}%</strong> on <strong>{selectedCategory}</strong>:
            </p>
            <div className="d-flex justify-content-between mb-1">
              <span className="small text-muted">Monthly Retained:</span>
              <strong className="text-success">+₹{monthlySavings.toLocaleString()}</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="small text-muted">Deducted Irregular Expense:</span>
              <span className="text-danger">-₹{Number(oneTimeExpense || 0).toLocaleString()}</span>
            </div>
            <hr className="my-2" />
            <div className="d-flex align-items-center justify-content-between">
              <span className="fw-semibold">Estimated Net Savings ({timelineMonths} mo):</span>
              <h5 className={`m-0 fw-bold ${projectedTotalSavings >= 0 ? "text-primary" : "text-danger"}`}>
                ₹{projectedTotalSavings.toLocaleString()}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScenarioSimulator;