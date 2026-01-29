import { ShoppingCart } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import ProfileMenu from './ProfileMenu';

/**
 * Header Component
 * Displays app name, cart button with item count badge, and profile menu
 * Profile menu is always visible (shows login for guests, admin options for authenticated users)
 */
export default function Header({ onCartClick, onAdminClick, onLoginClick }) {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* App Name */}
        <h1 className="text-xl md:text-2xl font-bold text-primary-600">
          Jeyam Fancy Store
        </h1>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            aria-label="Go to cart"
          >
            <ShoppingCart />
            <span className="hidden sm:inline">Go To Cart</span>
            
            {/* Cart Badge */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          {/* Profile Menu (always visible - shows login for guests) */}
          <ProfileMenu onAdminClick={onAdminClick} onLoginClick={onLoginClick} />
        </div>
      </div>
    </header>
  );
}

