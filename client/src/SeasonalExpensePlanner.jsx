import React, { useState } from "react";
import { FaCalendarAlt, FaPlus, FaCheckCircle, FaTrashAlt } from "react-icons/fa";

function SeasonalExpensePlanner() {
  const [plans, setPlans] = useState([
    { id: 1, name: "Festival / Festive Shopping", targetAmount: 15000, savedAmount: 9000, targetDate: "2026-11-01" },
    { id: 2, name: "Vehicle Insurance Renewal", targetAmount: 8500, savedAmount: 8500, targetDate: "2026-12-15" }
  ]);

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const handleAddPlan = (e) => {
    e.preventDefault();
    if (!name || !targetAmount || !targetDate) return;

    const newPlan = {
      id: Date.now(),
      name,
      targetAmount: Number(targetAmount),
      savedAmount: Number(savedAmount) || 0,
      targetDate
    };

    setPlans([...plans, newPlan]);
    setName("");
    setTargetAmount("");
    setSavedAmount("");
    setTargetDate("");
  };

  const handleDelete = (id) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  return (
    <div className="card border-0 shadow-soft rounded-xl mb-4 p-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <FaCalendarAlt className="text-primary" />
          <h6 className="fw-semibold m-0">Seasonal & Irregular Expense Planner</h6>
        </div>
        <span className="badge bg-light text-dark border">
          {plans.length} Planned Events
        </span>
      </div>

      <form onSubmit={handleAddPlan} className="row g-2 mb-3 align-items-end">
        <div className="col-12 col-md-4">
          <label className="small text-muted">Expense / Event Name</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="e.g. Vacation, Annual Insurance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="col-6 col-md-2">
          <label className="small text-muted">Target (₹)</label>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="10000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
          />
        </div>
        <div className="col-6 col-md-2">
          <label className="small text-muted">Saved So Far (₹)</label>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="2500"
            value={savedAmount}
            onChange={(e) => setSavedAmount(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-2">
          <label className="small text-muted">Target Date</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            required
          />
        </div>
        <div className="col-6 col-md-2">
          <button type="submit" className="btn btn-primary btn-sm w-100">
            <FaPlus className="me-1" /> Add Plan
          </button>
        </div>
      </form>

      <div className="row g-3">
        {plans.map((plan) => {
          const pct = Math.min(100, Math.round((plan.savedAmount / plan.targetAmount) * 100));
          const isFunded = pct >= 100;

          return (
            <div key={plan.id} className="col-12 col-md-6">
              <div className="p-3 border rounded-lg bg-light h-100 position-relative">
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <div>
                    <strong className="d-block text-dark small">{plan.name}</strong>
                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Due by: {new Date(plan.targetDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger border-0 p-1"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <FaTrashAlt size={12} />
                  </button>
                </div>

                <div className="d-flex justify-content-between small my-2">
                  <span className="text-muted">
                    ₹{plan.savedAmount.toLocaleString()} / ₹{plan.targetAmount.toLocaleString()}
                  </span>
                  <span className={isFunded ? "text-success fw-bold" : "text-primary fw-bold"}>
                    {pct}% {isFunded && <FaCheckCircle className="ms-1" />}
                  </span>
                </div>

                <div className="progress" style={{ height: "6px" }}>
                  <div
                    className={`progress-bar ${isFunded ? "bg-success" : "bg-primary"}`}
                    role="progressbar"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SeasonalExpensePlanner;