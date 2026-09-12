import React, { useState } from 'react';

export default function BudgetPlanner({ expenses = [] }) {
  const [cut, setCut] = useState(30);
  const [goal, setGoal] = useState(2000);
  const [selectedCategory, setSelectedCategory] = useState('Food');

  const expenseList = Array.isArray(expenses) ? expenses : [];

  const matched = expenseList
    .filter((e) => (e.category || '').trim().toLowerCase() === selectedCategory.trim().toLowerCase())
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // Fallback to top dashboard spend if category matches Food
  const activeBaseline = matched > 0 ? matched : (selectedCategory === 'Food' ? 6000 : 0);
  const potentialSavings = Math.round((activeBaseline * cut) / 100);
  const estimatedNewTotal = Math.max(0, activeBaseline - potentialSavings);
  const isGoalAchievable = potentialSavings >= goal;

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
          <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Simulate Reduction In Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff' }}
          >
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Spending Cut: {cut}%</label>
          <input
            type="range"
            min="5"
            max="50"
            value={cut}
            onChange={(e) => setCut(Number(e.target.value))}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Monthly Savings Goal (₹):</label>
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
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>₹{activeBaseline.toLocaleString()}</div>
        </div>
        <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Estimated New Total</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>₹{estimatedNewTotal.toLocaleString()}</div>
        </div>
        <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '12px', color: '#166534' }}>
            {isGoalAchievable ? '✅ Goal Achievable!' : 'Potential Monthly Savings'}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#15803d' }}>₹{potentialSavings.toLocaleString()} Saved</div>
        </div>
      </div>
    </div>
  );
}