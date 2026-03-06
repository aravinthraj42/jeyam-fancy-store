'use client';

import { ShoppingCart } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

/**
 * Header Component
 * Glassy sticky header with gradient brand name, styled cart button
 */
export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-header border-b border-slate-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Jeyam Fancy Store
          </h1>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 btn-primary px-3 py-2 md:px-4"
            aria-label="Go to cart"
          >
            <ShoppingCart fontSize="small" />
            <span className="hidden sm:inline text-sm">Cart</span>

            {/* Cart Badge */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-error-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-sm shadow-sm">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Accent gradient line */}
      <div className="h-0.5 bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-600 opacity-60" />
    </header>
  );
}
