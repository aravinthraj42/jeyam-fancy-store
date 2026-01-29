import { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Context for managing cart state globally
const CartContext = createContext();

// Cart reducer actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
};

// Initial cart state
const initialState = {
  items: [], // Array of { item, quantity }
  totalItems: 0,
  totalAmount: 0,
};

// Cart reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.item.id === action.payload.id
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        newItems = state.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // New item, add to cart
        newItems = [...state.items, { item: action.payload, quantity: 1 }];
      }

      return calculateTotals(newItems);
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(
        (cartItem) => cartItem.item.id !== action.payload
      );
      return calculateTotals(newItems);
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { itemId, quantity } = action.payload;
      const newItems = state.items.map((cartItem) =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity: Math.max(0, quantity) }
          : cartItem
      ).filter((cartItem) => cartItem.quantity > 0);

      return calculateTotals(newItems);
    }

    case CART_ACTIONS.CLEAR_CART:
      return initialState;

    case CART_ACTIONS.LOAD_CART:
      return calculateTotals(action.payload);

    default:
      return state;
  }
}

// Helper function to calculate totals
function calculateTotals(items) {
  const totalItems = items.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
  const totalAmount = items.reduce(
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0
  );

  return {
    items,
    totalItems,
    totalAmount,
  };
}

// Cart Provider Component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('jeyamFancyStoreCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart.items });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('jeyamFancyStoreCart', JSON.stringify(state));
  }, [state]);

  // Cart actions
  const addItem = (item) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  };

  const removeItem = (itemId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

