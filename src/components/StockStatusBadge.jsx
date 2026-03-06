'use client';

/**
 * StockStatusBadge Component
 * Polished badge with dot indicator and semantic color palette
 */
export default function StockStatusBadge({ status }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Stock':
        return {
          badge: 'bg-success-50 text-success-700 border-success-200',
          dot: 'bg-success-500',
        };
      case 'Out of Stock':
        return {
          badge: 'bg-error-50 text-error-700 border-error-200',
          dot: 'bg-error-500',
        };
      case 'Available Soon':
        return {
          badge: 'bg-warning-50 text-warning-700 border-warning-200',
          dot: 'bg-warning-500',
        };
      case 'Available in 2 days':
      case 'Available in 7 days':
        return {
          badge: 'bg-secondary-50 text-secondary-700 border-secondary-200',
          dot: 'bg-secondary-500',
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const style = getStatusStyle(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${style.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

