/**
 * CategoryTabs Component
 * Displays categories as horizontal scrollable tabs
 */
export default function CategoryTabs({ categories, selectedCategory, onCategorySelect }) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-[73px] z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap
                ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

