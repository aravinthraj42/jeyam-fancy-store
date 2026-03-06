'use client';

import { Warning } from '@mui/icons-material';

/**
 * DeleteCategoryModal Component
 * Confirmation modal for deleting a category
 */
export default function DeleteCategoryModal({ category, productCount, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-card max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-error-50 flex items-center justify-center">
            <Warning className="text-error-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Delete Category</h3>
        </div>

        <div className="mb-6">
          <p className="text-slate-700 mb-3">
            Are you sure you want to delete the category <strong>&quot;{category.name}&quot;</strong>?
          </p>
          {productCount > 0 && (
            <div className="bg-error-50 border border-error-200 rounded-xl p-4">
              <p className="text-error-700 font-semibold text-sm mb-1">Warning!</p>
              <p className="text-error-600 text-sm">
                Deleting this category will also delete all {productCount} product{productCount !== 1 ? 's' : ''} inside it.
              </p>
            </div>
          )}
          <p className="text-slate-500 text-sm mt-3">This action cannot be undone.</p>
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

