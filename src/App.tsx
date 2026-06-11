import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import FilterBar from './components/FilterBar';
import MenuCard from './components/MenuCard';
import ItemDetail from './components/ItemDetail';
import { MENU_CATEGORIES, MENU_ITEMS } from './data';
import { MenuItem, DietaryType } from './types';
import { Flame, Star, Sparkles, Check, Heart, X, ChevronRight, RefreshCw, Smile } from 'lucide-react';

export default function App() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('burgers');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDietary, setSelectedDietary] = useState<DietaryType[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  
  // Selected single item to trigger detailed page view
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Favorites tracking with persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wow_burger_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wow_burger_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card modal
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectCategory = (catId: string) => {
    setActiveCategoryId(catId);
    // If we're showing favorites, we preserve that but direct users towards products
    // Smooth scroll back to categories row
    const element = document.getElementById('category-nav-sticky');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleDietary = (tag: DietaryType) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedDietary([]);
    setShowFavoritesOnly(false);
    setSearchQuery('');
  };

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter computations
  const filteredItems = MENU_ITEMS.filter((item) => {
    // 1. Search Query selection
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchIng = item.ingredients.some((ing) => ing.toLowerCase().includes(query));
      if (!matchName && !matchDesc && !matchIng) return false;
    }

    // 2. Favorites only check
    if (showFavoritesOnly && !favorites.includes(item.id)) {
      return false;
    }

    // 3. Category match (only if favorites are not selected, or within favorites filter by category)
    if (item.category !== activeCategoryId) {
      return false;
    }

    // 4. Dietary options filter
    if (selectedDietary.length > 0) {
      const matchesAllDietary = selectedDietary.every((tag) => item.dietaryTags.includes(tag));
      if (!matchesAllDietary) return false;
    }

    return true;
  });

  // Calculate items counts per dietary tag GLOBALLY for the active category
  const getGlobalDietaryCounts = (): Record<DietaryType, number> => {
    const counts: Record<DietaryType, number> = {
      [DietaryType.VEGETARIAN]: 0,
      [DietaryType.VEGAN]: 0,
      [DietaryType.GLUTEN_FREE]: 0,
      [DietaryType.SPICY]: 0,
      [DietaryType.SIGNATURE]: 0,
    };

    MENU_ITEMS.forEach((item) => {
      if (item.category === activeCategoryId) {
        item.dietaryTags.forEach((tag) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });

    return counts;
  };

  const currentCategoryGourmetCount = getGlobalDietaryCounts();
  const activeCategoryDetail = MENU_CATEGORIES.find((cat) => cat.id === activeCategoryId);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-red-500 selection:text-white" id="app-root-container">
      {selectedItem ? (
        <ItemDetail
          item={selectedItem}
          onBack={() => setSelectedItem(null)}
          isFavorite={favorites.includes(selectedItem.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <>
          {/* Main Digital Lounge Header */}
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            favoritesCount={favorites.length}
            onViewFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
            showFavoritesOnly={showFavoritesOnly}
          />

          {/* Interactive Category Swipe Carousel */}
          <CategoryNav
            categories={MENU_CATEGORIES}
            activeCategoryId={activeCategoryId}
            onSelectCategory={handleSelectCategory}
          />

          {/* Multi-Dietary filter pills bar */}
          <FilterBar
            selectedDietary={selectedDietary}
            onToggleDietary={handleToggleDietary}
            onClearFilters={handleClearFilters}
            itemsCounts={currentCategoryGourmetCount}
          />

          {/* Core Content Area */}
          <main className="max-w-7xl mx-auto px-4 py-8 relative">
            {/* Category Banner Title info */}
            <div className="mb-8 flex flex-col items-start justify-between gap-2 border-l-4 border-red-600 pl-4">
              <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <span>{activeCategoryDetail?.name}</span>
                <span className="text-sm font-mono text-stone-400 font-bold bg-stone-100 px-2 py-0.5 rounded-md">
                  {filteredItems.length} options matching
                </span>
              </h2>
              <p className="text-xs text-stone-500 font-sans max-w-xl">
                {activeCategoryDetail?.description}
              </p>
            </div>

            {/* Empty States (Search or lifestyle filter mismatch) */}
            {filteredItems.length === 0 ? (
              <div className="w-full bg-white border border-stone-200/50 rounded-3xl p-12 text-center shadow-xs flex flex-col items-center max-w-lg mx-auto mt-6">
                <div className="w-16 h-16 bg-red-100/50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                  <X size={28} />
                </div>
                
                <h3 className="text-lg font-black text-stone-850">No Menu Matches Found</h3>
                
                <p className="text-stone-500 text-sm mt-2 leading-relaxed">
                  We elements-filtered carefully but found nothing matching. Try broadening your options or reset the filters below.
                </p>

                <button
                  onClick={handleClearFilters}
                  className="mt-6 inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-850 text-white font-semibold text-xs py-3 px-5 rounded-xl transition-all duration-300 shadow-md hover:scale-102"
                >
                  <RefreshCw size={14} />
                  <span>Reset All Active Filters</span>
                </button>
              </div>
            ) : (
              /* Grid Layout showing culinary products card */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" id="menu-items-grid">
                {filteredItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onSelectItem={handleSelectItem}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Simple digital footer info */}
          <footer className="w-full bg-stone-900 text-stone-500 py-12 px-4 border-t border-stone-800 text-center font-mono text-xs relative z-10 mt-16">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
              <span className="font-extrabold text-stone-300 flex items-center gap-2">
                <Smile size={16} className="text-amber-500 animate-spin" />
                <span>WOW BURGER DIGITAL MENULOG © 2026</span>
              </span>
              <p className="max-w-md text-stone-500 font-sans leading-relaxed text-[11px]">
                Wow Burger guarantees 100% grass-fed Angus patties. Recipe customizers help plan nutritional intakes. Thank you for placing trust in our plates.
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
