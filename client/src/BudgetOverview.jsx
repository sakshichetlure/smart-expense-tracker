import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BudgetOverview({ userId = 1 }) {
  const [budgetStatuses, setBudgetStatuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');

  const fetchStatus = () => {
    axios.get('https://smart-expense-tracker-backend.onrender.com/api/budgets/status/' + userId)
      .then((res) => setBudgetStatuses(res.data))
      .catch((err) => console.error("Error fetching budget status:", err));
  };

  useEffect(() => {
    fetchStatus();
  }, [userId]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!limit) return;
    try {
      axios.post(${process.env.REACT_APP_API_URL || 'https://your-render-app-name.onrender.com'}/api/budgets/set, ...)
        userId,
        category,
        monthlyLimit: parseFloat(limit)
      });
      setShowModal(false);
      setLimit('');
      fetchStatus();
    } catch (err) {
      console.error("Failed to save budget", err);
    }
  };

  const getColor = (level) => {
    if (level === 'danger') return '#ef4444';
    if (level === 'warning') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', marginTop: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#1f2937' }}>Budget & Threshold Alerts</h3>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
        >
          + Set Budget
        </button>
      </div>

      {showModal && (
        <form onSubmit={handleSaveBudget} style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          >
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Travel">Travel</option>
          </select>
          <input 
            type="number" 
            placeholder="Monthly Limit (₹)" 
            value={limit} 
            onChange={(e) => setLimit(e.target.value)} 
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', flex: 1 }} 
            required 
          />
          <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
          <button type="button" onClick={() => setShowModal(false)} style={{ background: '#9ca3af', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
        </form>
      )}
      
      {budgetStatuses.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No budget limits configured for this month.</p>
      ) : (
        budgetStatuses.map((item) => (
          <div key={item.category} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
              <span style={{ fontWeight: '600' }}>{item.category}</span>
              <span style={{ color: getColor(item.alertLevel), fontWeight: '600' }}>
                ₹{item.spent} / ₹{item.limit} ({item.percentage}%)
              </span>
            </div>
            
            <div style={{ width: '100%', height: '10px', background: '#e5e7eb', borderRadius: '5px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${Math.min(item.percentage, 100)}%`, 
                  height: '100%', 
                  background: getColor(item.alertLevel),
                  transition: 'width 0.4s ease'
                }} 
              />
            </div>

            {item.alertLevel !== 'normal' && (
              <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '12px', color: getColor(item.alertLevel), fontWeight: '500' }}>
                ⚠️ {item.message}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
}