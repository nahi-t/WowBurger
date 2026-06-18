import React, { useEffect, useState } from 'react';
import { X, FileText, Check, RefreshCw, PlusCircle, MinusCircle } from 'lucide-react';
import { MenuItem, MenuCategory, IngredientInfo, DietaryType } from '../../types';

interface MenuItemModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  editingItem: MenuItem | null;
  categories: MenuCategory[];
  loading: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function MenuItemModal({
  isOpen,
  isEditMode,
  editingItem,
  categories,
  loading,
  onClose,
  onSave,
}: MenuItemModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('Br 0');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [calories, setCalories] = useState<number>(0);
  const [rating, setRating] = useState<number>(5.0);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState(true);

  // Ingredients
  const [ingredientsText, setIngredientsText] = useState('');
  const [detailedIngredients, setDetailedIngredients] = useState<IngredientInfo[]>([]);
  const [newDetailName, setNewDetailName] = useState('');
  const [newDetailSource, setNewDetailSource] = useState('');
  const [newDetailIcon, setNewDetailIcon] = useState('Star');

  // Dietary
  const [dietaryTags, setDietaryTags] = useState<DietaryType[]>([]);

  // Nutrition
  const [protein, setProtein] = useState('0g');
  const [carbs, setCarbs] = useState('0g');
  const [fat, setFat] = useState('0g');
  const [sodium, setSodium] = useState('');

  // Custom Options
  const [customOptions, setCustomOptions] = useState<Array<{ name: string; options: string[] }>>([]);
  const [newOptName, setNewOptName] = useState('');
  const [newOptValues, setNewOptValues] = useState('');

  useEffect(() => {
    if (isEditMode && editingItem) {
      setName(editingItem.name);
      setSlug((editingItem as any).slug || '');
      setPrice(editingItem.price || '');
      setShortDescription((editingItem as any).shortDescription || '');
      setDescription(editingItem.description || '');
      setImageUrl(editingItem.image || '');
      setCalories(editingItem.calories || 0);
      setRating(editingItem.rating || 5.0);
      setReviewsCount(editingItem.reviewsCount || 0);
      setIsAvailable((editingItem as any).isAvailable !== false);

      const matchedCat = categories.find((c) => c.id === (editingItem as any).categoryId);
      setCategoryId(matchedCat ? matchedCat.id : '');

      setIngredientsText(editingItem.ingredients?.join(', ') || '');
      setDetailedIngredients(editingItem.detailedIngredients || []);
      setDietaryTags(editingItem.dietaryTags || []);
      setProtein(editingItem.nutrition?.protein || '0g');
      setCarbs(editingItem.nutrition?.carbs || '0g');
      setFat(editingItem.nutrition?.fat || '0g');
      setSodium(editingItem.nutrition?.sodium || '');
      setCustomOptions(editingItem.customizableOptions || []);
    } else {
      // Reset form
      setName('');
      setSlug('');
      setCategoryId(categories[0]?.id || '');
      setPrice('Br 250');
      setDescription('');
      setShortDescription('');
      setImageUrl('');
      setCalories(500);
      setRating(5.0);
      setReviewsCount(0);
      setIsAvailable(true);

      setIngredientsText('');
      setDetailedIngredients([]);
      setDietaryTags([]);
      setProtein('15g');
      setCarbs('45g');
      setFat('12g');
      setSodium('');
      setCustomOptions([]);
    }
  }, [isEditMode, editingItem, isOpen, categories]);

  const handleAddDetailIngredient = () => {
    if (!newDetailName) return;
    setDetailedIngredients((prev) => [...prev, { name: newDetailName, source: newDetailSource, icon: newDetailIcon }]);
    setNewDetailName('');
    setNewDetailSource('');
    setNewDetailIcon('Star');
  };

  const handleRemoveDetailIngredient = (index: number) => {
    setDetailedIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCustomOption = () => {
    if (!newOptName || !newOptValues) return;
    const vals = newOptValues.split(',').map((s) => s.trim()).filter(Boolean);
    if (vals.length === 0) return;

    setCustomOptions((prev) => [...prev, { name: newOptName, options: vals }]);
    setNewOptName('');
    setNewOptValues('');
  };

  const handleRemoveCustomOption = (index: number) => {
    setCustomOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleDietaryTag = (tag: DietaryType) => {
    setDietaryTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !price) {
      alert('Name, Category, and Price are required.');
      return;
    }

    const ingredients = ingredientsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name,
      slug: slug ? slug.toLowerCase().replace(/\s+/g, '-') : name.toLowerCase().replace(/\s+/g, '-'),
      categoryId,
      price,
      shortDescription: shortDescription || description.substring(0, 100),
      description,
      imageUrl,
      isAvailable,
      ingredients,
      detailedIngredients,
      calories: Number(calories),
      dietaryTags,
      rating: Number(rating),
      reviewsCount: Number(reviewsCount),
      nutrition: {
        protein,
        carbs,
        fat,
        ...(sodium ? { sodium } : {}),
      },
      customizableOptions: customOptions,
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-55 overflow-y-auto">
      <div className="w-full max-w-2xl bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto" id="admin-item-wizard">
        <div className="sticky top-0 bg-stone-950 border-b border-stone-900 p-6 flex justify-between items-center z-10">
          <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
            <FileText size={18} className="text-red-500" />
            <span>{isEditMode ? 'Modify Menu Item' : 'Insert Menu Item'}</span>
          </h3>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-900 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* SECTION 1: BASIC INFO */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-black text-red-500 uppercase tracking-widest border-b border-stone-900 pb-1">
              1. Primary Specifications
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mega Fire Burger"
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!isEditMode) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Slug URL ID</label>
                <input
                  type="text"
                  placeholder="e.g. mega-fire-burger"
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors font-mono"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  required
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors cursor-pointer"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Price</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Br 450"
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Short Catchy Summary</label>
              <input
                type="text"
                placeholder="e.g. Double fire-grilled highland Angus beef"
                className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Full Description</label>
              <textarea
                rows={3}
                required
                placeholder="Describe ingredients, tastes, cooking methods in detail..."
                className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none transition-colors"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>

          {/* SECTION 2: NUTRITIONAL INFO */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-black text-red-500 uppercase tracking-widest border-b border-stone-900 pb-1">
              2. Nutritional Information
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase mb-1">Calories</label>
                <input
                  type="number"
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase mb-1">Protein</label>
                <input
                  type="text"
                  placeholder="15g"
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase mb-1">Carbs</label>
                <input
                  type="text"
                  placeholder="45g"
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase mb-1">Fat</label>
                <input
                  type="text"
                  placeholder="12g"
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase mb-1">Sodium (Optional)</label>
              <input
                type="text"
                placeholder="800mg"
                className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                value={sodium}
                onChange={(e) => setSodium(e.target.value)}
              />
            </div>
          </div>

          {/* SECTION 3: ATTRIBUTES */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-black text-red-500 uppercase tracking-widest border-b border-stone-900 pb-1">
              3. Dietary Tags & Ratings
            </h4>

            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase mb-2">Dietary Categories</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['Vegan', 'Vegetarian', 'GlutenFree', 'Spicy'] as DietaryType[]).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleDietaryTag(tag)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      dietaryTags.includes(tag)
                        ? 'bg-amber-600 border-amber-500 text-white'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-amber-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase mb-1">Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase mb-1">Review Count</label>
                <input
                  type="number"
                  className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                  value={reviewsCount}
                  onChange={(e) => setReviewsCount(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-600 accent-red-600"
                />
                <span>Available for Order</span>
              </label>
            </div>
          </div>

          {/* SECTION 4: INGREDIENTS */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-black text-red-500 uppercase tracking-widest border-b border-stone-900 pb-1">
              4. Ingredients
            </h4>

            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-400 uppercase mb-1">Basic Ingredients (Comma Separated)</label>
              <input
                type="text"
                placeholder="Beef, Bun, Cheese, Lettuce"
                className="w-full bg-stone-900 border border-stone-800 focus:border-red-500 rounded-xl px-4 py-2.5 text-stone-100 text-xs focus:outline-none"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
              />
            </div>

            {/* Detailed Ingredients */}
            <div className="bg-stone-900/40 border border-stone-900 p-4 rounded-2xl space-y-3">
              <span className="block text-[10px] font-mono font-black text-stone-400 uppercase">Detailed Ingredient Origins</span>

              {detailedIngredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {detailedIngredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 pl-2.5 pr-1 py-1 rounded-xl text-xs font-bold text-stone-300">
                      <span>
                        {ing.name} ({ing.source || 'No origin'})
                      </span>
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
                  placeholder="Ingredient Name"
                  className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                  value={newDetailName}
                  onChange={(e) => setNewDetailName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Origin/Source"
                  className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                  value={newDetailSource}
                  onChange={(e) => setNewDetailSource(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddDetailIngredient}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-3 py-2 text-xs font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle size={12} />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 5: CUSTOMIZATION */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-black text-red-500 uppercase tracking-widest border-b border-stone-900 pb-1">
              5. Customizable Options
            </h4>

            {customOptions.length > 0 && (
              <div className="space-y-2">
                {customOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-stone-900 border border-stone-800 p-3 rounded-xl">
                    <div className="flex-1">
                      <span className="text-xs font-bold text-white">{opt.name}:</span>
                      <span className="text-[10px] text-stone-400 ml-2">{opt.options.join(', ')}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomOption(idx)}
                      className="text-red-400 hover:text-red-500 cursor-pointer"
                    >
                      <MinusCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Option Name (e.g. Size)"
                className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                value={newOptName}
                onChange={(e) => setNewOptName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Values (comma separated)"
                className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none"
                value={newOptValues}
                onChange={(e) => setNewOptValues(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddCustomOption}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-3 py-2 text-xs font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlusCircle size={12} />
                Add Option
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTONS */}
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
              <span>{isEditMode ? 'Update Item' : 'Create Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
