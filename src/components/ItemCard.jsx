import { Add, Remove } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import StockStatusBadge from './StockStatusBadge';

/**
 * ItemCard Component
 * Displays individual product item with add/remove controls and stock status
 */
export default function ItemCard({ item }) {
  const { items, addItem, updateQuantity } = useCart();
  
  // Find if item is in cart
  const cartItem = items.find((cartItem) => cartItem.item.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Check if item is out of stock
  const isOutOfStock = item.stockStatus === 'Out of Stock';
  const stockStatus = item.stockStatus || 'In Stock';

  const handleAdd = () => {
    if (!isOutOfStock) {
      addItem(item);
    }
  };

  const handleRemove = () => {
    if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
    } else {
      updateQuantity(item.id, 0);
    }
  };

  return (
    <div className={`card ${isOutOfStock ? 'opacity-75' : ''}`}>
      {/* Item Image */}
      <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-primary-600">₹{item.price}</p>
            <p className="text-xs text-gray-500">per {item.unit}</p>
          </div>
        </div>

        {/* Stock Status Badge */}
        <div>
          <StockStatusBadge status={stockStatus} />
        </div>

        {/* Add/Remove Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              <Add fontSize="small" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleRemove}
                className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                aria-label="Remove item"
              >
                <Remove fontSize="small" />
              </button>
              
              <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                {quantity}
              </span>
              
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`p-2 rounded-lg transition-colors ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
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

