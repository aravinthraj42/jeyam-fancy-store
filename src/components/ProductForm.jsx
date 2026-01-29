import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { STOCK_STATUS_OPTIONS } from '../utils/productManager';
import { getProducts } from '../utils/productManager';

/**
 * ProductForm Component
 * Form for adding/editing products
 */
export default function ProductForm({ product, categories, onSave, onCancel }) {
  const isEditMode = !!product;

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Product name is required')
      .min(2, 'Name must be at least 2 characters'),
    image: Yup.string()
      .required('Image URL is required')
      .url('Must be a valid URL'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be positive')
      .integer('Price must be a whole number'),
    unit: Yup.string()
      .required('Unit is required')
      .oneOf(['piece', 'set', 'pair'], 'Unit must be piece, set, or pair'),
    categoryId: Yup.string()
      .required('Category is required'),
    stockStatus: Yup.string()
      .required('Stock status is required')
      .oneOf(STOCK_STATUS_OPTIONS, 'Invalid stock status'),
  });

  const formik = useFormik({
    initialValues: {
      name: product?.name || '',
      image: product?.image || '',
      price: product?.price || '',
      unit: product?.unit || 'piece',
      categoryId: product?.categoryId || categories[0]?.id || '',
      stockStatus: product?.stockStatus || 'In Stock',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const productData = {
        ...values,
        price: Number(values.price),
        id: product?.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      onSave(productData);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter product name"
        />
        {formik.touched.name && formik.errors.name && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={formik.values.image}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
        {formik.touched.image && formik.errors.image && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.image}</p>
        )}
        {formik.values.image && (
          <div className="mt-2">
            <img
              src={formik.values.image}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Price (₹) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="0"
          min="0"
          step="1"
        />
        {formik.touched.price && formik.errors.price && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.price}</p>
        )}
      </div>

      {/* Unit */}
      <div>
        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
          Unit <span className="text-red-500">*</span>
        </label>
        <select
          id="unit"
          name="unit"
          value={formik.values.unit}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="piece">Piece</option>
          <option value="set">Set</option>
          <option value="pair">Pair</option>
        </select>
        {formik.touched.unit && formik.errors.unit && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.unit}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formik.values.categoryId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {formik.touched.categoryId && formik.errors.categoryId && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.categoryId}</p>
        )}
      </div>

      {/* Stock Status */}
      <div>
        <label htmlFor="stockStatus" className="block text-sm font-medium text-gray-700 mb-1">
          Stock Status <span className="text-red-500">*</span>
        </label>
        <select
          id="stockStatus"
          name="stockStatus"
          value={formik.values.stockStatus}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {STOCK_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {formik.touched.stockStatus && formik.errors.stockStatus && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.stockStatus}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 btn-primary"
        >
          {isEditMode ? 'Update Product' : 'Add Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

