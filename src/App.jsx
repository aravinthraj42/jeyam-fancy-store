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
  const [isFromAdminRoute, setIsFromAdminRoute] = useState(false);

  // Handle URL-based routing
  useEffect(() => {
    const path = window.location.pathname;
    
    // Check if user is on /admin/login route
    if (path === '/admin/login') {
      setShowLogin(true);
      setShowCart(false);
      setShowAdmin(false);
      setIsFromAdminRoute(true);
    } else if (path === '/admin') {
      // If on /admin route, check authentication
      if (isAuthenticated) {
        setShowAdmin(true);
        setShowLogin(false);
        setShowCart(false);
        setIsFromAdminRoute(false);
      } else {
        // Not authenticated, redirect to /admin/login
        window.history.replaceState({}, '', '/admin/login');
        setShowLogin(true);
        setShowAdmin(false);
        setShowCart(false);
        setIsFromAdminRoute(true);
      }
    } else {
      // Reset to home view if not on admin routes
      setShowLogin(false);
      setShowAdmin(false);
      setIsFromAdminRoute(false);
    }
  }, [isAuthenticated]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin/login') {
        setShowLogin(true);
        setShowCart(false);
        setShowAdmin(false);
        setIsFromAdminRoute(true);
      } else if (path === '/admin') {
        if (isAuthenticated) {
          setShowAdmin(true);
          setShowLogin(false);
          setShowCart(false);
          setIsFromAdminRoute(false);
        } else {
          window.history.replaceState({}, '', '/admin/login');
          setShowLogin(true);
          setShowAdmin(false);
          setShowCart(false);
          setIsFromAdminRoute(true);
        }
      } else {
        setShowLogin(false);
        setShowCart(false);
        setShowAdmin(false);
        setIsFromAdminRoute(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

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
    setIsFromAdminRoute(false);
    // Update URL to home
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowCart(false);
    setShowAdmin(false);
    setIsFromAdminRoute(false);
    // Update URL to login
    window.history.pushState({}, '', '/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    // Login successful
    if (isFromAdminRoute || window.location.pathname === '/admin/login') {
      // If user came from /admin/login, redirect to admin panel
      setShowLogin(false);
      setShowAdmin(true);
      setShowCart(false);
      setIsFromAdminRoute(false);
      // Update URL to admin
      window.history.pushState({}, '', '/admin');
    } else {
      // Otherwise, return to store
      setShowLogin(false);
      setIsFromAdminRoute(false);
      window.history.pushState({}, '', '/');
    }
  };

  const handleBackFromLogin = () => {
    setShowLogin(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-slate-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-200">
            <span className="text-white font-extrabold text-2xl">J</span>
          </div>
          <div className="w-8 h-8 mx-auto mb-3 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" style={{ borderWidth: '3px' }} />
          <p className="text-slate-500 font-medium text-sm">Loading store…</p>
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
        // If not authenticated, redirect to /admin/login
        window.history.pushState({}, '', '/admin/login');
        setShowLogin(true);
        setShowAdmin(false);
        setIsFromAdminRoute(true);
        return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={handleBackFromLogin} />;
      }
      return <AdminPanel onBack={handleBackToHome} />;
    }

    // Show cart page
    if (showCart) {
      return <CartPage onBack={handleBackToHome} />;
    }

    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Header */}
        <Header
          onCartClick={handleCartClick}
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
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {categories.find((cat) => cat.id === selectedCategory)?.name || 'Items'}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getCurrentCategoryItems().map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>

              {getCurrentCategoryItems().length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-400 text-sm">No items in this category yet.</p>
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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4">
      <button
        onClick={onCartClick}
        className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-glow-primary transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
            {totalItems}
          </div>
          <div className="text-left">
            <p className="text-xs text-white/70 font-medium">View Cart</p>
            <p className="text-lg font-extrabold">₹{totalAmount}</p>
          </div>
        </div>
        <span className="text-white font-bold text-lg">→</span>
      </button>
    </div>
  );
}

export default App;
