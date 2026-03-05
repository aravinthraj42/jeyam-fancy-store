import { useState, useRef, useEffect } from 'react';
import { AccountCircle, Logout, AdminPanelSettings, Login } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

/**
 * ProfileMenu Component
 * Animated dropdown menu with polished violet hover states
 */
export default function ProfileMenu({ onAdminClick, onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleLogin = () => {
    setIsOpen(false);
    if (onLoginClick) onLoginClick();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400
          ${isOpen ? 'bg-primary-50 text-primary-600' : 'hover:bg-slate-100 text-slate-600 hover:text-primary-600'}`}
        aria-label="Profile menu"
        aria-expanded={isOpen}
      >
        <AccountCircle fontSize="medium" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-slide-up">
          {isAuthenticated && user ? (
            <>
              {/* Authenticated header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.displayName?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user.displayName}</p>
                    <p className="text-xs text-slate-500">@{user.username}</p>
                  </div>
                </div>
              </div>

              {/* Admin options */}
              <div className="py-1">
                <button
                  onClick={() => { setIsOpen(false); if (onAdminClick) onAdminClick(); }}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 flex items-center gap-2.5 transition-colors duration-150"
                >
                  <AdminPanelSettings fontSize="small" className="text-primary-500" />
                  <span className="font-medium">Admin Panel</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-error-600 hover:bg-error-50 flex items-center gap-2.5 transition-colors duration-150"
                >
                  <Logout fontSize="small" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Guest header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <AccountCircle fontSize="small" className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Guest User</p>
                    <p className="text-xs text-slate-400">Browse &amp; order freely</p>
                  </div>
                </div>
              </div>

              {/* Guest options */}
              <div className="py-1">
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-2.5 text-left text-sm text-primary-700 hover:bg-primary-50 flex items-center gap-2.5 transition-colors duration-150"
                >
                  <Login fontSize="small" className="text-primary-500" />
                  <span className="font-medium">Login</span>
                </button>
                <p className="px-4 pb-2 text-xs text-slate-400">Login to access admin features</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
