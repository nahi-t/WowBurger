import React, { useState, useEffect } from 'react';
// Added 'User' to the imports below
import { LogOut, Plus, CheckCircle, AlertTriangle, RefreshCw, Home, Search, User } from 'lucide-react';
// Added 'updateUser' to the imports below
import { 
  getCategories, createCategory, updateCategory, deleteCategory,
  getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, updateUser
} from '../../services/api';
import { MenuItem, MenuCategory } from '../../types';
import CategoryTable from './CategoryTable';
import MenuItemsTable from './MenuItemsTable';
import CategoryModal from './CategoryModal';
import MenuItemModal from './MenuItemModal';
// Added ProfileModal import below
import ProfileModal from './ProfileModal';
// import logoImage from '../../asset/logo.png';

interface AdminDashboardProps {
  userId: string;
  email: string;
  onBack: () => void;
  onRefreshData: () => void;
}

export default function AdminDashboard({ userId, email, onBack, onRefreshData }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'items' | 'profile'>('items');
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  // Pagination & Search State Engine
  const [itemsPage, setItemsPage] = useState<number>(1);
  const [itemsLimit, setItemsLimit] = useState<number>(5);
  const [itemsTotalPages, setItemsTotalPages] = useState<number>(1);
  const [itemsTotal, setItemsTotal] = useState<number>(0);
  const [itemsSearch, setItemsSearch] = useState<string>(''); // Added search filter state
  
  // Operation Status State
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  // Menu Item Modal State
  const [showItemModal, setShowItemModal] = useState<boolean>(false);
  const [isItemEditMode, setIsItemEditMode] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // --- ADDED: Profile Modal State ---
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  // Re-fetch data instantly when user turns pages, adjusts limits, or types a search query
  useEffect(() => {
    fetchRecords();
  }, [itemsPage, itemsLimit, itemsSearch]);

  const showToast = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

 const fetchRecords = async () => {
  setLoading(true);
  try {
    const cats = await getCategories();
    // Added itemsSearch as a third argument down to your endpoint hook
    const itemsResponse = await getMenuItems(itemsPage, itemsLimit, itemsSearch);
    setCategories(cats);
    
    if (itemsResponse && itemsResponse.data) {
      // FIX: Force a safety slice in case the backend ignores the query limit parameter and returns 10
      const dataArray = Array.isArray(itemsResponse.data) ? itemsResponse.data : [];
      
      if (dataArray.length > itemsLimit) {
        setMenuItems(dataArray.slice(0, itemsLimit));
      } else {
        setMenuItems(dataArray);
      }
      
      setItemsTotal(Number(itemsResponse.meta?.total || itemsResponse.meta?.totalRecords || dataArray.length || 0));
      setItemsTotalPages(Number(itemsResponse.meta?.totalPages || Math.ceil(dataArray.length / itemsLimit) || 1));
    } else if (Array.isArray(itemsResponse)) {
      // Fallback local filtering for flat array API structures
      let filteredItems = itemsResponse;
      if (itemsSearch) {
        filteredItems = itemsResponse.filter(item => 
          item.name?.toLowerCase().includes(itemsSearch.toLowerCase()) ||
          item.description?.toLowerCase().includes(itemsSearch.toLowerCase())
        );
      }
      const startIndex = (itemsPage - 1) * itemsLimit;
      const endIndex = startIndex + itemsLimit;
      setMenuItems(filteredItems.slice(startIndex, endIndex));
      setItemsTotal(filteredItems.length);
      setItemsTotalPages(Math.ceil(filteredItems.length / itemsLimit) || 1);
    }
  } catch (err: any) {
    showToast(err.message || 'Failed to load database records.', 'error');
  } finally {
    setLoading(false);
  }
};

  // --- ADDED: PROFILE EVENT HANDLER ---
  const handleSaveProfile = async (data: { currentPassword?: string; email?: string; password?: string }) => {
    setProfileLoading(true);
    try {
      await updateUser(userId, data);
      if (data.email) {
        localStorage.setItem('wow_admin_email', data.email);
      }
      showToast('Profile updated successfully!', 'success');
      setShowProfileModal(false);
      onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // --- CATEGORY EVENT HANDLERS ---
  const handleOpenAddCategory = () => {
    setIsEditMode(false);
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: MenuCategory) => {
    setIsEditMode(true);
    setEditingCategory(cat);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (data: any) => {
    setLoading(true);
    try {
      if (isEditMode && editingCategory) {
        await updateCategory(editingCategory.id, data);
        showToast('Category updated successfully!', 'success');
      } else {
        await createCategory(data);
        showToast('Category created successfully!', 'success');
      }
      setShowCategoryModal(false);
      await fetchRecords();
      onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save category changes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setLoading(true);
    try {
      await deleteCategory(id);
      showToast('Category removed successfully!', 'success');
      await fetchRecords();
      onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Deletion failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- MENU ITEM EVENT HANDLERS ---
  const handleOpenAddItem = () => {
    setIsItemEditMode(false);
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleOpenEditItem = (item: MenuItem) => {
    setIsItemEditMode(true);
    setEditingItem(item);
    setShowItemModal(true);
  };

  const handleSaveItem = async (data: any) => {
    setLoading(true);
    try {
      if (isItemEditMode && editingItem) {
        await updateMenuItem(editingItem.id, data);
        showToast('Menu item updated successfully!', 'success');
      } else {
        await createMenuItem(data);
        showToast('Menu item created successfully!', 'success');
      }
      setShowItemModal(false);
      await fetchRecords();
      onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save menu item changes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setLoading(true);
    try {
      await deleteMenuItem(id);
      showToast('Item removed successfully!', 'success');
      setItemsPage(1); // Drop to first page on count disruption
      await fetchRecords();
      onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete menu item.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Adjust current pagination index safely
  const handlePageChange = (newPage: number) => {
    setItemsPage(newPage);
  };

  // Adjust capacity boundary limit safely
  const handleLimitChange = (newLimit: number) => {
    setItemsLimit(newLimit);
    setItemsPage(1); // Bounce to first page to avoid calculation index exceptions
  };

  // Safely intercept search field updates and snap index context back to page 1
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemsSearch(e.target.value);
    setItemsPage(1);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-8 font-sans selection:bg-red-500 selection:text-white">
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-950 border border-emerald-500/40 text-emerald-300 py-3.5 px-6 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold">
          <CheckCircle size={18} className="text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-6 right-6 z-50 bg-red-950 border border-red-500/40 text-red-300 py-3.5 px-6 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold">
          <AlertTriangle size={18} className="text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-850 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600/20 text-red-500 text-[10px] font-mono font-black border border-red-500/25 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Admin
              </span>
              {loading && <RefreshCw size={14} className="text-amber-500 animate-spin" />}
            </div>
              <div className="flex items-center justify-center h-16 sm:h-24 shrink-0 select-none cursor-pointer group">
  {/* <img 
    src={logoImage} 
    alt="WOWBURGER Logo" 
    className="h-full w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300 ease-out" 
  /> */}
</div>
          </div>

          <div className="flex gap-3">
            <a
              href="/"
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Home size={12} />
              <span>Back to Home</span>
            </a>

            {/* --- ADDED: Profile Button --- */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
            >
              <User size={12} />
              <span>Profile</span>
            </button>
            
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-200 border border-red-900/30 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut size={12} />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Dynamic Controls Subheader Bar (Tabs + Search + Creation Trigger Button) */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Navigation Filter Tabs */}
            <div className="flex bg-stone-900 border border-stone-850 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setActiveTab('items')}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'items' ? 'bg-red-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                Menu Items ({itemsTotal})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'categories' ? 'bg-red-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                Categories ({categories.length})
              </button>
            </div>

            {/* Live Search Field Input (Only targets items tab) */}
            {activeTab === 'items' && (
              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search catalog dishes/drinks..."
                  value={itemsSearch}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-stone-900 border border-stone-850 rounded-xl focus:outline-none focus:border-red-500 text-stone-100 placeholder-stone-500 transition-colors"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            {activeTab === 'categories' ? (
              <button
                onClick={handleOpenAddCategory}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>Create Category</span>
              </button>
            ) : activeTab === 'items' ? (
              <button
                onClick={handleOpenAddItem}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>Insert Dish / Drink</span>
              </button>
            ) : null}
          </div>
        </div>

        {activeTab === 'categories' && !loading && (
          <CategoryTable 
            categories={categories} 
            loading={loading} 
            onEdit={handleOpenEditCategory} 
            onDelete={handleDeleteCategory} 
          />
        )}

        {activeTab === 'items' && !loading && (
          <MenuItemsTable
            items={menuItems}
            total={itemsTotal}
            page={itemsPage}
            totalPages={itemsTotalPages}
            limit={itemsLimit}
            loading={loading}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onEdit={handleOpenEditItem}
            onDelete={handleDeleteItem}
          />
        )}
      </div>

      <CategoryModal
        isOpen={showCategoryModal}
        isEditMode={isEditMode}
        editingCategory={editingCategory}
        totalCategories={categories.length}
        loading={loading}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleSaveCategory}
      />

      <MenuItemModal
        isOpen={showItemModal}
        isEditMode={isItemEditMode}
        editingItem={editingItem}
        categories={categories}
        loading={loading}
        onClose={() => setShowItemModal(false)}
        onSave={handleSaveItem}
      />

      {/* --- ADDED: Profile Modal Component --- */}
      <ProfileModal
        isOpen={showProfileModal}
        email={email}
        loading={profileLoading}
        onClose={() => setShowProfileModal(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}