'use client';

import { Warning } from '@mui/icons-material';

/**
 * DeleteProductModal Component
 * Confirmation modal for deleting a product
 */
export default function DeleteProductModal({ product, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-card max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-error-50 flex items-center justify-center">
            <Warning className="text-error-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Delete Product</h3>
        </div>

        <div className="mb-6">
          <p className="text-slate-700 mb-3">
            Are you sure you want to delete the product <strong>&quot;{product.name}&quot;</strong>?
          </p>
          <p className="text-slate-500 text-sm">This action cannot be undone.</p>
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
            className="flex-1 btn-danger py-2.5"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

