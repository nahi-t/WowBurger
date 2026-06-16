import React, { useState, useEffect } from 'react';
import { 
  Key, LogOut, Trash2, Edit3, Plus, X, Check, 
  AlertTriangle, RefreshCw, Flame, Sparkles, GlassWater, Cookie, 
  Settings, Award, Shield, CheckCircle, ChevronRight, PlusCircle, MinusCircle, FileText, ArrowLeft
} from 'lucide-react';
import { 
  login, getCategories, createCategory, updateCategory, deleteCategory,
  getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, removeToken, getToken,
  updateUser, getUserId
} from '../services/api';
import { MenuItem, MenuCategory, DietaryType, IngredientInfo } from '../types';

interface AdminPanelProps {
  onBack: () => void;
  onRefreshData: () => void;
}

const CATEGORY_ICONS = [
  { name: 'Flame', label: 'Flame (Spicy/Grilled)' },
  { name: 'Sparkles', label: 'Sparkles (Sides/Specials)' },
  { name: 'GlassWater', label: 'Glass (Drinks/Elixirs)' },
  { name: 'Cookie', label: 'Cookie (Desserts/Sweets)' },
];

export default function AdminPanel({ onBack, onRefreshData }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('admin@g.com');
  const [password, setPassword] = useState<string>('admin123');
  const [activeTab, setActiveTab] = useState<'categories' | 'items' | 'profile'>('items');
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  // Loading & Alerts
  const [loading, setLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showItemModal, setShowItemModal] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Category Form State
  const [catName, setCatName] = useState<string>('');
  const [catSlug, setCatSlug] = useState<string>('');
  const [catDescription, setCatDescription] = useState<string>('');
  const [catIconName, setCatIconName] = useState<string>('Flame');
  const [catDisplayOrder, setCatDisplayOrder] = useState<number>(0);

  // Menu Item Form State
  const [itemName, setItemName] = useState<string>('');
  const [itemSlug, setItemSlug] = useState<string>('');
  const [itemCategoryId, setItemCategoryId] = useState<string>('');
  const [itemPrice, setItemPrice] = useState<string>('Br 0');
  const [itemShortDescription, setItemShortDescription] = useState<string>('');
  const [itemDescription, setItemDescription] = useState<string>('');
  const [itemImageUrl, setItemImageUrl] = useState<string>('');
  const [itemCalories, setItemCalories] = useState<number>(0);
  const [itemRating, setItemRating] = useState<number>(5.0);
  const [itemReviewsCount, setItemReviewsCount] = useState<number>(0);
  const [itemIsAvailable, setItemIsAvailable] = useState<boolean>(true);

  // Ingredients tag input helper
  const [ingredientsText, setIngredientsText] = useState<string>('');
  
  // Detailed Ingredients Form Helper
  const [detailedIngredients, setDetailedIngredients] = useState<IngredientInfo[]>([]);
  const [newDetailName, setNewDetailName] = useState<string>('');
  const [newDetailSource, setNewDetailSource] = useState<string>('');
  const [newDetailIcon, setNewDetailIcon] = useState<string>('Star');

  // Dietary tags selection helper
  const [dietaryTags, setDietaryTags] = useState<DietaryType[]>([]);

  // Nutrition helper
  const [protein, setProtein] = useState<string>('0g');
  const [carbs, setCarbs] = useState<string>('0g');
  const [fat, setFat] = useState<string>('0g');
  const [sodium, setSodium] = useState<string>('');

  // Customizable Options Helper
  const [customOptions, setCustomOptions] = useState<Array<{ name: string; options: string[] }>>([]);
  const [newOptName, setNewOptName] = useState<string>('');
  const [newOptValues, setNewOptValues] = useState<string>('');

  // Profile State
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profileEmail, setProfileEmail] = useState<string>('');
  const [profileCurrentPassword, setProfileCurrentPassword] = useState<string>('');
  const [profileNewPassword, setProfileNewPassword] = useState<string>('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState<string>('');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Check login on load
  useEffect(() => {
    const token = getToken();
    const savedUserId = getUserId();
    if (token) {
      setIsLoggedIn(true);
      if (savedUserId) {
        setCurrentUserId(savedUserId);
      }
      fetchData();
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const cats = await getCategories();
      const items = await getMenuItems();
      setCategories(cats);
      setMenuItems(items);
    } catch (err: any) {
      showToast(err.message || 'Failed to load database records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const data = await login(email, password);
      setCurrentUserId(data.userId);
      setIsLoggedIn(true);
      await fetchData();
      onRefreshData(); // Notify App.tsx to reload its menu list
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setCategories([]);
    setMenuItems([]);
    onRefreshData();
  };

  // --- Category Form Handlers ---
  const handleOpenAddCategory = () => {
    setIsEditMode(false);
    setEditingId(null);
    setCatName('');
    setCatSlug('');
    setCatDescription('');
    setCatIconName('Flame');
    setCatDisplayOrder(categories.length);
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: MenuCategory) => {
    setIsEditMode(true);
    setEditingId(cat.id);
    setCatName(cat.name);
    // In database Category, slug represents id/slug
    // Wait, let's map Category fields carefully
    // cat object properties are name, slug, description, iconName, displayOrder
    // If database returned slug, let's prefill it
    const dbCat = cat as any;
    setCatSlug(dbCat.slug || '');
    setCatDescription(dbCat.description || '');
    setCatIconName(dbCat.iconName || 'Flame');
    setCatDisplayOrder(dbCat.displayOrder || 0);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catSlug) {
      showToast('Name and Slug are required.', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: catName,
        slug: catSlug.toLowerCase().replace(/\s+/g, '-'),
        description: catDescription,
        iconName: catIconName,
        displayOrder: Number(catDisplayOrder),
      };

      if (isEditMode && editingId) {
        await updateCategory(editingId, payload);
        showToast('Category updated successfully!', 'success');
      } else {
        await createCategory(payload);
        showToast('Category created successfully!', 'success');
      }
      setShowCategoryModal(false);
      await fetchData();
      onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save category.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"? Warning: Items linked to this category might restrict deletion.`)) {
      return;
    }
    setLoading(true);
    try {
      await deleteCategory(id);
      showToast('Category deleted successfully!', 'success');
      await fetchData();
      onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Menu Item Form Handlers ---
  const handleOpenAddItem = () => {
    setIsEditMode(false);
    setEditingId(null);
    setItemName('');
    setItemSlug('');
    setItemCategoryId(categories[0]?.id || '');
    setItemPrice('Br 250');
    setItemShortDescription('');
    setItemDescription('');
    setItemImageUrl('');
    setItemCalories(500);
    setItemRating(5.0);
    setItemReviewsCount(0);
    setItemIsAvailable(true);
    
    // Sub-structures
    setIngredientsText('');
    setDetailedIngredients([]);
    setDietaryTags([]);
    setProtein('15g');
    setCarbs('45g');
    setFat('12g');
    setSodium('');
    setCustomOptions([]);
    
    setShowItemModal(true);
  };

  const handleOpenEditItem = (item: MenuItem) => {
    setIsEditMode(true);
    setEditingId(item.id);
    setItemName(item.name);
    
    // Find category ID matching category slug
    const dbItem = item as any;
    setItemSlug(dbItem.slug || '');
    setItemPrice(item.price || '');
    setItemShortDescription(dbItem.shortDescription || '');
    setItemDescription(item.description || '');
    setItemImageUrl(item.image || '');
    setItemCalories(item.calories || 0);
    setItemRating(item.rating || 5.0);
    setItemReviewsCount(item.reviewsCount || 0);
    setItemIsAvailable(dbItem.isAvailable !== undefined ? dbItem.isAvailable : true);

    // Find database category ID
    const matchedCat = categories.find(c => c.id === dbItem.categoryId || (c as any).slug === item.category);
    setItemCategoryId(matchedCat ? matchedCat.id : (dbItem.categoryId || ''));

    // Sub-structures
    setIngredientsText(item.ingredients?.join(', ') || '');
    setDetailedIngredients(item.detailedIngredients || []);
    setDietaryTags(item.dietaryTags || []);
    setProtein(item.nutrition?.protein || '0g');
    setCarbs(item.nutrition?.carbs || '0g');
    setFat(item.nutrition?.fat || '0g');
    setSodium(item.nutrition?.sodium || '');
    setCustomOptions(item.customizableOptions || []);

    setShowItemModal(true);
  };

  const handleAddDetailIngredient = () => {
    if (!newDetailName) return;
    setDetailedIngredients(prev => [
      ...prev,
      { name: newDetailName, source: newDetailSource, icon: newDetailIcon }
    ]);
    setNewDetailName('');
    setNewDetailSource('');
    setNewDetailIcon('Star');
  };

  const handleRemoveDetailIngredient = (index: number) => {
    setDetailedIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCustomOption = () => {
    if (!newOptName || !newOptValues) return;
    const vals = newOptValues.split(',').map(s => s.trim()).filter(Boolean);
    if (vals.length === 0) return;
    
    setCustomOptions(prev => [
      ...prev,
      { name: newOptName, options: vals }
    ]);
    setNewOptName('');
    setNewOptValues('');
  };

  const handleRemoveCustomOption = (index: number) => {
    setCustomOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleDietaryTag = (tag: DietaryType) => {
    setDietaryTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemCategoryId || !itemPrice) {
      showToast('Name, Category, and Price are required.', 'error');
      return;
    }
    setLoading(true);
    try {
      const ingredients = ingredientsText.split(',').map(s => s.trim()).filter(Boolean);
      
      const payload = {
        name: itemName,
        slug: itemSlug ? itemSlug.toLowerCase().replace(/\s+/g, '-') : itemName.toLowerCase().replace(/\s+/g, '-'),
        categoryId: itemCategoryId,
        price: itemPrice,
        shortDescription: itemShortDescription || itemDescription.substring(0, 100),
        description: itemDescription,
        imageUrl: itemImageUrl,
        isAvailable: itemIsAvailable,
        ingredients,
        detailedIngredients,
        calories: Number(itemCalories),
        dietaryTags,
        rating: Number(itemRating),
        reviewsCount: Number(itemReviewsCount),
        nutrition: {
          protein,
          carbs,
          fat,
          ...(sodium ? { sodium } : {})
        },
        customizableOptions: customOptions,
      };

      if (isEditMode && editingId) {
        await updateMenuItem(editingId, payload);
        showToast('Menu item updated successfully!', 'success');
      } else {
        await createMenuItem(payload);
        showToast('Menu item created successfully!', 'success');
      }
      setShowItemModal(false);
      await fetchData();
      onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save menu item.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      return;
    }
    setLoading(true);
    try {
      await deleteMenuItem(id);
      showToast('Menu item deleted successfully!', 'success');
      await fetchData();
      onRefreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete menu item.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileNewPassword && profileNewPassword !== profileConfirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    
    if (!profileNewPassword && !profileEmail) {
      showToast('Please enter at least one field to update.', 'error');
      return;
    }

    setLoading(true);
    try {
      const updateData: any = {};
      
      if (profileEmail && profileEmail !== email) {
        updateData.email = profileEmail;
      }
      
      if (profileNewPassword) {
        updateData.password = profileNewPassword;
      }

      if (Object.keys(updateData).length === 0) {
        showToast('No changes detected.', 'error');
        setLoading(false);
        return;
      }

      // Note: You may need to pass the userId from login response
      // For now, we'll use 'current' - update this with actual userId from auth
      if (!currentUserId) {
        showToast('Unable to update profile: missing user ID.', 'error');
        setLoading(false);
        return;
      }

      await updateUser(currentUserId, updateData);
      
      showToast('Profile updated successfully!', 'success');
      setShowProfileModal(false);
      setProfileNewPassword('');
      setProfileConfirmPassword('');
      setProfileCurrentPassword('');
      
      // Update local state if email changed
      if (profileEmail !== email) {
        setEmail(profileEmail);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Render Login View ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-red-500 selection:text-white" id="admin-login-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-1.5 bg-stone-850 hover:bg-stone-800 text-stone-300 font-bold text-xs py-2.5 px-4 rounded-xl border border-stone-800 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} className="text-red-500" />
          <span>Exit Admin Portal</span>
        </button>

        {/* Login Card */}
        <div className="w-full max-w-md bg-stone-950/80 backdrop-blur-md border border-stone-800 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-red-950/50 mb-3 animate-pulse">
              <Shield size={22} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white uppercase">Wow Burger Console</h2>
            <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mt-1">Authorized Administration Login</p>
          </div>

          {authError && (
            <div className="mb-4 bg-red-900/20 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs flex gap-2 items-center">
              <AlertTriangle size={16} className="text-red-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Security Password
              </label>
              <input
                type="password"
                required
                className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-3 text-stone-100 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-red-900/30 hover:scale-[1.02] cursor-pointer flex justify-center items-center gap-1.5"
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Key size={14} />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-stone-900 pt-4 text-center">
            <span className="text-[9px] font-mono text-stone-600 block uppercase">
              Grass-fed Database Management Panel • 2026
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Dashboard View ---
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 sm:p-8 font-sans selection:bg-red-500 selection:text-white" id="admin-dashboard-view">
      {/* Top Banner Notifications */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-950 border border-emerald-500/40 text-emerald-300 py-3.5 px-6 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in text-sm font-semibold">
          <CheckCircle size={18} className="text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-6 right-6 z-50 bg-red-950 border border-red-500/40 text-red-300 py-3.5 px-6 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in text-sm font-semibold">
          <AlertTriangle size={18} className="text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Header Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-850 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600/20 text-red-500 text-[10px] font-mono font-black border border-red-500/25 px-2.5 py-1 rounded-md uppercase tracking-wider">
                Full-Stack Admin Mode
              </span>
              {loading && <RefreshCw size={14} className="text-amber-500 animate-spin" />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
              WOWBURGER <span className="text-red-600 font-black">CONTROL LOG</span>
            </h1>
            <p className="text-[11px] font-mono text-stone-500 uppercase mt-0.5">
              Live updates linked directly to postgres database on port 5001
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold text-xs uppercase tracking-wider transition-colors border border-stone-850 cursor-pointer"
            >
              Customer Menu
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-200 border border-red-900/30 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut size={12} />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex bg-stone-900 border border-stone-850 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setActiveTab('items')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                activeTab === 'items'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              Menu Items ({menuItems.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              Profile
            </button>
          </div>

          <div>
            {activeTab === 'categories' ? (
              <button
                onClick={handleOpenAddCategory}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Create Category</span>
              </button>
            ) : activeTab === 'items' ? (
              <button
                onClick={handleOpenAddItem}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Insert Dish / Drink</span>
              </button>
            ) : (
              <button
                onClick={() => setShowProfileModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-1.5"
              >
                <Settings size={14} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* LOADING SHIMMER */}
        {loading && categories.length === 0 && (
          <div className="w-full bg-stone-900 border border-stone-850 rounded-3xl p-12 text-center flex flex-col items-center">
            <RefreshCw size={36} className="text-red-500 animate-spin mb-4" />
            <h3 className="text-lg font-bold text-stone-200">Querying live data records...</h3>
          </div>
        )}

        {/* PROFILE VIEW */}
        {activeTab === 'profile' && !loading && (
          <div className="bg-stone-950 border border-stone-850 rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Settings size={20} className="text-amber-500" />
              Profile Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-2">
                  Email Address
                </label>
                <p className="bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-100 text-sm">
                  {email}
                </p>
                <p className="text-xs text-stone-500 mt-1 font-mono">Current logged-in email</p>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <Edit3 size={14} />
                Change Email / Password
              </button>
            </div>
          </div>
        )}

        {/* CATEGORIES TABLE VIEW */}
        {activeTab === 'categories' && !loading && (
          <div className="bg-stone-950 border border-stone-850 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-stone-850 bg-stone-900/60 text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                    <th className="p-4 sm:p-5">Icon</th>
                    <th className="p-4 sm:p-5">Category Name</th>
                    <th className="p-4 sm:p-5">Slug ID</th>
                    <th className="p-4 sm:p-5">Description</th>
                    <th className="p-4 sm:p-5 text-center">Order</th>
                    <th className="p-4 sm:p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-900 text-xs sm:text-sm text-stone-300">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-stone-900/35 transition-colors">
                      <td className="p-4 sm:p-5">
                        <span className="w-8 h-8 bg-stone-900 border border-stone-800 text-red-500 rounded-lg flex items-center justify-center font-bold">
                          {cat.iconName === 'Flame' && <Flame size={16} />}
                          {cat.iconName === 'Sparkles' && <Sparkles size={16} />}
                          {cat.iconName === 'GlassWater' && <GlassWater size={16} />}
                          {cat.iconName === 'Cookie' && <Cookie size={16} />}
                          {!['Flame','Sparkles','GlassWater','Cookie'].includes(cat.iconName) && cat.iconName}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 font-bold text-white">{cat.name}</td>
                      <td className="p-4 sm:p-5 font-mono text-red-400">{(cat as any).slug}</td>
                      <td className="p-4 sm:p-5 text-stone-450 max-w-xs truncate">{cat.description}</td>
                      <td className="p-4 sm:p-5 text-center font-mono font-bold text-amber-500">{(cat as any).displayOrder}</td>
                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditCategory(cat)}
                            className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg border border-stone-800 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg border border-red-900/30 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-500 font-mono">
                        No categories found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MENU ITEMS TABLE VIEW */}
        {activeTab === 'items' && !loading && (
          <div className="bg-stone-950 border border-stone-850 rounded-3xl overflow-hidden shadow-xl" id="admin-items-shelf">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-stone-850 bg-stone-900/60 text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                    <th className="p-4 sm:p-5">Thumb</th>
                    <th className="p-4 sm:p-5">Dish Title</th>
                    <th className="p-4 sm:p-5">Category</th>
                    <th className="p-4 sm:p-5">Price</th>
                    <th className="p-4 sm:p-5">Calories</th>
                    <th className="p-4 sm:p-5">Dietary</th>
                    <th className="p-4 sm:p-5 text-center">Status</th>
                    <th className="p-4 sm:p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-900 text-xs sm:text-sm text-stone-300">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-900/35 transition-colors">
                      <td className="p-4 sm:p-5">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120'}
                          alt={item.name}
                          className="w-12 h-10 object-cover rounded-lg border border-stone-800 bg-stone-900 shrink-0"
                        />
                      </td>
                      <td className="p-4 sm:p-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{item.name}</span>
                          <span className="text-[10px] font-mono text-stone-500">{(item as any).slug}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className="inline-block bg-stone-900 border border-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 font-bold text-red-500 font-mono">{item.price}</td>
                      <td className="p-4 sm:p-5 font-mono text-stone-400">{item.calories} cal</td>
                      <td className="p-4 sm:p-5">
                        <div className="flex flex-wrap gap-1 max-w-35">
                          {item.dietaryTags?.map(tag => (
                            <span key={tag} className="text-[9px] font-bold bg-stone-900 border border-stone-800 px-1 py-0.5 rounded text-amber-500">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-center">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                          (item as any).isAvailable !== false ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} title={(item as any).isAvailable !== false ? 'Available' : 'Unavailable'} />
                      </td>
                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditItem(item)}
                            className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg border border-stone-800 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg border border-red-900/30 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {menuItems.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-stone-500 font-mono">
                        No menu items found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* --- CATEGORY CREATION/EDIT MODAL --- */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-55 overflow-y-auto">
          <div className="w-full max-w-lg bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="sticky top-0 bg-stone-950 border-b border-stone-900 p-6 flex justify-between items-center z-10">
              <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                <Settings size={18} className="text-red-500" />
                <span>{isEditMode ? 'Modify Category' : 'Create Category'}</span>
              </h3>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Craft Burgers"
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!isEditMode) {
                      setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Unique Slug ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. burgers"
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors font-mono"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Category Icon
                </label>
                <select
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors cursor-pointer"
                  value={catIconName}
                  onChange={(e) => setCatIconName(e.target.value)}
                >
                  {CATEGORY_ICONS.map(ico => (
                    <option key={ico.name} value={ico.name}>{ico.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Display Ordering (Priority)
                </label>
                <input
                  type="number"
                  required
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors font-mono"
                  value={catDisplayOrder}
                  onChange={(e) => setCatDisplayOrder(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Brief Description
                </label>
                <textarea
                  rows={3}
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                  placeholder="Summarize this category to guide customers..."
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-stone-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-stone-900 border border-stone-850 hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {loading ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MENU ITEM CREATION/EDIT MODAL --- */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-55 overflow-y-auto">
          <div className="w-full max-w-2xl bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto" id="admin-item-wizard">
            
            <div className="sticky top-0 bg-stone-950 border-b border-stone-900 p-6 flex justify-between items-center z-10">
              <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                <FileText size={18} className="text-red-500" />
                <span>{isEditMode ? 'Modify Menu Item' : 'Insert Menu Item'}</span>
              </h3>
              <button 
                onClick={() => setShowItemModal(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-6">
              
              {/* SECTION 1: BASIC INFO */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-black text-red-500 uppercase tracking-widest border-b border-stone-900 pb-1">1. Primary Specifications</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Truffle Umami Royale"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                      value={itemName}
                      onChange={(e) => {
                        setItemName(e.target.value);
                        if (!isEditMode) {
                          setItemSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Unique Slug ID
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. b2"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors font-mono"
                      value={itemSlug}
                      onChange={(e) => setItemSlug(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Link Category
                    </label>
                    <select
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors cursor-pointer"
                      value={itemCategoryId}
                      onChange={(e) => setItemCategoryId(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Price Tag (string)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Br 480"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors font-mono"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Total Calories
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors font-mono"
                      value={itemCalories}
                      onChange={(e) => setItemCalories(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Mock Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      required
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors font-mono"
                      value={itemRating}
                      onChange={(e) => setItemRating(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Mock Reviews Count
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors font-mono"
                      value={itemReviewsCount}
                      onChange={(e) => setItemReviewsCount(Number(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center gap-2 md:pt-6">
                    <input
                      type="checkbox"
                      id="itemIsAvailableCheck"
                      className="w-4 h-4 accent-red-600 rounded bg-stone-900 border border-stone-800 cursor-pointer"
                      checked={itemIsAvailable}
                      onChange={(e) => setItemIsAvailable(e.target.checked)}
                    />
                    <label htmlFor="itemIsAvailableCheck" className="text-xs font-bold text-stone-300 uppercase cursor-pointer select-none">
                      Is Available Instore
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Photo URL (Unsplash or direct)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors font-mono"
                    value={itemImageUrl}
                    onChange={(e) => setItemImageUrl(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Short Catchy Summary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Double fire-grilled highland Angus beef"
                    className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                    value={itemShortDescription}
                    onChange={(e) => setItemShortDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe ingredients, tastes, cooking methods in detail..."
                    className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* SECTION 2: INGREDIENTS */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-black text-red-500 uppercase tracking-widest border-b border-stone-900 pb-1">2. Ingredients Sourcing</h4>
                
                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Retro-ingredients list (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Highland Beef, Brioche Bun, Cheese"
                    className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                  />
                </div>

                {/* Detailed Ingredients Builder */}
                <div className="bg-stone-900/40 border border-stone-900 p-4 rounded-2xl space-y-3">
                  <span className="block text-[10px] font-mono font-black text-stone-400 uppercase">Interactive Detailed Ingredients Origin Map</span>
                  
                  {detailedIngredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {detailedIngredients.map((ing, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 pl-2.5 pr-1 py-1 rounded-xl text-xs font-bold text-stone-300">
                          <span>{ing.name} ({ing.source || 'No origin'})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDetailIngredient(idx)}
                            className="text-stone-500 hover:text-red-400 p-0.5 rounded cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Ingredient Name (e.g. Local Cheddar)"
                      className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                      value={newDetailName}
                      onChange={(e) => setNewDetailName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Sourced Origin (e.g. Debre Birhan)"
                      className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                      value={newDetailSource}
                      onChange={(e) => setNewDetailSource(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <select
                        className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none flex-1 cursor-pointer"
                        value={newDetailIcon}
                        onChange={(e) => setNewDetailIcon(e.target.value)}
                      >
                        <option value="Patty">🥩 Meat Patty</option>
                        <option value="Bun">🍞 Bun</option>
                        <option value="Cheese">🧀 Cheese</option>
                        <option value="Flame">🔥 Spicy</option>
                        <option value="Sauce">🥫 Sauce</option>
                        <option value="Leaf">🥬 Herb/Leaf</option>
                        <option value="Potato">🥔 Potato</option>
                        <option value="Salt">🧂 Salt</option>
                        <option value="Nut">🥜 Nut</option>
                        <option value="Glass">🥛 Milk/Dairy</option>
                        <option value="Cookie">🍪 Cookie</option>
                        <option value="Star">✨ Star (General)</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddDetailIngredient}
                        className="px-3 bg-stone-800 hover:bg-stone-750 border border-stone-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: DIETARY & NUTRITION */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-black text-red-500 uppercase tracking-widest border-b border-stone-900 pb-1">3. Dietary Specifications & Nutrition</h4>
                
                {/* Dietary Tag Checkboxes */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-400 tracking-wider mb-2 uppercase">Dietary Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(DietaryType).map(tag => {
                      const isSelected = dietaryTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleDietaryTag(tag)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-600 border-red-650 text-white'
                              : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-850'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nutrition Inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider mb-1">Protein</label>
                    <input
                      type="text"
                      placeholder="48g"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none font-mono"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider mb-1">Carbs</label>
                    <input
                      type="text"
                      placeholder="38g"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none font-mono"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider mb-1">Fat</label>
                    <input
                      type="text"
                      placeholder="41g"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none font-mono"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider mb-1">Sodium (optional)</label>
                    <input
                      type="text"
                      placeholder="1150mg"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none font-mono"
                      value={sodium}
                      onChange={(e) => setSodium(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: CUSTOM CUSTOMIZER */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-black text-red-500 uppercase tracking-widest border-b border-stone-900 pb-1">4. Customizer Options</h4>
                
                {/* Options list */}
                <div className="bg-stone-900/40 border border-stone-900 p-4 rounded-2xl space-y-3">
                  <span className="block text-[10px] font-mono font-black text-stone-400 uppercase">Crave Craft Customizer Simulator Preset options</span>
                  
                  {customOptions.length > 0 && (
                    <div className="space-y-1.5">
                      {customOptions.map((opt, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-stone-900 border border-stone-800 px-3 py-2 rounded-xl text-xs">
                          <div>
                            <span className="font-bold text-white uppercase">{opt.name}: </span>
                            <span className="text-stone-400 font-mono">{opt.options.join(' • ')}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomOption(idx)}
                            className="text-stone-550 hover:text-red-400 p-0.5 rounded cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Option Name (e.g. Spiciness)"
                      className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                      value={newOptName}
                      onChange={(e) => setNewOptName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Values (comma-separated: Mild, Hot)"
                      className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none sm:col-span-2"
                      value={newOptValues}
                      onChange={(e) => setNewOptValues(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddCustomOption}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-750 border border-stone-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Add Customizer Option
                    </button>
                  </div>
                </div>
              </div>

              {/* SAVE CANCEL ACTION BUTTONS */}
              <div className="pt-4 border-t border-stone-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-stone-900 border border-stone-850 hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {loading ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
                  <span>Save Menu Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PROFILE UPDATE MODAL --- */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-55 overflow-y-auto">
          <div className="w-full max-w-lg bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="sticky top-0 bg-stone-950 border-b border-stone-900 p-6 flex justify-between items-center z-10">
              <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                <Settings size={18} className="text-amber-500" />
                <span>Update Profile</span>
              </h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Current Email
                </label>
                <p className="bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-stone-300 text-xs font-mono">
                  {email}
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                  New Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="Leave blank to keep current email"
                  className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                />
              </div>

              <div className="border-t border-stone-900 pt-4 mt-6">
                <h4 className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider mb-3">
                  Password Change (Optional)
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Current Password (for verification)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                      value={profileCurrentPassword}
                      onChange={(e) => setProfileCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                      New Password (Min 8 characters)
                    </label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep current password"
                      minLength={8}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                      value={profileNewPassword}
                      onChange={(e) => setProfileNewPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      minLength={8}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                      value={profileConfirmPassword}
                      onChange={(e) => setProfileConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-stone-900 border border-stone-850 hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {loading ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
