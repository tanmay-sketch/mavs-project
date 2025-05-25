// ===================================================================
// StatCard component
// Path to this file: /src/components/StatCard.jsx
// ===================================================================

import React from 'react';

export default function StatCard({ label, value, subValue }) {
  return (
    <div className="text-center">
      <p className="text-sm text-primary-800 dark:text-primary-300">{label}</p>
      <p className="font-bold text-primary-700 dark:text-primary-100">{value}</p>
      {subValue && (
        <p className="text-xs text-secondary-800 dark:text-secondary-500">{subValue}</p>
      )}
    </div>
  );
} 