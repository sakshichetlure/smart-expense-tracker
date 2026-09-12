import React, { useState } from 'react';

export default function BudgetRollover() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#1f2937' }}>🔄 Automatic Budget Rollover</h3>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px', fontSize: '14px', color: '#4b5563' }}>
          <span>{enabled ? 'Enabled' : 'Disabled'}</span>
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f9fafb', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Base Budget</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>₹0</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Unused Surplus</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>+₹0</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Available Cap</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>₹0</div>
        </div>
      </div>
      <p style={{ color: '#6b7280', fontSize: '13px', margin: '10px 0 0 0' }}>
        Unspent surplus from previous month has been added to this month's spending allowance.
      </p>
    </div>
  );
}