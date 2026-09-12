import React, { useState } from 'react';

export default function BudgetPlanner() {
  const [cut, setCut] = useState(20);
  const [goal, setGoal] = useState(0);

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#1f2937' }}>
        📈 AI Budget Planner & What-If Scenario Simulator
      </h3>
      <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 16px 0' }}>
        Forecast next month's spending and simulate how cutting discretionary categories helps reach your savings goals.
      </p>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Simulate Reduction In Category:</label>
          <select style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
            <option>All Discretionary</option>
            <option>Food</option>
            <option>Shopping</option>
            <option>Entertainment</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Spending Cut: {cut}%</label>
          <input
            type="range"
            min="5"
            max="50"
            value={cut}
            onChange={(e) => setCut(Number(e.target.value))}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Monthly Savings Goal (₹):</label>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', width: '100px' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Projected Baseline Spend</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>₹0</div>
        </div>
        <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Estimated New Total</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>₹0</div>
        </div>
        <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '12px', color: '#166534' }}>Potential Monthly Savings</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#15803d' }}>₹0</div>
        </div>
      </div>

      <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
        No historical spending data available yet. Projections will automatically calculate as you log expenses.
      </p>
    </div>
  );
}