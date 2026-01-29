import productsData from '../data/products.json';

/**
 * Product Management Utilities
 * Handles CRUD operations for products using localStorage
 * 
 * SECURITY NOTE: This is a frontend-only system.
 * All data is stored in localStorage and can be modified by users.
 */

const PRODUCTS_STORAGE_KEY = 'jeyamFancyStoreProducts';

// Default stock status options
export const STOCK_STATUS_OPTIONS = [
  'In Stock',
  'Out of Stock',
  'Available Soon',
  'Available in 2 days',
  'Available in 7 days',
];

/**
 * Initialize products with stockStatus if not present
 */
function initializeProductsWithStockStatus(products) {
  return products.map((category) => ({
    ...category,
    items: category.items.map((item) => ({
      ...item,
      stockStatus: item.stockStatus || 'In Stock', // Default to "In Stock"
    })),
  }));
}

/**
 * Get products from localStorage or fallback to products.json
 * @returns {Array} Categories with items
 */
export function getProducts() {
  const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  
  if (savedProducts) {
    try {
      const parsed = JSON.parse(savedProducts);
      return initializeProductsWithStockStatus(parsed);
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
      // Fallback to default
      return initializeProductsWithStockStatus(productsData.categories);
    }
  }

  // First time - initialize from products.json
  const initialized = initializeProductsWithStockStatus(productsData.categories);
  saveProducts(initialized);
  return initialized;
}

/**
 * Save products to localStorage
 * @param {Array} categories - Categories with items
 */
export function saveProducts(categories) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(categories));
}

/**
 * Get all items across all categories
 * @returns {Array} All items
 */
export function getAllItems() {
  const categories = getProducts();
  return categories.flatMap((category) => category.items);
}

/**
 * Get item by ID
 * @param {string} itemId - Item ID
 * @returns {Object|null} Item or null
 */
export function getItemById(itemId) {
  const items = getAllItems();
  return items.find((item) => item.id === itemId) || null;
}

/**
 * Add new item to a category
 * @param {Object} item - New item object
 * @returns {boolean} Success status
 */
export function addItem(item) {
  const categories = getProducts();
  const category = categories.find((cat) => cat.id === item.categoryId);

  if (!category) {
    return false;
  }

  // Ensure stockStatus is set
  const newItem = {
    ...item,
    stockStatus: item.stockStatus || 'In Stock',
  };

  category.items.push(newItem);
  saveProducts(categories);
  return true;
}

/**
 * Update existing item
 * @param {string} itemId - Item ID
 * @param {Object} updates - Fields to update
 * @returns {boolean} Success status
 */
export function updateItem(itemId, updates) {
  const categories = getProducts();
  let found = false;

  categories.forEach((category) => {
    const itemIndex = category.items.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      category.items[itemIndex] = {
        ...category.items[itemIndex],
        ...updates,
      };
      found = true;
    }
  });

  if (found) {
    saveProducts(categories);
  }
  return found;
}

/**
 * Delete item
 * @param {string} itemId - Item ID
 * @returns {boolean} Success status
 */
export function deleteItem(itemId) {
  const categories = getProducts();
  let found = false;

  categories.forEach((category) => {
    const index = category.items.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      category.items.splice(index, 1);
      found = true;
    }
  });

  if (found) {
    saveProducts(categories);
  }
  return found;
}

/**
 * Reset products to default (from products.json)
 */
export function resetProducts() {
  localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  return initializeProductsWithStockStatus(productsData.categories);
}

