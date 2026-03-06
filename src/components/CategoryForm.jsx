'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';

/**
 * CategoryForm Component
 * Form for creating/editing categories
 */
export default function CategoryForm({ category, onSave, onCancel, isSaving = false }) {
  const isEditMode = !!category;

  const validationSchema = Yup.object({
    name: Yup.string().required('Category name is required').min(2, 'Name must be at least 2 characters'),
  });

  const formik = useFormik({
    initialValues: {
      name: category?.name || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSave({
        name: values.name.trim(),
      });
    },
  });

  const inputClass = (field) =>
    `input-field ${formik.touched[field] && formik.errors[field] ? 'input-error' : ''}`;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* Category Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Category Name <span className="text-primary-600">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputClass('name')}
          placeholder="Enter category name"
        />
        {formik.touched.name && formik.errors.name && (
          <p className="mt-1 text-xs text-error-600 font-medium flex items-center gap-1">
            <span>!</span>{formik.errors.name}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button 
          type="submit" 
          disabled={isSaving}
          className={`flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 ${
            isSaving ? 'opacity-75 cursor-wait' : ''
          }`}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{isEditMode ? 'Updating...' : 'Adding...'}</span>
            </>
          ) : (
            <span>{isEditMode ? 'Update Category' : 'Add Category'}</span>
          )}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isSaving}
          className={`flex-1 btn-secondary py-2.5 ${
            isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

