'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '../src/components/Header';
import CategoryTabs from '../src/components/CategoryTabs';
import ItemCard from '../src/components/ItemCard';
import StickyCartBar from '../src/components/StickyCartBar';
import { fetchProducts, fetchCategories } from '../src/services/api';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
      ]);

      // Transform categories and products to match expected format
      const transformedCategories = categoriesData.map((cat) => ({
        id: cat.id,
        name: cat.name,
        items: productsData.filter((p) => p.categoryId === cat.id),
      }));

      setCategories(transformedCategories);
      setProducts(productsData);

      if (transformedCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(transformedCategories[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCurrentCategoryItems = () => {
    if (!selectedCategory) return [];
    const category = categories.find((cat) => cat.id === selectedCategory);
    return category ? category.items : [];
  };

  if (loading) {
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

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <Header />

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
      <StickyCartBar />
    </div>
  );
}

