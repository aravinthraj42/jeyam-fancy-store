import { useState, useRef, useEffect } from 'react';
import { AccountCircle, Logout, AdminPanelSettings, Login } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

/**
 * ProfileMenu Component
 * Dropdown menu for both authenticated and guest users
 * Shows login option for guests, admin options for authenticated users
 */
export default function ProfileMenu({ onAdminClick, onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout, isAuthenticated } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleLogin = () => {
    setIsOpen(false);
    if (onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Icon Button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Profile menu"
      >
        <AccountCircle className="text-primary-600" fontSize="large" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {isAuthenticated && user ? (
            <>
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>

              {/* Menu Items for Authenticated Users */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onAdminClick) onAdminClick();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <AdminPanelSettings fontSize="small" />
                  Admin Panel
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Logout fontSize="small" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Guest User Info */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">Guest User</p>
                <p className="text-xs text-gray-500">Browse and order as guest</p>
              </div>

              {/* Menu Items for Guest Users */}
              <div className="py-1">
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-2 text-left text-sm text-primary-600 hover:bg-primary-50 flex items-center gap-2"
                >
                  <Login fontSize="small" />
                  Login
                </button>
                <div className="px-4 py-2 text-xs text-gray-500">
                  Login to access admin features
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

