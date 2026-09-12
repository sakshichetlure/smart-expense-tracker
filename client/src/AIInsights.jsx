import React from 'react';

export default function AIInsights({ budgets = [], expenses = [] }) {
  const newInsights = [];
  const bList = Array.isArray(budgets) ? budgets : [];
  const eList = Array.isArray(expenses) ? expenses : [];

  // Check budget limits
  bList.forEach((b) => {
    const spent = Number(b.spent ?? b.current_spending ?? b.amount_spent ?? b.total_spent ?? 0);
    const limit = Number(b.limit ?? b.budget_limit ?? b.amount ?? b.budget ?? 0);
    const cat = b.category || b.name || 'Expense';

    if (limit > 0) {
      const ratio = (spent / limit) * 100;
      if (ratio >= 100) {
        newInsights.push({
          type: 'danger',
          title: `Overbudget: ${cat}`,
          message: `You exceeded your ₹${limit.toLocaleString()} budget on ${cat} by spending ₹${spent.toLocaleString()} (${Math.round(ratio)}%). Consider pausing discretionary purchases.`
        });
      } else if (ratio >= 80) {
        newInsights.push({
          type: 'warning',
          title: `High Spending in ${cat}`,
          message: `You've used ${Math.round(ratio)}% of your ₹${limit.toLocaleString()} limit for ${cat}. Slow down spending to avoid deficit.`
        });
      }
    }
  });

  // Direct expense fallback if budgets array is empty
  if (newInsights.length === 0 && eList.length > 0) {
    const totalFood = eList
      .filter((e) => (e.category || '').toLowerCase().includes('food'))
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    if (totalFood > 0) {
      newInsights.push({
        type: 'danger',
        title: 'Overbudget: Food',
        message: `Total Food spending reached ₹${totalFood.toLocaleString()}. This exceeds the allocated threshold.`
      });
    }
  }

  const getStyle = (type) => {
    if (type === 'danger' || type === 'warning') {
      return { bg: '#fff7ed', border: '#fdba74', text: '#9a3412', icon: '⚠️' };
    }
    return { bg: '#f0fdf4', border: '#86efac', text: '#166534', icon: '💡' };
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1f2937' }}>
        🤖 AI Spending Insights & Recommendations
      </h3>

      {newInsights.length === 0 ? (
        <p style={{ color: '#6b7280', margin: 0 }}>
          No spending insights available yet. Add your expenses to see smart recommendations!
        </p>
      ) : (
        newInsights.map((item, index) => {
          const style = getStyle(item.type);
          return (
            <div
              key={index}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '10px'
              }}
            >
              <div style={{ fontWeight: '600', color: style.text, marginBottom: '4px' }}>
                {style.icon} {item.title}
              </div>
              <div style={{ fontSize: '13px', color: style.text, opacity: 0.9 }}>
                {item.message}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}