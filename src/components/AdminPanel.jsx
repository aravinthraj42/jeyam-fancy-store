'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowBack, Add, Edit, Delete, Inventory2Outlined, Category, Logout, Home } from '@mui/icons-material';
import { fetchProducts, deleteProduct, fetchCategories, deleteCategory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductForm from './ProductForm';
import CategoryForm from './CategoryForm';
import StockStatusBadge from './StockStatusBadge';
import DeleteCategoryModal from './DeleteCategoryModal';
import DeleteProductModal from './DeleteProductModal';
import LogoutModal from './LogoutModal';

const STOCK_STATUS_OPTIONS = [
  'In Stock',
  'Out of Stock',
  'Available Soon',
  'Available in 2 days',
  'Available in 7 days',
];

/**
 * AdminPanel Component
 * Polished product and category management interface
 */
export default function AdminPanel() {
  const router = useRouter();
  const { logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteCategoryModal, setDeleteCategoryModal] = useState(null);
  const [deleteProductModal, setDeleteProductModal] = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingStockStatus, setUpdatingStockStatus] = useState(null); // Track which product is updating
  const [savingProduct, setSavingProduct] = useState(false); // Track product form submission

  const handleLogout = () => {
    setLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    router.push('/admin/login');
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
      ]);

      setCategories(categoriesData);
      setProducts(productsData);

      // Keep selectedCategory as null to show "All Categories" by default
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (productData) => {
    setSavingProduct(true); // Show loader immediately
    try {
      const { createProduct, updateProduct } = await import('../services/api');
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      await loadData();
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      alert(error.message || 'Failed to save product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProductClick = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setDeleteProductModal(product);
    }
  };

  const handleDeleteProductConfirm = async () => {
    if (!deleteProductModal) return;

    try {
      await deleteProduct(deleteProductModal.id);
      await loadData();
      setDeleteProductModal(null);
    } catch (error) {
      alert(error.message || 'Failed to delete product');
      setDeleteProductModal(null);
    }
  };

  const handleStockStatusChange = async (productId, newStatus) => {
    setUpdatingStockStatus(productId);
    try {
      const { updateProduct } = await import('../services/api');
      await updateProduct(productId, { stock: newStatus });
      await loadData();
    } catch (error) {
      alert(error.message || 'Failed to update stock status');
    } finally {
      setUpdatingStockStatus(null);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleCancelCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async (categoryData) => {
    setSavingProduct(true); // Show loader immediately
    try {
      const { createCategory, updateCategory } = await import('../services/api');
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }
      await loadData();
      setShowCategoryForm(false);
      setEditingCategory(null);
    } catch (error) {
      alert(error.message || 'Failed to save category');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteCategoryClick = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    const productsInCategory = products.filter((p) => p.categoryId === categoryId);
    setDeleteCategoryModal({ category, productCount: productsInCategory.length });
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!deleteCategoryModal) return;

    try {
      await deleteCategory(deleteCategoryModal.category.id);
      await loadData();
      setDeleteCategoryModal(null);
    } catch (error) {
      alert(error.message || 'Failed to delete category');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-3 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" style={{ borderWidth: '3px' }} />
          <p className="text-slate-500 font-medium text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (showProductForm) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary-600 to-secondary-600" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={handleCancelProductForm}
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
                onCancel={handleCancelProductForm}
                isSaving={savingProduct}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCategoryForm) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary-600 to-secondary-600" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={handleCancelCategoryForm}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors focus-ring"
                  aria-label="Back"
                >
                  <ArrowBack fontSize="small" />
                </button>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
              </div>
              <CategoryForm
                category={editingCategory}
                onSave={handleSaveCategory}
                onCancel={handleCancelCategoryForm}
                isSaving={savingProduct}
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
                onClick={() => router.push('/')}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors focus-ring"
                aria-label="Back"
              >
                <ArrowBack fontSize="small" />
              </button>
              <h2 className="text-xl font-bold text-slate-900">Admin Panel</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/')}
                className="btn-secondary flex items-center gap-2 text-xs px-3 py-2"
                title="View Site"
              >
                <Home fontSize="small" />
                <span className="hidden sm:inline">View Site</span>
              </button>
              <button
                onClick={handleAddCategory}
                className="btn-secondary flex items-center gap-2 text-xs px-3 py-2"
              >
                <Category fontSize="small" />
                <span className="hidden sm:inline">Add Category</span>
              </button>
              <button
                onClick={handleAddProduct}
                className="btn-primary flex items-center gap-2 text-sm px-3 py-2"
              >
                <Add fontSize="small" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2 text-xs px-3 py-2 text-error-600 hover:bg-error-50 hover:border-error-200"
                title="Logout"
              >
                <Logout fontSize="small" />
                <span className="hidden sm:inline">Logout</span>
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

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <div key={category.id} className="card p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-800 text-sm">{category.name}</h4>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-1 hover:bg-primary-50 rounded text-primary-600"
                      title="Edit"
                    >
                      <Edit fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategoryClick(category.id)}
                      className="p-1 hover:bg-error-50 rounded text-error-600"
                      title="Delete"
                    >
                      <Delete fontSize="small" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  {products.filter((p) => p.categoryId === category.id).length} products
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-4">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-card">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Inventory2Outlined className="text-slate-400" style={{ fontSize: 32 }} />
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-1">No products found</h3>
              <p className="text-slate-400 text-sm">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="card">
                  {/* Image */}
                  <div className="w-full h-44 bg-slate-100 rounded-xl overflow-hidden mb-3">
                    <img src={product.imageUrl || product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-primary-700">₹{product.price}</p>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center justify-between gap-2">
                      <StockStatusBadge status={product.stock || product.stockStatus} />
                      <div className="relative">
                        <select
                          value={product.stock || product.stockStatus}
                          onChange={(e) => handleStockStatusChange(product.id, e.target.value)}
                          disabled={updatingStockStatus === product.id}
                          className={`text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white text-slate-700 ${
                            updatingStockStatus === product.id ? 'opacity-50 cursor-wait' : ''
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {STOCK_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        {updatingStockStatus === product.id && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="w-3 h-3 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400">
                      {categories.find((c) => c.id === product.categoryId)?.name || 'Unknown category'}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 btn-secondary text-xs py-2"
                      >
                        <Edit fontSize="small" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProductClick(product.id)}
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

      {/* Delete Category Modal */}
      {deleteCategoryModal && (
        <DeleteCategoryModal
          category={deleteCategoryModal.category}
          productCount={deleteCategoryModal.productCount}
          onConfirm={handleDeleteCategoryConfirm}
          onCancel={() => setDeleteCategoryModal(null)}
        />
      )}

      {/* Delete Product Modal */}
      {deleteProductModal && (
        <DeleteProductModal
          product={deleteProductModal}
          onConfirm={handleDeleteProductConfirm}
          onCancel={() => setDeleteProductModal(null)}
        />
      )}

      {/* Logout Modal */}
      {logoutModal && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setLogoutModal(false)}
        />
      )}
    </div>
  );
}

