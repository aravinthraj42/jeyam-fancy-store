'use client';

import { useRouter } from 'next/navigation';
import { ArrowBack, WhatsApp, ShoppingCartOutlined } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCart } from '../context/CartContext';
import { Add, Remove } from '@mui/icons-material';

const ADMIN_NUMBER = '918124483546'; // Hardcoded admin number

function formatOrderMessage(orderData) {
  const { customerInfo, items, totalAmount } = orderData;

  let message = `New Order - Jeyam Fancy Store\n\n`;
  message += `Customer Details:\n`;
  message += `Name: ${customerInfo.name}\n`;
  message += `Phone: ${customerInfo.phone}\n`;
  message += `Email: ${customerInfo.email || 'N/A'}\n`;
  message += `Address: ${customerInfo.address}\n`;
  message += `Pincode: ${customerInfo.pincode}\n\n`;
  message += `Items:\n`;

  items.forEach((cartItem) => {
    const { item, quantity } = cartItem;
    const itemTotal = item.price * quantity;
    const unitText = quantity === 1 ? item.unit : `${item.unit}s`;
    message += `- ${item.name} - ${quantity} ${unitText} - ₹${itemTotal}\n`;
  });

  message += `\nTotal Amount: ₹${totalAmount}`;

  return message;
}

function sendOrderViaWhatsApp(orderData) {
  const message = formatOrderMessage(orderData);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${ADMIN_NUMBER}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
}

/**
 * CartPage Component
 * Polished cart with elevated cards, purple price accents, and green WhatsApp CTA
 */
export default function CartPageContent() {
  const router = useRouter();
  const { items, totalAmount, updateQuantity, clearCart } = useCart();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    email: Yup.string()
      .test('email-validation', 'Please enter a valid email address', function(value) {
        if (!value || value.length === 0) {
          return true; // Optional field, no validation if empty
        }
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
      }),
    address: Yup.string()
      .test('address-validation', 'Address must be at least 10 characters', function(value) {
        if (!value || value.length === 0) {
          return true; // Optional field, no validation if empty
        }
        return value.length >= 10;
      }),
    pincode: Yup.string()
      .test('pincode-validation', 'Pincode must be exactly 6 digits', function(value) {
        if (!value || value.length === 0) {
          return true; // Optional field, no validation if empty
        }
        return /^\d{6}$/.test(value);
      }),
  });

  const formik = useFormik({
    initialValues: { name: '', phone: '', email: '', address: '', pincode: '' },
    validationSchema,
    onSubmit: (values) => {
      sendOrderViaWhatsApp({ customerInfo: values, items, totalAmount });
      clearCart();
      formik.resetForm();
      alert('Order placed successfully! Opening WhatsApp...');
      router.push('/');
    },
  });

  // Only check required fields (name and phone) for form validity
  const isFormValid = !formik.errors.name && !formik.errors.phone && formik.values.name && formik.values.phone;
  const hasItems = items.length > 0;
  const canPlaceOrder = isFormValid && hasItems;

  const handleQuantityChange = (itemId, newQuantity) => updateQuantity(itemId, newQuantity);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Sticky Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-header sticky top-0 z-30 border-b border-slate-100">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors focus-ring text-slate-600"
            aria-label="Go back"
          >
            <ArrowBack fontSize="small" />
          </button>
          <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
          {items.length > 0 && (
            <span className="ml-auto text-sm text-slate-500 font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-slate-100 flex items-center justify-center">
              <ShoppingCartOutlined className="text-slate-400" style={{ fontSize: 40 }} />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</h3>
            <p className="text-slate-400 text-sm mb-6">Looks like you haven&apos;t added anything yet.</p>
            <button onClick={() => router.push('/')} className="btn-primary px-8 py-2.5">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
                Cart Items
              </h3>

              {items.map(({ item, quantity }) => {
                const itemTotal = item.price * quantity;
                return (
                  <div key={item.id} className="card">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image || item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 line-clamp-2 text-sm mb-0.5">{item.name}</h4>
                        <p className="text-xs text-slate-400">₹{item.price} per {item.unit || 'piece'}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, quantity - 1)}
                            className="bg-error-50 text-error-600 p-1.5 rounded-lg hover:bg-error-100 transition-colors"
                            aria-label="Decrease"
                          >
                            <Remove fontSize="small" />
                          </button>
                          <span className="font-bold text-slate-800 min-w-[2rem] text-center">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, quantity + 1)}
                            className="bg-success-50 text-success-600 p-1.5 rounded-lg hover:bg-success-100 transition-colors"
                            aria-label="Increase"
                          >
                            <Add fontSize="small" />
                          </button>
                          <span className="ml-auto font-bold text-primary-700 text-sm">₹{itemTotal}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Grand Total */}
              <div className="rounded-xl border-l-4 border-primary-500 bg-gradient-to-r from-primary-50 to-secondary-50 p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-800">Grand Total</span>
                  <span className="text-2xl font-extrabold text-primary-700">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Customer Form */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h3 className="text-base font-bold text-slate-800 mb-4">Customer Details</h3>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Name <span className="text-primary-600">*</span>
                    </label>
                    <input
                      type="text" id="name" name="name"
                      value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className={`input-field ${formik.touched.name && formik.errors.name ? 'input-error' : ''}`}
                      placeholder="Your full name"
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="mt-1 text-xs text-error-600 font-medium">{formik.errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Phone Number <span className="text-primary-600">*</span>
                    </label>
                    <input
                      type="tel" id="phone" name="phone"
                      value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className={`input-field ${formik.touched.phone && formik.errors.phone ? 'input-error' : ''}`}
                      placeholder="10-digit number" maxLength="10"
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="mt-1 text-xs text-error-600 font-medium">{formik.errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email" id="email" name="email"
                      value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className={`input-field ${formik.touched.email && formik.errors.email ? 'input-error' : ''}`}
                      placeholder="your@email.com (optional)"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-1 text-xs text-error-600 font-medium">{formik.errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Address
                    </label>
                    <textarea
                      id="address" name="address"
                      value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      rows="3"
                      className={`input-field resize-none ${formik.touched.address && formik.errors.address ? 'input-error' : ''}`}
                      placeholder="Complete delivery address (optional)"
                    />
                    {formik.touched.address && formik.errors.address && (
                      <p className="mt-1 text-xs text-error-600 font-medium">{formik.errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Pincode
                    </label>
                    <input
                      type="text" id="pincode" name="pincode"
                      value={formik.values.pincode} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className={`input-field ${formik.touched.pincode && formik.errors.pincode ? 'input-error' : ''}`}
                      placeholder="6-digit pincode (optional)" maxLength="6"
                    />
                    {formik.touched.pincode && formik.errors.pincode && (
                      <p className="mt-1 text-xs text-error-600 font-medium">{formik.errors.pincode}</p>
                    )}
                  </div>

                  {/* WhatsApp CTA */}
                  <button
                    type="submit"
                    disabled={!canPlaceOrder}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-base transition-all duration-200
                      ${canPlaceOrder
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-glow-green hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                  >
                    <WhatsApp />
                    <span>Order via WhatsApp</span>
                  </button>

                  {!canPlaceOrder && (
                    <p className="text-xs text-slate-400 text-center">
                      {!hasItems ? 'Add items to your cart first' : 'Please fill all required fields'}
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

