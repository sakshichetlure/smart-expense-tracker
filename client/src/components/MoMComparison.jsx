import React, { useEffect, useState } from "react";
import axios from "../services/api";

const MoMComparison = ({ userId = 1 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoMData = async () => {
      try {
        const res = await axios.get(`/api/budgets/mom-comparison/${userId}`);
        if (res.data?.success) {
          setData(res.data.comparison);
        }
      } catch (err) {
        console.error("Error fetching MoM data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMoMData();
  }, [userId]);

  if (loading) {
    return <div className="text-secondary small py-2">Loading comparison data...</div>;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="card border-0 shadow-soft rounded-xl mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-semibold m-0">Month-on-Month Budget Comparison & Rollover</h6>
          <span className="badge bg-light text-dark border">Rollover Enabled</span>
        </div>

        <div className="table-responsive">
          <table className="table table-sm align-middle text-start mb-0">
            <thead className="table-light">
              <tr style={{ fontSize: "12px", color: "var(--slate-500)" }}>
                <th>Month</th>
                <th>Effective Budget</th>
                <th>Actual Spent</th>
                <th>MoM Change</th>
                <th>Surplus Rollover</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "13px" }}>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td className="fw-semibold">{row.month}</td>
                  <td>₹{row.budget.toLocaleString()}</td>
                  <td className="fw-bold">₹{row.spent.toLocaleString()}</td>
                  <td>
                    {row.changePercent > 0 ? (
                      <span className="text-danger fw-semibold">+{row.changePercent}% ↑</span>
                    ) : row.changePercent < 0 ? (
                      <span className="text-success fw-semibold">{row.changePercent}% ↓</span>
                    ) : (
                      <span className="text-secondary">—</span>
                    )}
                  </td>
                  <td className="text-primary fw-semibold">+₹{row.surplusCarried.toLocaleString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        row.status === "Exceeded"
                          ? "bg-danger-subtle text-danger"
                          : "bg-success-subtle text-success"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoMComparison;