'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';

const STOCK_STATUS_OPTIONS = [
  'In Stock',
  'Out of Stock',
  'Available Soon',
  'Available in 2 days',
  'Available in 7 days',
];

/**
 * ProductForm Component
 * Polished form with violet focus rings and clean validation states
 */
export default function ProductForm({ product, categories, onSave, onCancel, isSaving = false }) {
  const isEditMode = !!product;

  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required').min(2, 'Name must be at least 2 characters'),
    imageUrl: Yup.string().required('Image URL is required').url('Must be a valid URL'),
    price: Yup.number().required('Price is required').positive('Price must be positive').integer('Price must be a whole number'),
    unit: Yup.string().required('Unit is required').oneOf(['piece', 'set', 'pair'], 'Unit must be piece, set, or pair'),
    categoryId: Yup.string().required('Category is required'),
    stock: Yup.string().required('Stock status is required').oneOf(STOCK_STATUS_OPTIONS, 'Invalid stock status'),
  });

  const formik = useFormik({
    initialValues: {
      name: product?.name || '',
      imageUrl: product?.imageUrl || product?.image || '',
      price: product?.price || '',
      unit: product?.unit || 'piece',
      categoryId: product?.categoryId || categories[0]?.id || '',
      stock: product?.stock || product?.stockStatus || 'In Stock',
      description: product?.description || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSave({
        ...values,
        price: Number(values.price),
        id: product?.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      });
    },
  });

  const inputClass = (field) =>
    `input-field ${formik.touched[field] && formik.errors[field] ? 'input-error' : ''}`;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Product Name <span className="text-primary-600">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputClass('name')}
          placeholder="Enter product name"
        />
        {formik.touched.name && formik.errors.name && (
          <p className="mt-1 text-xs text-error-600 font-medium flex items-center gap-1">
            <span>!</span>{formik.errors.name}
          </p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Image URL <span className="text-primary-600">*</span>
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formik.values.imageUrl}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputClass('imageUrl')}
          placeholder="https://example.com/image.jpg"
        />
        {formik.touched.imageUrl && formik.errors.imageUrl && (
          <p className="mt-1 text-xs text-error-600 font-medium flex items-center gap-1">
            <span>!</span>{formik.errors.imageUrl}
          </p>
        )}
        {formik.values.imageUrl && !formik.errors.imageUrl && (
          <div className="mt-2">
            <img
              src={formik.values.imageUrl}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl border-2 border-primary-200 shadow-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Price (₹) <span className="text-primary-600">*</span>
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputClass('price')}
          placeholder="0"
          min="0"
          step="1"
        />
        {formik.touched.price && formik.errors.price && (
          <p className="mt-1 text-xs text-error-600 font-medium flex items-center gap-1">
            <span>!</span>{formik.errors.price}
          </p>
        )}
      </div>

      {/* Unit */}
      <div>
        <label htmlFor="unit" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Unit <span className="text-primary-600">*</span>
        </label>
        <select
          id="unit"
          name="unit"
          value={formik.values.unit}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputClass('unit')}
        >
          <option value="piece">Piece</option>
          <option value="set">Set</option>
          <option value="pair">Pair</option>
        </select>
        {formik.touched.unit && formik.errors.unit && (
          <p className="mt-1 text-xs text-error-600 font-medium flex items-center gap-1">
            <span>!</span>{formik.errors.unit}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Category <span className="text-primary-600">*</span>
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formik.values.categoryId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputClass('categoryId')}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {formik.touched.categoryId && formik.errors.categoryId && (
          <p className="mt-1 text-xs text-error-600 font-medium flex items-center gap-1">
            <span>!</span>{formik.errors.categoryId}
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div>
        <label htmlFor="stock" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Stock Status <span className="text-primary-600">*</span>
        </label>
        <select
          id="stock"
          name="stock"
          value={formik.values.stock}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputClass('stock')}
        >
          {STOCK_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {formik.touched.stock && formik.errors.stock && (
          <p className="mt-1 text-xs text-error-600 font-medium flex items-center gap-1">
            <span>!</span>{formik.errors.stock}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`${inputClass('description')} resize-none`}
          rows="3"
          placeholder="Product description (optional)"
        />
        {formik.touched.description && formik.errors.description && (
          <p className="mt-1 text-xs text-error-600 font-medium flex items-center gap-1">
            <span>!</span>{formik.errors.description}
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
            <span>{isEditMode ? 'Update Product' : 'Add Product'}</span>
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

