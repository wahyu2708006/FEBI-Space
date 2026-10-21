import React from 'react';
import { useCart } from '../context/CartContext.tsx';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useCart();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-brand-terracotta shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
  };

  const bgStyles = {
    success: 'border-emerald-200 bg-white shadow-emerald-900/10',
    info: 'border-amber-200 bg-white shadow-amber-900/10',
    error: 'border-red-200 bg-white shadow-red-900/10'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short pointer-events-none">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-xl text-xs font-semibold text-brand-slate max-w-sm ${
          bgStyles[toast.type]
        }`}
      >
        {icons[toast.type]}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
