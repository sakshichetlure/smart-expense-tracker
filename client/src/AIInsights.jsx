import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AIInsights({ userId = 1 }) {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    axios.get(`https://smart-expense-trackerr.onrender.com/api/ai/insights/${userId}`)
      .then((res) => {
        if (res.data.success) {
          setInsights(res.data.insights);
        }
      })
      .catch((err) => console.error("Error fetching AI insights:", err));
  }, [userId]);

  const getStyle = (type) => {
    switch (type) {
      case 'danger':
        return { border: '#fca5a5', bg: '#fef2f2', text: '#991b1b', icon: '🚨' };
      case 'warning':
        return { border: '#fcd34d', bg: '#fffbeb', text: '#92400e', icon: '⚠️' };
      case 'success':
        return { border: '#86efac', bg: '#f0fdf4', text: '#166534', icon: '💡' };
      default:
        return { border: '#bfdbfe', bg: '#eff6ff', text: '#1e40af', icon: '✨' };
    }
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', marginTop: '20px', marginBottom: '20px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🤖</span> AI Spending Insights & Recommendations
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {insights.map((item, index) => {
          const style = getStyle(item.type);
          return (
            <div 
              key={index}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: '8px',
                padding: '12px 16px'
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
        })}
      </div>
    </div>
  );
}
