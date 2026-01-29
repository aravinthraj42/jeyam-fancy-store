import { ArrowBack, WhatsApp } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCart } from '../context/CartContext';
import { sendOrderViaWhatsApp } from '../utils/whatsapp';
import { Add, Remove } from '@mui/icons-material';

/**
 * CartPage Component
 * Displays cart items and customer form for order placement
 */
export default function CartPage({ onBack }) {
  const { items, totalAmount, updateQuantity, clearCart } = useCart();

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    email: Yup.string()
      .email('Invalid email address')
      .optional(),
    address: Yup.string()
      .required('Address is required')
      .min(10, 'Address must be at least 10 characters'),
    pincode: Yup.string()
      .required('Pincode is required')
      .matches(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  });

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      pincode: '',
    },
    validationSchema,
    onSubmit: (values) => {
      // Prepare order data
      const orderData = {
        customerInfo: values,
        items,
        totalAmount,
      };

      // Send order via WhatsApp
      sendOrderViaWhatsApp(orderData);

      // Clear cart after order
      clearCart();

      // Reset form
      formik.resetForm();

      // Show success message (optional)
      alert('Order placed successfully! Opening WhatsApp...');
    },
  });

  // Check if form is valid and cart has items
  const isFormValid = formik.isValid && formik.dirty;
  const hasItems = items.length > 0;
  const canPlaceOrder = isFormValid && hasItems;

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowBack />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {items.length === 0 ? (
          // Empty Cart
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={onBack}
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Items ({items.length})
              </h3>

              {items.map((cartItem) => {
                const { item, quantity } = cartItem;
                const itemTotal = item.price * quantity;

                return (
                  <div key={item.id} className="card">
                    <div className="flex gap-4">
                      {/* Item Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2">
                          ₹{item.price} per {item.unit}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, quantity - 1)}
                            className="bg-red-100 text-red-600 p-1.5 rounded-lg hover:bg-red-200 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Remove fontSize="small" />
                          </button>
                          
                          <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                            {quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item.id, quantity + 1)}
                            className="bg-green-100 text-green-600 p-1.5 rounded-lg hover:bg-green-200 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Add fontSize="small" />
                          </button>

                          <span className="ml-auto font-bold text-primary-600">
                            ₹{itemTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Grand Total */}
              <div className="card bg-primary-50 border-2 border-primary-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Grand Total:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Form Section */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Customer Details
                </h3>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="10 digit phone number"
                      maxLength="10"
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{formik.errors.phone}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Enter your complete address"
                    />
                    {formik.touched.address && formik.errors.address && (
                      <p className="mt-1 text-sm text-red-500">{formik.errors.address}</p>
                    )}
                  </div>

                  {/* Pincode Field */}
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formik.values.pincode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="6 digit pincode"
                      maxLength="6"
                    />
                    {formik.touched.pincode && formik.errors.pincode && (
                      <p className="mt-1 text-sm text-red-500">{formik.errors.pincode}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!canPlaceOrder}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <WhatsApp />
                    <span>Order on WhatsApp</span>
                  </button>

                  {!canPlaceOrder && (
                    <p className="text-xs text-gray-500 text-center">
                      {!hasItems && 'Add items to cart'}
                      {hasItems && !isFormValid && 'Fill all required fields'}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

