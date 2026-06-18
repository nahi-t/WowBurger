import React from 'react';
import { DietaryType } from '../types';
import { Check, Flame, Leaf, LeafyGreen, Shield, Award } from 'lucide-react';

interface FilterBarProps {
  selectedDietary: DietaryType[];
  onToggleDietary: (tag: DietaryType) => void;
  onClearFilters: () => void;
  itemsCounts: Record<DietaryType, number>;
}

// Icon mapper for dietary filter pills
const DietaryIcons: Record<DietaryType, React.ReactNode> = {
  [DietaryType.VEGETARIAN]: <Leaf size={14} className="text-emerald-500" />,
  [DietaryType.VEGAN]: <LeafyGreen size={14} className="text-green-500" />,
  [DietaryType.GLUTEN_FREE]: <Shield size={14} className="text-amber-500" />,
  [DietaryType.SPICY]: <Flame size={14} className="text-red-500" />,
  [DietaryType.SIGNATURE]: <Award size={14} className="text-purple-500" />,
};

export default function FilterBar({
  selectedDietary,
  onToggleDietary,
  onClearFilters,
  itemsCounts,
}: FilterBarProps) {
  const dietaryTypes = Object.values(DietaryType);

  return (
    <div className="w-full bg-stone-50/50 py-3.5 px-4 border-b border-stone-200/40" id="dietary-filter-bar">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Helper title */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-stone-500 uppercase tracking-widest font-semibold">
            Adjust Recipe Focus
          </span>
          {selectedDietary.length > 0 && (
            <button
              onClick={onClearFilters}
              className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline cursor-pointer"
            >
              Reset active ({selectedDietary.length})
            </button>
          )}
        </div>

        {/* Dietary options row */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4 md:mx-0 md:px-0">
          {dietaryTypes.map((tag) => {
            const isSelected = selectedDietary.includes(tag);
            const count = itemsCounts[tag] || 0;

            return (
              <button
                key={tag}
                onClick={() => onToggleDietary(tag)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                  isSelected
                    ? 'bg-stone-900 border-stone-905 text-white shadow-sm'
                    : 'bg-white border-stone-200 text-stone-650 hover:bg-stone-100 hover:border-stone-300'
                }`}
                id={`diet-pill-${tag}`}
              >
                {/* Visual feedback mark */}
                {isSelected ? (
                  <span className="p-0.5 rounded-full bg-red-600 text-white leading-none">
                    <Check size={10} strokeWidth={3} />
                  </span>
                ) : (
                  DietaryIcons[tag]
                )}

                <span>{tag}</span>

                {/* Counter */}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}