import { useState, useEffect } from 'react';
import { ArrowBack, Add, Edit, Delete, Refresh, Inventory2Outlined } from '@mui/icons-material';
import { getProducts, getAllItems, addItem, updateItem, deleteItem, resetProducts, STOCK_STATUS_OPTIONS } from '../utils/productManager';
import ProductForm from './ProductForm';
import StockStatusBadge from './StockStatusBadge';

/**
 * AdminPanel Component
 * Polished product management interface with violet theme
 */
export default function AdminPanel({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = () => {
    const products = getProducts();
    setCategories(products);
    setItems(getAllItems());
    if (products.length > 0 && !selectedCategory) setSelectedCategory(products[0].id);
  };

  const handleAddProduct = () => { setEditingProduct(null); setShowForm(true); };
  const handleEditProduct = (p) => { setEditingProduct(p); setShowForm(true); };
  const handleCancelForm = () => { setShowForm(false); setEditingProduct(null); };

  const handleDeleteProduct = (itemId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteItem(itemId);
      loadProducts();
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) updateItem(editingProduct.id, productData);
    else addItem(productData);
    loadProducts();
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

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary-600 to-secondary-600" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={handleCancelForm}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors focus-ring"
                  aria-label="Back"
                >
                  <ArrowBack fontSize="small" />
                </button>
                <h2 className="text-xl font-bold text-slate-900">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-header sticky top-0 z-30 border-b border-slate-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors focus-ring"
                aria-label="Back"
              >
                <ArrowBack fontSize="small" />
              </button>
              <h2 className="text-xl font-bold text-slate-900">Admin Panel</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResetProducts}
                className="btn-secondary flex items-center gap-2 text-xs px-3 py-2"
                title="Reset to default products"
              >
                <Refresh fontSize="small" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                onClick={handleAddProduct}
                className="btn-primary flex items-center gap-2 text-sm px-3 py-2"
              >
                <Add fontSize="small" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field flex-1"
            />
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="input-field sm:w-48"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-6">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-4">
          Showing {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''}
        </p>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-card">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Inventory2Outlined className="text-slate-400" style={{ fontSize: 32 }} />
            </div>
            <h3 className="text-lg font-bold text-slate-600 mb-1">No products found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="card">
                {/* Image */}
                <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden mb-3">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary-700">₹{item.price}</p>
                    <p className="text-xs text-slate-400">per {item.unit}</p>
                  </div>

                  {/* Stock */}
                  <div className="flex items-center justify-between gap-2">
                    <StockStatusBadge status={item.stockStatus} />
                    <select
                      value={item.stockStatus}
                      onChange={(e) => handleStockStatusChange(item.id, e.target.value)}
                      className="text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white text-slate-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {STOCK_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-slate-400">
                    {categories.find((c) => c.id === item.categoryId)?.name || 'Unknown category'}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleEditProduct(item)}
                      className="flex-1 btn-secondary text-xs py-2"
                    >
                      <Edit fontSize="small" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(item.id)}
                      className="flex-1 btn-danger text-xs py-2"
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
