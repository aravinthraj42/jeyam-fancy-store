/**
 * API Service
 * Frontend service for communicating with Next.js API routes
 */

// ==================== PRODUCT API ====================

/**
 * Fetch all products
 * @param {string} categoryId - Optional category ID to filter by
 * @returns {Promise<Array>} Array of products
 */
export async function fetchProducts(categoryId = null) {
  try {
    const url = categoryId 
      ? `/api/products?categoryId=${encodeURIComponent(categoryId)}`
      : '/api/products';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch products' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.message || 'Failed to fetch products');
  }
}

/**
 * Fetch product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product object
 */
export async function fetchProductById(id) {
  try {
    const response = await fetch(`/api/products/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch product');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error(error.message || 'Failed to fetch product');
  }
}

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
export async function createProduct(productData) {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: productData.name,
        categoryId: productData.categoryId,
        price: productData.price,
        imageUrl: productData.imageUrl || productData.image,
        stock: productData.stock || productData.stockStatus,
        description: productData.description || '',
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(error.message || 'Failed to create product');
  }
}

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product
 */
export async function updateProduct(id, productData) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: productData.name,
        categoryId: productData.categoryId,
        price: productData.price,
        imageUrl: productData.imageUrl || productData.image,
        stock: productData.stock || productData.stockStatus,
        description: productData.description || '',
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error(error.message || 'Failed to update product');
  }
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteProduct(id) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete product');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error(error.message || 'Failed to delete product');
  }
}

// ==================== CATEGORY API ====================

/**
 * Fetch all categories
 * @returns {Promise<Array>} Array of categories
 */
export async function fetchCategories() {
  try {
    const response = await fetch('/api/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch categories' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error(error.message || 'Failed to fetch categories');
  }
}

/**
 * Fetch category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Category object
 */
export async function fetchCategoryById(id) {
  try {
    const response = await fetch(`/api/categories/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch category');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error(error.message || 'Failed to fetch category');
  }
}

/**
 * Create a new category
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>} Created category
 */
export async function createCategory(categoryData) {
  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: categoryData.name,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create category');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error(error.message || 'Failed to create category');
  }
}

/**
 * Update a category
 * @param {string} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category
 */
export async function updateCategory(id, categoryData) {
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: categoryData.name,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update category');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error(error.message || 'Failed to update category');
  }
}

/**
 * Delete a category
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Deletion result with product count
 */
export async function deleteCategory(id) {
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete category');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error(error.message || 'Failed to delete category');
  }
}

