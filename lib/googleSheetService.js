import { google } from 'googleapis';
import { SHEET_NAMES, CATEGORY_COLUMNS, PRODUCT_COLUMNS, getColumnIndex, rowToObject, objectToRow } from './sheetConfig.js';

/**
 * Google Sheets Service
 * Handles all CRUD operations for Categories and Products
 */
class GoogleSheetService {
  constructor() {
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID;
    this.initialized = false;
  }

  /**
   * Initialize Google Sheets API client
   */
  async initialize() {
    if (this.initialized && this.sheets) {
      return;
    }

    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const authClient = await auth.getClient();
      this.sheets = google.sheets({ version: 'v4', auth: authClient });
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing Google Sheets service:', error);
      throw new Error('Failed to initialize Google Sheets service');
    }
  }

  /**
   * Get all rows from a sheet
   * @param {string} sheetName - Name of the sheet
   * @returns {Promise<Array>} Array of row objects
   */
  async getAllRows(sheetName) {
    await this.initialize();
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        return [];
      }

      const headers = rows[0];
      const dataRows = rows.slice(1);

      return dataRows.map((row) => {
        const obj = rowToObject(headers, row);
        // Convert numeric fields
        if (obj.price) obj.price = parseFloat(obj.price) || 0;
        return obj;
      });
    } catch (error) {
      console.error(`Error getting rows from ${sheetName}:`, error);
      throw new Error(`Failed to get data from ${sheetName}`);
    }
  }

  /**
   * Get headers from a sheet
   * @param {string} sheetName - Name of the sheet
   * @returns {Promise<Array>} Array of header strings
   */
  async getHeaders(sheetName) {
    await this.initialize();
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A1:Z1`,
      });

      return response.data.values?.[0] || [];
    } catch (error) {
      console.error(`Error getting headers from ${sheetName}:`, error);
      throw new Error(`Failed to get headers from ${sheetName}`);
    }
  }

  /**
   * Find row index by ID
   * @param {string} sheetName - Name of the sheet
   * @param {string} idColumn - Column name for ID
   * @param {string} id - ID to search for
   * @returns {Promise<number>} Row index (1-based, including header) or -1 if not found
   */
  async findRowIndexById(sheetName, idColumn, id) {
    await this.initialize();
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        return -1;
      }

      const headers = rows[0];
      const idIndex = getColumnIndex(headers, idColumn);

      if (idIndex === -1) {
        return -1;
      }

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][idIndex] === String(id)) {
          return i + 1; // Return 1-based index
        }
      }

      return -1;
    } catch (error) {
      console.error(`Error finding row in ${sheetName}:`, error);
      throw new Error(`Failed to find row in ${sheetName}`);
    }
  }

  /**
   * Append a row to a sheet
   * @param {string} sheetName - Name of the sheet
   * @param {Object} data - Data object to append
   * @returns {Promise<Object>} Created object with ID
   */
  async appendRow(sheetName, data) {
    await this.initialize();
    try {
      const headers = await this.getHeaders(sheetName);
      const row = objectToRow(headers, data);

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [row],
        },
      });

      return data;
    } catch (error) {
      console.error(`Error appending row to ${sheetName}:`, error);
      throw new Error(`Failed to append row to ${sheetName}`);
    }
  }

  /**
   * Update a row in a sheet
   * @param {string} sheetName - Name of the sheet
   * @param {string} idColumn - Column name for ID
   * @param {string} id - ID of the row to update
   * @param {Object} data - Data object to update
   * @returns {Promise<Object>} Updated object
   */
  async updateRow(sheetName, idColumn, id, data) {
    await this.initialize();
    try {
      const rowIndex = await this.findRowIndexById(sheetName, idColumn, id);
      if (rowIndex === -1) {
        throw new Error(`Row with ${idColumn}="${id}" not found`);
      }

      const headers = await this.getHeaders(sheetName);
      const row = objectToRow(headers, data);

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [row],
        },
      });

      return data;
    } catch (error) {
      console.error(`Error updating row in ${sheetName}:`, error);
      throw new Error(`Failed to update row in ${sheetName}`);
    }
  }

  /**
   * Delete a row from a sheet
   * @param {string} sheetName - Name of the sheet
   * @param {string} idColumn - Column name for ID
   * @param {string} id - ID of the row to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteRow(sheetName, idColumn, id) {
    await this.initialize();
    try {
      const rowIndex = await this.findRowIndexById(sheetName, idColumn, id);
      if (rowIndex === -1) {
        throw new Error(`Row with ${idColumn}="${id}" not found`);
      }

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: await this.getSheetId(sheetName),
                  dimension: 'ROWS',
                  startIndex: rowIndex - 1,
                  endIndex: rowIndex,
                },
              },
            },
          ],
        },
      });

      return true;
    } catch (error) {
      console.error(`Error deleting row from ${sheetName}:`, error);
      throw new Error(`Failed to delete row from ${sheetName}`);
    }
  }

  /**
   * Get sheet ID by name
   * @param {string} sheetName - Name of the sheet
   * @returns {Promise<number>} Sheet ID
   */
  async getSheetId(sheetName) {
    await this.initialize();
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const sheet = response.data.sheets.find((s) => s.properties.title === sheetName);
      if (!sheet) {
        throw new Error(`Sheet "${sheetName}" not found`);
      }

      return sheet.properties.sheetId;
    } catch (error) {
      console.error(`Error getting sheet ID for ${sheetName}:`, error);
      throw new Error(`Failed to get sheet ID for ${sheetName}`);
    }
  }

  // ==================== CATEGORY METHODS ====================

  /**
   * Get all categories
   * @returns {Promise<Array>} Array of category objects
   */
  async getCategories() {
    return await this.getAllRows(SHEET_NAMES.CATEGORIES);
  }

  /**
   * Get category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Object|null>} Category object or null
   */
  async getCategoryById(id) {
    const categories = await this.getCategories();
    return categories.find((cat) => cat.id === id) || null;
  }

  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    const category = {
      id: categoryData.id || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: categoryData.name,
      createdAt: categoryData.createdAt || new Date().toISOString().split('T')[0],
    };
    return await this.appendRow(SHEET_NAMES.CATEGORIES, category);
  }

  /**
   * Update a category
   * @param {string} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(id, categoryData) {
    const existing = await this.getCategoryById(id);
    if (!existing) {
      throw new Error('Category not found');
    }

    const updated = {
      ...existing,
      ...categoryData,
      id, // Ensure ID doesn't change
    };

    return await this.updateRow(SHEET_NAMES.CATEGORIES, CATEGORY_COLUMNS.ID, id, updated);
  }

  /**
   * Delete a category
   * @param {string} id - Category ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCategory(id) {
    return await this.deleteRow(SHEET_NAMES.CATEGORIES, CATEGORY_COLUMNS.ID, id);
  }

  // ==================== PRODUCT METHODS ====================

  /**
   * Get all products
   * @returns {Promise<Array>} Array of product objects
   */
  async getProducts() {
    return await this.getAllRows(SHEET_NAMES.PRODUCTS);
  }

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object|null>} Product object or null
   */
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((prod) => prod.id === id) || null;
  }

  /**
   * Get products by category ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<Array>} Array of product objects
   */
  async getProductsByCategory(categoryId) {
    const products = await this.getProducts();
    return products.filter((prod) => prod.categoryId === categoryId);
  }

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    const product = {
      id: productData.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: productData.name,
      categoryId: productData.categoryId,
      price: productData.price,
      imageUrl: productData.imageUrl || productData.image || '',
      stock: productData.stock || productData.stockStatus || 'In Stock',
      description: productData.description || '',
      createdAt: productData.createdAt || new Date().toISOString().split('T')[0],
    };
    return await this.appendRow(SHEET_NAMES.PRODUCTS, product);
  }

  /**
   * Update a product
   * @param {string} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(id, productData) {
    const existing = await this.getProductById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    const updated = {
      ...existing,
      ...productData,
      id, // Ensure ID doesn't change
      imageUrl: productData.imageUrl || productData.image || existing.imageUrl,
      stock: productData.stock || productData.stockStatus || existing.stock,
    };

    return await this.updateRow(SHEET_NAMES.PRODUCTS, PRODUCT_COLUMNS.ID, id, updated);
  }

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteProduct(id) {
    return await this.deleteRow(SHEET_NAMES.PRODUCTS, PRODUCT_COLUMNS.ID, id);
  }

  /**
   * Delete all products by category ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<number>} Number of products deleted
   */
  async deleteProductsByCategory(categoryId) {
    const products = await this.getProductsByCategory(categoryId);
    let deletedCount = 0;

    for (const product of products) {
      try {
        await this.deleteProduct(product.id);
        deletedCount++;
      } catch (error) {
        console.error(`Error deleting product ${product.id}:`, error);
      }
    }

    return deletedCount;
  }
}

// Export singleton instance
const googleSheetService = new GoogleSheetService();
export default googleSheetService;

