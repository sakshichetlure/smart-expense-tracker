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
      console.error("Token decode error:", e);
    }
  }

  useEffect(() => {
    if (!currentUid) {
      setInsights([]);
      return;
    }
    axios.get(`https://smart-expense-trackerr.onrender.com/api/ai/insights/${currentUid}`)
      .then((res) => setInsights(res.data || []))
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
                {style.icon} {item.title || item.category || 'Insight'}
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