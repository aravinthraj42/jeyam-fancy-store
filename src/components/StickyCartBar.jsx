'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function StickyCartBar() {
  const router = useRouter();
  const { totalItems, totalAmount } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4">
      <button
        onClick={() => router.push('/cart')}
        className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-glow-primary transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
            {totalItems}
          </div>
          <div className="text-left">
            <p className="text-xs text-white/70 font-medium">View Cart</p>
            <p className="text-lg font-extrabold">₹{totalAmount}</p>
          </div>
        </div>
        <span className="text-white font-bold text-lg">→</span>
      </button>
    </div>
  );
}

