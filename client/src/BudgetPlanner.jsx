import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BudgetPlanner({ userId = 1 }) {
  const [data, setData] = useState(null);
  const [savingsGoal, setSavingsGoal] = useState(1000);
  const [cutCategory, setCutCategory] = useState('Food');
  const [cutPercent, setCutPercent] = useState(20);

  const fetchForecast = () => {
    axios.get(`https://smart-expense-tracker-backend.onrender.com/api/ai/forecast/${userId}?savingsGoal=${savingsGoal}&cutCategory=${cutCategory}&cutPercent=${cutPercent}`)
      .then((res) => {
        if (res.data.success) {
          setData(res.data);
        }
      })
      .catch((err) => console.error("Error loading forecast:", err));
  };

  useEffect(() => {
    fetchForecast();
  }, [savingsGoal, cutCategory, cutPercent]);

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginTop: '24px' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>📈</span> AI Budget Planner & What-If Scenario Simulator
      </h3>
      <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 20px 0' }}>
        Forecast next month's spending and simulate how cutting discretionary categories helps reach your savings goals.
      </p>

      {/* Scenario Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
            Simulate Reduction In Category:
          </label>
          <select 
            value={cutCategory} 
            onChange={(e) => setCutCategory(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
            Spending Cut: {cutPercent}%
          </label>
          <input 
            type="range" 
            min="5" 
            max="50" 
            step="5" 
            value={cutPercent}
            onChange={(e) => setCutPercent(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
            Monthly Savings Goal (₹):
          </label>
          <input 
            type="number" 
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>
      </div>

      {/* Results Summary Banner */}
      {data && (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flex: '1 1 180px', background: '#eff6ff', padding: '14px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '12px', color: '#1e40af' }}>Projected Baseline Spend</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e3a8a' }}>₹{data.baselineForecastTotal}</div>
            </div>

            <div style={{ flex: '1 1 180px', background: '#f0fdf4', padding: '14px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '12px', color: '#166534' }}>Estimated New Total</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#14532d' }}>₹{data.simulatedTotal}</div>
            </div>

            <div style={{ flex: '1 1 180px', background: data.goalAchievable ? '#f0fdf4' : '#fff7ed', padding: '14px', borderRadius: '8px', border: data.goalAchievable ? '1px solid #86efac' : '1px solid #fed7aa' }}>
              <div style={{ fontSize: '12px', color: data.goalAchievable ? '#15803d' : '#c2410c' }}>
                {data.goalAchievable ? '✅ Goal Achievable!' : '⚠️ Goal Needs More Cuts'}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: data.goalAchievable ? '#166534' : '#9a3412' }}>
                ₹{data.potentialMonthlySavings} Saved
              </div>
            </div>
          </div>

          {/* Forecast Breakdown Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '10px' }}>Category</th>
                <th style={{ padding: '10px' }}>Historical Avg</th>
                <th style={{ padding: '10px' }}>Projected Next Month</th>
                <th style={{ padding: '10px' }}>Simulated Plan</th>
              </tr>
            </thead>
            <tbody>
              {data.projections.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px', fontWeight: '600' }}>{row.category}</td>
                  <td style={{ padding: '10px', color: '#64748b' }}>₹{row.historicalAvg}</td>
                  <td style={{ padding: '10px', color: '#334155' }}>₹{row.projectedNextMonth}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold', color: row.simulatedAmount < row.historicalAvg ? '#16a34a' : '#1e293b' }}>
                    ₹{row.simulatedAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}