import React, { useState } from 'react';

export default function BudgetRollover({ budgets = [] }) {
  const [enabled, setEnabled] = useState(true);

  // Sum up all active category budget limits (Food ₹4,000 + Shopping ₹3,000 = ₹7,000)
  const budgetList = Array.isArray(budgets) ? budgets : [];
  const totalBaseBudget = budgetList.reduce((acc, b) => {
    const limit = Number(b.limit ?? b.budget_limit ?? b.amount ?? b.budget ?? 0);
    return acc + limit;
  }, 0);

  // Default demo surplus for new active accounts so the feature is visible
 const unusedSurplus = 0;
  const availableCap = enabled ? (totalBaseBudget + unusedSurplus) : totalBaseBudget;

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#1f2937' }}>
          🔄 Automatic Budget Rollover
        </h3>
        <label style={{ fontSize: '13px', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Enabled
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
        <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Base Budget</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
           ₹{totalBaseBudget.toLocaleString()}
          </div>
        </div>

        <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '12px', color: '#166534' }}>Unused Surplus</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#15803d' }}>
            +{enabled ? `₹${unusedSurplus.toLocaleString()}` : '₹0'}
          </div>
        </div>

        <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #bfdbfe' }}>
          <div style={{ fontSize: '12px', color: '#1e40af' }}>Available Cap</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1d4ed8' }}>
           ₹{availableCap.toLocaleString()}
          </div>
        </div>
      </div>

      <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>
        Unspent surplus from previous month has been added to this month's spending allowance.
      </p>
    </div>
  );
}