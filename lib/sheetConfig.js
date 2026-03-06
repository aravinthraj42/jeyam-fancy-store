/**
 * Google Sheets Configuration
 * Manages sheet names and column mappings
 */

export const SHEET_NAMES = {
  CATEGORIES: 'Categories',
  PRODUCTS: 'Products',
};

export const CATEGORY_COLUMNS = {
  ID: 'id',
  NAME: 'name',
  CREATED_AT: 'createdAt',
};

export const PRODUCT_COLUMNS = {
  ID: 'id',
  NAME: 'name',
  CATEGORY_ID: 'categoryId',
  PRICE: 'price',
  IMAGE_URL: 'imageUrl',
  STOCK: 'stock',
  DESCRIPTION: 'description',
  CREATED_AT: 'createdAt',
};

/**
 * Get column index for a given column name
 * @param {Array} headers - Array of header strings
 * @param {string} columnName - Column name to find
 * @returns {number} Column index (0-based) or -1 if not found
 */
export function getColumnIndex(headers, columnName) {
  return headers.findIndex((header) => header.toLowerCase() === columnName.toLowerCase());
}

/**
 * Convert row array to object using headers
 * @param {Array} headers - Array of header strings
 * @param {Array} row - Array of cell values
 * @returns {Object} Object with keys matching headers
 */
export function rowToObject(headers, row) {
  const obj = {};
  headers.forEach((header, index) => {
    obj[header] = row[index] || '';
  });
  return obj;
}

/**
 * Convert object to row array using headers
 * @param {Array} headers - Array of header strings
 * @param {Object} obj - Object to convert
 * @returns {Array} Array of cell values
 */
export function objectToRow(headers, obj) {
  return headers.map((header) => {
    const value = obj[header];
    return value !== undefined && value !== null ? String(value) : '';
  });
}

