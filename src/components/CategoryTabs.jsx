'use client';

/**
 * CategoryTabs Component
 * Horizontal scrollable pill tabs with violet active state and smooth transitions
 */
export default function CategoryTabs({ categories, selectedCategory, onCategorySelect }) {
  const ALL_CATEGORY_ID = 'all';

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-slate-100 sticky top-[61px] z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {/* All Tab */}
            <button
              onClick={() => onCategorySelect(ALL_CATEGORY_ID)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap
                focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1
                ${selectedCategory === ALL_CATEGORY_ID
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-700 hover:scale-105'
                }
              `}
            >
              All
            </button>
            {/* Category Tabs */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap
                  focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1
                  ${selectedCategory === category.id
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-700 hover:scale-105'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
          {/* Right fade mask */}
          <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-white pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

