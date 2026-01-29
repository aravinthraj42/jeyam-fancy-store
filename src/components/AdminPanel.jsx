import { useState, useEffect } from 'react';
import { ArrowBack, Add, Edit, Delete, Refresh } from '@mui/icons-material';
import { getProducts, getAllItems, addItem, updateItem, deleteItem, resetProducts, STOCK_STATUS_OPTIONS } from '../utils/productManager';
import ProductForm from './ProductForm';
import StockStatusBadge from './StockStatusBadge';

/**
 * AdminPanel Component
 * Product management interface for admins
 */
export default function AdminPanel({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const products = getProducts();
    setCategories(products);
    setItems(getAllItems());
    if (products.length > 0 && !selectedCategory) {
      setSelectedCategory(products[0].id);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = (itemId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteItem(itemId);
      loadProducts();
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing
      updateItem(editingProduct.id, productData);
    } else {
      // Add new
      addItem(productData);
    }
    loadProducts();
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleResetProducts = () => {
    if (window.confirm('Reset all products to default? This will remove all your changes.')) {
      resetProducts();
      loadProducts();
    }
  };

  const handleStockStatusChange = (itemId, newStatus) => {
    updateItem(itemId, { stockStatus: newStatus });
    loadProducts();
  };

  // Filter items by search query
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleCancelForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Back"
              >
                <ArrowBack />
              </button>
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>
            <ProductForm
              product={editingProduct}
              categories={categories}
              onSave={handleSaveProduct}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Back"
              >
                <ArrowBack />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResetProducts}
                className="btn-secondary flex items-center gap-2"
                title="Reset to default products"
              >
                <Refresh />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                onClick={handleAddProduct}
                className="btn-primary flex items-center gap-2"
              >
                <Add />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            </div>
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredItems.length} product(s)
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="card">
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary-600">₹{item.price}</p>
                    <p className="text-xs text-gray-500">per {item.unit}</p>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center justify-between">
                    <StockStatusBadge status={item.stockStatus} />
                    <select
                      value={item.stockStatus}
                      onChange={(e) => handleStockStatusChange(item.id, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {STOCK_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <p className="text-xs text-gray-500">
                    {categories.find((c) => c.id === item.categoryId)?.name || 'Unknown'}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleEditProduct(item)}
                      className="flex-1 btn-secondary flex items-center justify-center gap-1 text-sm py-2"
                    >
                      <Edit fontSize="small" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(item.id)}
                      className="flex-1 bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <Delete fontSize="small" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

