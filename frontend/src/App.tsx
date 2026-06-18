import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import FilterBar from './components/FilterBar';
import MenuCard from './components/MenuCard';
import ItemDetail from './components/ItemDetail';
import AdminPanel from './components/AdminPanel';
import BottomNavigation from './components/BottomNavigation'; // <-- Imported here
import { getCategories, getMenuItems } from './services/api';
import { MenuItem, MenuCategory, DietaryType } from './types';
import { Flame, Star, Sparkles, Heart, X, RefreshCw, Smile } from 'lucide-react';

export default function App() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);

  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDietary, setSelectedDietary] = useState<DietaryType[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // State for mobile bottom navigation routing
  const [activeTab, setActiveTab] = useState<string>('food');

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wow_burger_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('wow_burger_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [apiCats, apiItemsResponse] = await Promise.all([
        getCategories(),
        getMenuItems(1, 50)
      ]);

      if (Array.isArray(apiCats) && apiCats.length > 0) {
        setCategories(apiCats);
        setActiveCategoryId(apiCats[0].id);
      }

      const items = (apiItemsResponse as any)?.data || apiItemsResponse || [];
      setMenuItems(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshData(); }, []);

  // Sync Bottom Navigation Tabs with Categories & Favorites views
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    if (tabId === 'favorites') {
      setShowFavoritesOnly(true);
      return;
    }
    
    setShowFavoritesOnly(false);
    
    // Find matching category in DB by name strings safely
    const targetCategory = categories.find(c => c.name.toLowerCase().includes(tabId));
    if (targetCategory) {
      setActiveCategoryId(targetCategory.id);
    } else if (tabId === 'home' && categories.length > 0) {
      setActiveCategoryId(categories[0].id);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const match = item.name.toLowerCase().includes(query) || 
                    item.description.toLowerCase().includes(query) ||
                    item.ingredients?.some(ing => ing.toLowerCase().includes(query));
      if (!match) return false;
    }

    if (showFavoritesOnly && !favorites.includes(item.id)) return false;
    
    // If we aren't isolated into favorites view, screen by category match
    if (!showFavoritesOnly && item.categoryId !== activeCategoryId) return false;

    if (selectedDietary.length > 0) {
      return selectedDietary.every((tag) => 
        item.dietaryTags?.some(dbTag => dbTag.toLowerCase() === tag.toLowerCase())
      );
    }
    return true;
  });

  const getGlobalDietaryCounts = (): Record<DietaryType, number> => {
    const counts = { [DietaryType.VEGETARIAN]: 0, [DietaryType.VEGAN]: 0, [DietaryType.GLUTEN_FREE]: 0, [DietaryType.SPICY]: 0, [DietaryType.SIGNATURE]: 0 };
    menuItems.filter(i => i.categoryId === activeCategoryId).forEach(item => {
      item.dietaryTags?.forEach(tag => {
        const key = tag.toUpperCase() as DietaryType;
        if (counts.hasOwnProperty(key)) counts[key]++;
      });
    });
    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center items-center">
        <RefreshCw className="animate-spin text-red-600 mb-4" size={32} />
        <p className="text-xs font-mono uppercase tracking-widest">Loading from Database...</p>
      </div>
    );
  }

  if (showAdminPanel) return <AdminPanel onBack={() => setShowAdminPanel(false)} onRefreshData={refreshData} />;

  return (
    // pb-24 ensures the main views don't hit the bottom navbar frame boundaries on mobile
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-24 md:pb-0">
      {selectedItem ? (
        <ItemDetail item={selectedItem} onBack={() => setSelectedItem(null)} />
      ) : (
        <>
          <Header 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
            favoritesCount={favorites.length} onViewFavorites={() => { setShowFavoritesOnly(!showFavoritesOnly); setActiveTab(showFavoritesOnly ? 'food' : 'favorites'); }} 
            showFavoritesOnly={showFavoritesOnly} onAdminClick={() => setShowAdminPanel(true)} 
          />
          
          {/* Hide secondary sub-bars visually when isolated to favorites dashboard */}
          {!showFavoritesOnly && (
            <>
              <CategoryNav categories={categories} activeCategoryId={activeCategoryId} onSelectCategory={setActiveCategoryId} />
              <FilterBar selectedDietary={selectedDietary} onToggleDietary={(t) => setSelectedDietary(prev => prev.includes(t) ? prev.filter(x => x!==t) : [...prev, t])} onClearFilters={() => setSelectedDietary([])} itemsCounts={getGlobalDietaryCounts()} />
            </>
          )}

          <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
            <div className="mb-6 md:mb-8 border-l-4 border-red-600 pl-4">
              <h2 className="text-xl md:text-2xl font-black">
                {showFavoritesOnly ? 'My Favorites' : (categories.find(c => c.id === activeCategoryId)?.name || 'Menu')}
              </h2>
              <p className="text-xs text-stone-500">{filteredItems.length} options matching</p>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-16 md:py-20 border border-dashed rounded-2xl md:rounded-3xl bg-white px-4">
                <X className="mx-auto text-red-500 mb-4" size={32} />
                <h3 className="font-black text-sm md:text-base">No Matches Found</h3>
                <button onClick={() => {setSearchQuery(''); setSelectedDietary([]); setShowFavoritesOnly(false); setActiveTab('food');}} className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold">Reset Filters</button>
              </div>
            ) : (
              // Changed grid structure to grid-cols-1 on mobile viewports
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} onSelectItem={setSelectedItem} isFavorite={favorites.includes(item.id)} onToggleFavorite={(id, e) => { e.stopPropagation(); setFavorites(prev => prev.includes(id) ? prev.filter(f=>f!==id) : [...prev, id]); }} />
                ))}
              </div>
            )}
          </main>

          {/* Bottom Fixed Navigation UI */}
          <BottomNavigation 
            currentTab={activeTab} 
            onChangeTab={handleTabChange} 
            favoriteCount={favorites.length} 
          />
        </>
      )}
    </div>
  );
}