import React from 'react';

export const StatCard = ({ title, value, icon, color = '#059669', subtitle, trend }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: `${color}18`, color }}>
        {icon}
      </div>
      <div className="stat-info">
        <h4>{title}</h4>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className="stat-trend">
            <span>↑</span> {trend}
          </div>
        )}
        {subtitle && !trend && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{subtitle}</p>}
      </div>
    </div>
  );
};
