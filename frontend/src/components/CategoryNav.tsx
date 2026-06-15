import React from 'react';
import { Flame, Sparkles, GlassWater, Cookie } from 'lucide-react';
import { MenuCategory } from '../types';

interface CategoryNavProps {
  categories: MenuCategory[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

const IconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Flame: Flame,
  Sparkles: Sparkles,
  GlassWater: GlassWater,
  Cookie: Cookie,
};

export default function CategoryNav({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryNavProps) {
  return (
    <div className="w-full bg-stone-50 py-4 px-4 sticky top-0 z-20 border-b border-stone-200/60 shadow-xs" id="category-nav-sticky">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
            Crave Categories
          </p>
          <span className="text-xs text-stone-400 hidden sm:inline-block font-sans">
            ← Swipable & Fast Filter →
          </span>
        </div>

        {/* Horizontal Slider */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-1 -mx-4 px-4 sm:mx-0 sm:px-0" id="category-scroller">
          {categories.map((cat) => {
            const IconComponent = IconMap[cat.iconName] || Sparkles;
            const isActive = cat.id === activeCategoryId || (cat as any).slug === activeCategoryId;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory((cat as any).slug || cat.id)}
                className={`group flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-300 whitespace-nowrap scroll-ml-6 ${
                  isActive
                    ? 'bg-red-600 border-red-600 text-stone-50 shadow-md shadow-red-900/10 scale-102'
                    : 'bg-white border-stone-200 text-stone-750 hover:bg-stone-100 hover:border-stone-300'
                }`}
                id={`cat-pill-${(cat as any).slug || cat.id}`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors duration-300 ${
                    isActive ? 'bg-white/20 text-stone-100' : 'bg-stone-100 text-red-500 group-hover:bg-red-50'
                  }`}
                >
                  <IconComponent size={18} />
                </div>
                
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-bold tracking-tight">{cat.name}</span>
                  <span className={`text-[10px] font-normal leading-none ${isActive ? 'text-stone-300' : 'text-stone-400 group-hover:text-stone-500'}`}>
                    {(cat.id === 'burgers' || (cat as any).slug === 'burgers') ? 'Fire-grilled' : (cat.id === 'sides' || (cat as any).slug === 'sides') ? 'Crispy fry' : (cat.id === 'drinks' || (cat as any).slug === 'drinks') ? 'Hand-spun' : 'Baked warm'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
