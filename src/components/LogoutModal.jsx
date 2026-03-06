'use client';

import { Logout as LogoutIcon } from '@mui/icons-material';

/**
 * LogoutModal Component
 * Confirmation modal for logging out
 */
export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-card max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
            <LogoutIcon className="text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Logout</h3>
        </div>

        <div className="mb-6">
          <p className="text-slate-700 mb-3">
            Are you sure you want to logout?
          </p>
          <p className="text-slate-500 text-sm">You will need to login again to access the admin panel.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary py-2.5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 btn-primary py-2.5"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

