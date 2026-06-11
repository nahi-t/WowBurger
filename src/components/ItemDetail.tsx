import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, Flame, Shield, Award, Sparkles, Check, Info, HelpCircle } from 'lucide-react';
import { MenuItem, DietaryType } from '../types';

interface ItemDetailProps {
  item: MenuItem;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const FeatureIcons: Record<string, string> = {
  Patty: '🥩',
  Bun: '🍞',
  Cheese: '🧀',
  Flame: '🔥',
  Sauce: '🥫',
  Leaf: '🥬',
  Potato: '🥔',
  Salt: '🧂',
  Nut: '🥜',
  Glass: '🥛',
  Star: '✨',
  Ginger: '🪴',
  Flower: '🍯',
  Slice: '🍋',
  Cookie: '🍪',
  Cloud: '☁️',
  Grain: '🌾',
  Bowl: '🥣',
  Drumstick: '🍗',
  Pickle: '🥒',
};

export default function ItemDetail({
  item,
  onBack,
  isFavorite,
  onToggleFavorite,
}: ItemDetailProps) {
  // Simulator State: allow customers to toggle preferences to craft their dream version in a mock view
  const [selectedExtraOptions, setSelectedExtraOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    item.customizableOptions?.forEach((opt) => {
      initial[opt.name] = opt.options[0];
    });
    return initial;
  });

  // Keep track of checklisted ingredients to let user "unselect" some ingredients to exclude
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedExtraOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const toggleExcludeIngredient = (ingName: string) => {
    setExcludedIngredients((prev) =>
      prev.includes(ingName)
        ? prev.filter((name) => name !== ingName)
        : [...prev, ingName]
    );
  };

  return (
    <div className="w-full min-h-screen bg-stone-50 pb-20 relative font-sans" id="item-detail-view-screen">
      {/* Upper Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/50 px-4 py-3.5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-bold text-stone-700 hover:text-red-500 transition-colors duration-300 bg-stone-100 py-2 px-3.5 rounded-xl cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Menu</span>
        </button>

        <span className="font-mono text-xs font-bold text-stone-400 tracking-wider">
          WOW DETAILED INSIGHT
        </span>

        <button
          onClick={(e) => onToggleFavorite(item.id, e)}
          className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors duration-200"
          aria-label="Toggle favorite status"
        >
          <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-500'} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Card Left: High quality photo area */}
          <div>
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200/40 bg-white">
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-4/3 object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Rating float overlay */}
              <div className="absolute right-4 bottom-4 bg-stone-900/90 [box-shadow:0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-xs border border-white/10 text-white rounded-2xl p-3.5 flex flex-col items-center">
                <span className="text-xl font-bold font-mono tracking-tight text-amber-400">
                  ★ {item.rating.toFixed(1)}
                </span>
                <span className="text-[9px] font-mono text-stone-400 block whitespace-nowrap mt-0.5">
                  {item.reviewsCount} verified reviews
                </span>
              </div>
            </div>

            {/* Nutrition facts block */}
            <div className="mt-6 bg-white rounded-3xl p-6 border border-stone-200/40 shadow-sm" id="nutrition-facts-gauge">
              <h3 className="font-mono text-xs font-black uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-1.5">
                <Info size={14} className="text-red-500" />
                <span>Nutrition Breakdown ({item.calories} Calories)</span>
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-stone-50 p-3 rounded-2xl text-center border border-stone-100">
                  <span className="text-xs text-stone-400 font-mono">PROTEIN</span>
                  <p className="text-lg font-black text-rose-600 tracking-tight mt-1">{item.nutrition.protein}</p>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-2xl text-center border border-stone-100">
                  <span className="text-xs text-stone-400 font-mono">CARBS</span>
                  <p className="text-lg font-black text-amber-500 tracking-tight mt-1">{item.nutrition.carbs}</p>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-2xl text-center border border-stone-100">
                  <span className="text-xs text-stone-400 font-mono">FAT</span>
                  <p className="text-lg font-black text-stone-850 tracking-tight mt-1">{item.nutrition.fat}</p>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-stone-800 h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>

              {item.nutrition.sodium && (
                <div className="mt-4 flex justify-between items-center text-xs font-mono text-stone-500 bg-stone-50 px-4 py-2 rounded-xl">
                  <span>Sodium Count:</span>
                  <span className="font-bold text-stone-800">{item.nutrition.sodium}</span>
                </div>
              )}
            </div>

            {/* Allergen Advisories */}
            <div className="mt-4 bg-amber-500/10 border border-amber-500/20 text-amber-900 rounded-2xl p-4 text-xs flex gap-3">
              <Shield size={18} className="text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">Dietary & Allergen Warning</p>
                <p className="text-amber-800 mt-0.5 leading-relaxed">
                  Produced in a facility that handles sesame, wheat, milk, and gluten. Please inform our service stewards if you have any severe dietary thresholds.
                </p>
              </div>
            </div>
          </div>

          {/* Card Right: Interactive detailed specifications, ingredient sources, and configuration simulator */}
          <div className="flex flex-col gap-6">
            <div>
              {/* Category tag */}
              <span className="inline-block bg-red-100 text-red-700 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2">
                {item.category.toUpperCase()}
              </span>

