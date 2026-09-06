import React, { useMemo } from "react";
import { FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

function BudgetAlerts({ expenses = [], budgets = [] }) {
  const alerts = useMemo(() => {
    if (!budgets || budgets.length === 0) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date || exp.created_at);
      return (
        expDate.getMonth() === currentMonth &&
        expDate.getFullYear() === currentYear
      );
    });

    const categorySpending = monthlyExpenses.reduce((acc, curr) => {
      const cat = (curr.category || "General").trim().toLowerCase();
      acc[cat] = (acc[cat] || 0) + Number(curr.amount || 0);
      return acc;
    }, {});

    const alertList = [];

    budgets.forEach((budget) => {
      const catName = budget.category || "General";
      const catKey = catName.trim().toLowerCase();
      const budgetLimit = Number(budget.amount || budget.limit || 0);
      const spent = categorySpending[catKey] || 0;

      if (budgetLimit > 0) {
        const ratio = (spent / budgetLimit) * 100;

        if (ratio >= 100) {
          alertList.push({
            id: `danger-${catKey}`,
            type: "danger",
            category: catName,
            spent,
            limit: budgetLimit,
            percent: Math.round(ratio),
            title: "Budget Exceeded",
            message: `You have spent ₹${spent.toLocaleString()} of your ₹${budgetLimit.toLocaleString()} monthly limit.`,
          });
        } else if (ratio >= 80) {
          alertList.push({
            id: `warning-${catKey}`,
            type: "warning",
            category: catName,
            spent,
            limit: budgetLimit,
            percent: Math.round(ratio),
            title: "Approaching Budget Threshold",
            message: `You have reached ${Math.round(ratio)}% of your ₹${budgetLimit.toLocaleString()} limit (₹${(budgetLimit - spent).toLocaleString()} remaining).`,
          });
        }
      }
    });

    return alertList;
  }, [expenses, budgets]);

  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`card border-0 mb-2 shadow-sm rounded-xl p-3 ${
            alert.type === "danger"
              ? "bg-danger bg-opacity-10 border-start border-danger border-4"
              : "bg-warning bg-opacity-10 border-start border-warning border-4"
          }`}
        >
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              {alert.type === "danger" ? (
                <FaTimesCircle className="text-danger flex-shrink-0" size={22} />
              ) : (
                <FaExclamationTriangle className="text-warning flex-shrink-0" size={22} />
              )}
              <div>
                <span
                  className={`badge me-2 ${
                    alert.type === "danger" ? "bg-danger" : "bg-warning text-dark"
                  }`}
                >
                  {alert.percent}% SPENT
                </span>
                <strong className="text-dark">{alert.category}: {alert.title}</strong>
                <p className="text-secondary small mb-0 mt-1">{alert.message}</p>
              </div>
            </div>
            <div className="text-end">
              <span className="small text-muted d-block">Budget Limit</span>
              <span className="fw-bold">₹{alert.limit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BudgetAlerts;