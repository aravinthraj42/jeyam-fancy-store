import { useFormik } from 'formik';
import * as Yup from 'yup';
import { STOCK_STATUS_OPTIONS } from '../utils/productManager';

/**
 * ProductForm Component
 * Polished form with violet focus rings and clean validation states
 */
export default function ProductForm({ product, categories, onSave, onCancel }) {
  const isEditMode = !!product;

  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required').min(2, 'Name must be at least 2 characters'),
    image: Yup.string().required('Image URL is required').url('Must be a valid URL'),
    price: Yup.number().required('Price is required').positive('Price must be positive').integer('Price must be a whole number'),
    unit: Yup.string().required('Unit is required').oneOf(['piece', 'set', 'pair'], 'Unit must be piece, set, or pair'),
    categoryId: Yup.string().required('Category is required'),
    stockStatus: Yup.string().required('Stock status is required').oneOf(STOCK_STATUS_OPTIONS, 'Invalid stock status'),
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
      onSave({
        ...values,
        price: Number(values.price),
        id: product?.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      });
    },
  });

  /* ── Helper: field wrapper ── */
  const Field = ({ id, label, required, error, children }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-primary-600">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-error-600 font-medium flex items-center gap-1">
          <span>!</span>{error}
        </p>
      )}
    </div>
  );

  const inputClass = (field) =>
    `input-field ${formik.touched[field] && formik.errors[field] ? 'input-error' : ''}`;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* Product Name */}
      <Field id="name" label="Product Name" required error={formik.touched.name && formik.errors.name}>
        <input
          type="text" id="name" name="name"
          value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className={inputClass('name')} placeholder="Enter product name"
        />
      </Field>

      {/* Image URL */}
      <Field id="image" label="Image URL" required error={formik.touched.image && formik.errors.image}>
        <input
          type="url" id="image" name="image"
          value={formik.values.image} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className={inputClass('image')} placeholder="https://example.com/image.jpg"
        />
        {formik.values.image && !formik.errors.image && (
          <div className="mt-2">
            <img
              src={formik.values.image}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl border-2 border-primary-200 shadow-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
      </Field>

      {/* Price */}
      <Field id="price" label="Price (₹)" required error={formik.touched.price && formik.errors.price}>
        <input
          type="number" id="price" name="price"
          value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className={inputClass('price')} placeholder="0" min="0" step="1"
        />
      </Field>

      {/* Unit */}
      <Field id="unit" label="Unit" required error={formik.touched.unit && formik.errors.unit}>
        <select
          id="unit" name="unit"
          value={formik.values.unit} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className={inputClass('unit')}
        >
          <option value="piece">Piece</option>
          <option value="set">Set</option>
          <option value="pair">Pair</option>
        </select>
      </Field>

      {/* Category */}
      <Field id="categoryId" label="Category" required error={formik.touched.categoryId && formik.errors.categoryId}>
        <select
          id="categoryId" name="categoryId"
          value={formik.values.categoryId} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className={inputClass('categoryId')}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </Field>

      {/* Stock Status */}
      <Field id="stockStatus" label="Stock Status" required error={formik.touched.stockStatus && formik.errors.stockStatus}>
        <select
          id="stockStatus" name="stockStatus"
          value={formik.values.stockStatus} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className={inputClass('stockStatus')}
        >
          {STOCK_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 btn-primary py-2.5">
          {isEditMode ? 'Update Product' : 'Add Product'}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 btn-secondary py-2.5">
          Cancel
        </button>
      </div>
    </form>
  );
}
