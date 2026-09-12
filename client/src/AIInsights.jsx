import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AIInsights({ userId }) {
  const [insights, setInsights] = useState([]);

  const token = localStorage.getItem("token");
  let currentUid = userId;
  if (!currentUid && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUid = payload.id || payload.userId;
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (!currentUid) return;

    // Fetch user budgets and expenses to generate real rule-based insights
    axios.get(`https://smart-expense-trackerr.onrender.com/api/budgets/${currentUid}`)
      .then((res) => {
        const budgets = Array.isArray(res.data) ? res.data : (res.data?.budgets || []);
        const newInsights = [];

        budgets.forEach((b) => {
          const spent = Number(b.spent || b.current_spending || b.amount_spent || 0);
          const limit = Number(b.limit || b.budget_limit || b.amount || 0);
          
          if (limit > 0) {
            const ratio = (spent / limit) * 100;
            if (ratio >= 100) {
              newInsights.push({
                type: 'danger',
                title: `Overbudget: ${b.category || 'Expense'}`,
                message: `You exceeded your ₹${limit} budget on ${b.category} by spending ₹${spent} (${Math.round(ratio)}%). Consider pausing discretionary purchases.`
              });
            } else if (ratio >= 80) {
              newInsights.push({
                type: 'warning',
                title: `High Spending in ${b.category || 'Expense'}`,
                message: `You've used ${Math.round(ratio)}% of your ₹${limit} limit for ${b.category}. Slow down spending to avoid deficit.`
              });
            }
          }
        });

        if (newInsights.length === 0 && budgets.length > 0) {
          newInsights.push({
            type: 'success',
            title: 'Spending Discipline',
            message: 'All your category expenditures are well within budget limits!'
          });
        }

        setInsights(newInsights);
      })
      .catch(() => setInsights([]));
  }, [currentUid]);

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

      {insights.length === 0 ? (
        <p style={{ color: '#6b7280', margin: 0 }}>
          No spending insights available yet. Add your expenses to see smart recommendations!
        </p>
      ) : (
        insights.map((item, index) => {
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