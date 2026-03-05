import { Add, Remove } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import StockStatusBadge from './StockStatusBadge';

/**
 * ItemCard Component
 * Elevated product card with violet add controls and responsive layout
 */
export default function ItemCard({ item }) {
  const { items, addItem, updateQuantity } = useCart();

  const cartItem = items.find((cartItem) => cartItem.item.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const isOutOfStock = item.stockStatus === 'Out of Stock';
  const stockStatus = item.stockStatus || 'In Stock';

  const handleAdd = () => {
    if (!isOutOfStock) addItem(item);
  };

  const handleRemove = () => {
    updateQuantity(item.id, quantity > 1 ? quantity - 1 : 0);
  };

  return (
    <div className={`card flex flex-col ${isOutOfStock ? 'opacity-70' : ''}`}>
      {/* Item Image */}
      <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden mb-3 relative flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-error-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg tracking-wide">
              Out of Stock
            </span>
          </div>
        )}
        {/* In-cart indicator */}
        {quantity > 0 && (
          <div className="absolute top-2 right-2 bg-gradient-to-br from-primary-600 to-secondary-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
            {quantity}
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex flex-col flex-1 space-y-2">
        <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm leading-snug">
          {item.name}
        </h3>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-primary-700">₹{item.price}</p>
            <p className="text-xs text-slate-400">per {item.unit}</p>
          </div>
          <StockStatusBadge status={stockStatus} />
        </div>

        {/* Add/Remove Controls */}
        <div className="pt-2 border-t border-slate-100 mt-auto">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-sm hover:shadow-glow-primary hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              <Add fontSize="small" />
              <span>{isOutOfStock ? 'Unavailable' : 'Add to Cart'}</span>
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={handleRemove}
                className="bg-error-50 text-error-600 p-2 rounded-xl hover:bg-error-100 transition-colors focus:outline-none focus:ring-2 focus:ring-error-400"
                aria-label="Remove item"
              >
                <Remove fontSize="small" />
              </button>

              <span className="font-bold text-slate-800 min-w-[2.5rem] text-center text-base">
                {quantity}
              </span>

              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`p-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400
                  ${isOutOfStock
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    : 'bg-success-50 text-success-600 hover:bg-success-100'
                  }`}
                aria-label="Add item"
              >
                <Add fontSize="small" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
