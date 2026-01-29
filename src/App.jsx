import { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import ItemCard from './components/ItemCard';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import { getProducts } from './utils/productManager';

/**
 * Main App Component
 * Manages routing between home, cart, login, and admin views
 */
function AppContent() {
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const { isAuthenticated, isLoading } = useAuth();

  // Load categories from productManager (localStorage or JSON)
  useEffect(() => {
    loadCategories();
  }, []);

  // Reload categories when admin panel is closed (in case products were updated)
  useEffect(() => {
    if (!showAdmin) {
      loadCategories();
    }
  }, [showAdmin]);

  const loadCategories = () => {
    const products = getProducts();
    setCategories(products);
    if (products.length > 0 && !selectedCategory) {
      setSelectedCategory(products[0].id);
    }
  };

  // Get items for selected category
  const getCurrentCategoryItems = () => {
    if (!selectedCategory) return [];
    const category = categories.find((cat) => cat.id === selectedCategory);
    return category ? category.items : [];
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    // Scroll to top when category changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCartClick = () => {
    setShowCart(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setShowCart(false);
    setShowAdmin(false);
    setShowLogin(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setShowAdmin(true);
      setShowCart(false);
      setShowLogin(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowCart(false);
    setShowAdmin(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    // Login successful, close login page and return to store
    setShowLogin(false);
  };

  const handleBackFromLogin = () => {
    setShowLogin(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render content based on view
  const renderContent = () => {
    // Show login page if login button was clicked
    if (showLogin) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={handleBackFromLogin} />;
    }

    // Show admin panel (requires authentication)
    if (showAdmin) {
      if (!isAuthenticated) {
        // If not authenticated, redirect to login
        setShowLogin(true);
        setShowAdmin(false);
        return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={handleBackFromLogin} />;
      }
      return <AdminPanel onBack={handleBackToHome} />;
    }

    // Show cart page
    if (showCart) {
      return <CartPage onBack={handleBackToHome} />;
    }

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <Header 
          onCartClick={handleCartClick} 
          onAdminClick={handleAdminClick}
          onLoginClick={handleLoginClick}
        />

        {/* Category Tabs */}
        {categories.length > 0 && (
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {/* Items Grid */}
        <main className="container mx-auto px-4 py-6">
          {selectedCategory && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {categories.find((cat) => cat.id === selectedCategory)?.name || 'Items'}
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getCurrentCategoryItems().map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>

              {getCurrentCategoryItems().length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No items in this category</p>
                </div>
              )}
            </>
          )}
        </main>

        {/* Sticky Bottom Cart Bar (Mobile) */}
        <StickyCartBar onCartClick={handleCartClick} />
      </div>
    );
  };

  return <CartProvider>{renderContent()}</CartProvider>;
}

/**
 * Main App Component with Providers
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

/**
 * Sticky Bottom Cart Bar Component
 * Shows cart summary at bottom on mobile
 */
function StickyCartBar({ onCartClick }) {
  const { totalItems, totalAmount } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <button
        onClick={onCartClick}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {totalItems}
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-600">View Cart</p>
            <p className="text-lg font-bold text-primary-600">₹{totalAmount}</p>
          </div>
        </div>
        <span className="text-primary-600 font-semibold">→</span>
      </button>
    </div>
  );
}

export default App;
