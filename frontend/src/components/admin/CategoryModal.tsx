import React, { useEffect, useState } from 'react';
import { X, Settings, Check, RefreshCw } from 'lucide-react';
import { MenuCategory } from '../../types';

const CATEGORY_ICONS = [
  { name: 'Flame', label: 'Flame (Spicy/Grilled)' },
  { name: 'Sparkles', label: 'Sparkles (Sides/Specials)' },
  { name: 'GlassWater', label: 'Glass (Drinks/Elixirs)' },
  { name: 'Cookie', label: 'Cookie (Desserts/Sweets)' },
];

interface CategoryModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  editingCategory: MenuCategory | null;
  totalCategories: number;
  loading: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    slug: string;
    description: string;
    iconName: string;
    displayOrder: number;
  }) => void;
}

export default function CategoryModal({
  isOpen,
  isEditMode,
  editingCategory,
  totalCategories,
  loading,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Flame');
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    if (isEditMode && editingCategory) {
      setName(editingCategory.name);
      setSlug((editingCategory as any).slug || '');
      setDescription(editingCategory.description || '');
      setIconName(editingCategory.iconName || 'Flame');
      setDisplayOrder((editingCategory as any).displayOrder || 0);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setIconName('Flame');
      setDisplayOrder(totalCategories);
    }
  }, [isEditMode, editingCategory, isOpen, totalCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      alert('Name and Slug are required.');
      return;
    }
    onSave({
      name,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      description,
      iconName,
      displayOrder: Number(displayOrder),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-55 overflow-y-auto">
      <div className="w-full max-w-lg bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-stone-950 border-b border-stone-900 p-6 flex justify-between items-center z-10">
          <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
            <Settings size={18} className="text-red-500" />
            <span>{isEditMode ? 'Modify Category' : 'Create Category'}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-900 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Craft Burgers"
              className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!isEditMode) {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
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
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">
              Category Icon
            </label>
            <select
              className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors cursor-pointer"
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
            >
              {CATEGORY_ICONS.map((ico) => (
                <option key={ico.name} value={ico.name}>
                  {ico.label}
                </option>
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
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-stone-900 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-stone-900 border border-stone-850 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
              <span>Save Category</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
