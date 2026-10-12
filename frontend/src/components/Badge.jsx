import React from 'react';

export const Badge = ({ status, type = 'status' }) => {
  if (!status) return null;

  const normalized = status.toLowerCase().replace(/_/g, '-');
  const className = `badge badge-${normalized}`;

  return (
    <span className={className}>
      <span className="badge-dot" />
      {status.replace(/_/g, ' ')}
    </span>
  );
};