              {/* Title & Price */}
              <div className="flex justify-between items-start gap-3">
                <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
                  {item.name}
                </h2>
                <span className="text-2xl md:text-3xl font-black text-red-600 bg-white border border-stone-200/50 px-4 py-1.5 rounded-2xl leading-none">
                  {item.price}
                </span>
              </div>

              {/* Tag badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {item.dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-white border border-stone-200/60 text-stone-700 font-sans text-xs font-bold px-3 py-1 rounded-lg shadow-2xs"
                  >
                    <Sparkles size={11} className="text-amber-500" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              <p className="mt-4 text-stone-600 text-sm md:text-base leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Interactive Customization Simulator */}
            {item.customizableOptions && item.customizableOptions.length > 0 && (
              <div className="bg-white border border-stone-200/50 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-red-500 p-1.5 rounded-lg text-white">
                    <Sparkles size={14} className="animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-stone-900 leading-none">Crave Craft Simulator</h3>
                    <p className="text-[10px] text-stone-450 font-mono mt-0.5 uppercase">Interactive Mock Customizer</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {item.customizableOptions.map((opt) => (
                    <div key={opt.name} className="flex flex-col gap-1.5">
                      <span className="text-xs font-mono font-bold text-stone-500 uppercase">
                        {opt.name}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {opt.options.map((val) => {
                          const isSelected = selectedExtraOptions[opt.name] === val;
                          return (
                            <button
                              key={val}
                              onClick={() => handleOptionChange(opt.name, val)}
                              className={`px-3 py-2 text-xs rounded-xl border font-semibold transition-all duration-200 ${
                                isSelected
                                  ? 'bg-red-600 border-red-600 text-white shadow-xs'
                                  : 'bg-stone-50 border-stone-200 text-stone-650 hover:bg-stone-100 hover:border-stone-300'
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100 bg-stone-50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-450 font-bold uppercase">Recipe adjustments applied:</span>
                    <span className="text-green-600 font-extrabold">Ready to Order Instore</span>
                  </div>
                </div>
              </div>
            )}

            {/* Chef Sourced Ingredients Map */}
            <div className="bg-white border border-stone-200/50 rounded-3xl p-6 shadow-sm" id="sourcing-ingredients-shelf">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-black text-stone-900 leading-none">Organic Sourcing Map</h3>
                  <p className="text-[10px] text-stone-450 font-mono mt-0.5 uppercase">Authentic ingredient transparency</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-black tracking-wider uppercase px-2.5 py-1 rounded-md">
                  100% Traceable
                </span>
              </div>

              <p className="text-stone-500 text-xs mb-4 leading-relaxed">
                We believe in ethical culinary transparency. Tap the checkmark icon to request excluding an ingredient from your in-store preparation recipe:
              </p>

              <div className="space-y-3.5">
                {item.detailedIngredients.map((ing) => {
                  const isExcluded = excludedIngredients.includes(ing.name);
                  const itemEmoji = FeatureIcons[ing.icon || 'Star'] || '✨';

                  return (
                    <div
                      key={ing.name}
                      onClick={() => toggleExcludeIngredient(ing.name)}
                      className={`group/ing flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        isExcluded
                          ? 'bg-rose-50/50 border-rose-100 opacity-60'
                          : 'bg-stone-50 border-stone-100 hover:bg-stone-100 hover:border-stone-200/80 shadow-xs'
                      }`}
                      id={`ing-item-${ing.name.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl inline-block transition-transform duration-300 group-hover/ing:scale-115">
                          {itemEmoji}
                        </span>
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold leading-tight ${isExcluded ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                            {ing.name}
                          </span>
                          {ing.source && (
                            <span className="text-[10px] text-stone-450 font-medium font-sans mt-0.5">
                              📍 Origin: {ing.source}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Exclude Checkbox */}
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-300 ${
                        isExcluded
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'bg-white border-stone-200 text-transparent group-hover/ing:border-stone-300'
                      }`}>
                        {isExcluded ? (
                          <span className="text-[10px] font-bold font-mono">Excluded</span>
                        ) : (
                          <Check size={12} strokeWidth={3} className="text-white group-hover/ing:text-stone-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {excludedIngredients.length > 0 && (
                <div className="mt-4 bg-red-100/50 border border-red-200/50 p-3 rounded-xl text-red-800 text-xs font-medium">
                  📝 Customized Note: Custom request to exclude <strong className="underline">{excludedIngredients.join(', ')}</strong> is marked for in-store checkout display.
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Brand visual callout footer */}
        <div className="mt-12 bg-stone-900 text-stone-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden" id="item-underlay-banner">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.1),transparent_50%)]" />
          
          <div className="relative z-10">
            <h4 className="text-lg md:text-xl font-bold tracking-tight">Visit us to order, taste the Wow factor</h4>
            <p className="text-stone-400 text-xs md:text-sm mt-1 max-w-lg leading-relaxed">
              Scan this menu QR Code at any Wow Burger order terminal to immediately load your customized craft presets of ingredients and options. See you there!
            </p>
          </div>

          <div className="shrink-0 flex gap-3 relative z-10 w-full sm:w-auto">
            <button
              onClick={onBack}
              className="w-full sm:w-auto text-center px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-xl tracking-wider transition-colors duration-200 shadow-lg shadow-red-900/30 font-sans"
            >
              Explore remaining menu
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
