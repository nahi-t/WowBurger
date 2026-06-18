import React from 'react';
import { Flame, Sparkles, GlassWater, Cookie, Pizza, Coffee, Apple } from 'lucide-react';
import { MenuCategory } from '../types';

interface CategoryNavProps {
  categories: MenuCategory[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

const IconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Flame,
  Sparkles,
  GlassWater,
  Cookie,
  Pizza,
  Coffee,
  Apple
};

export default function CategoryNav({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryNavProps) {
  return (
    <div 
      /* - Removed 'hidden md:block' so it shows on phones!
        - On mobile, it sticks to top-0 (or below your mobile header). 
        - High backdrop-blur-xl creates a beautiful frosted glass blur when scrolling.
      */
      className="w-full bg-white/70 backdrop-blur-xl py-3 md:py-4 px-4 sticky top-0 md:top-[4px] z-20 border-b border-stone-200/60 shadow-xs transition-all duration-200" 
      id="category-nav-sticky"
    >
      <div className="max-w-7xl mx-auto">
        {/* Horizontal scroll wrapper optimized for mobile thumbs */}
        <div 
          className="flex gap-2.5 md:gap-3 overflow-x-auto scroll-smooth pb-1 -mx-4 px-4 md:mx-0 md:px-0" 
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          id="category-scroller"
        >
          {categories.map((cat) => {
            const IconComponent = IconMap[cat.iconName || 'Sparkles'] || Sparkles;
            const isActive = cat.id === activeCategoryId;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex items-center gap-2 md:gap-3 px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl border text-xs md:text-sm transition-all duration-300 whitespace-nowrap outline-hidden cursor-pointer select-none ${
                  isActive
                    ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-600/10'
                    : 'bg-white/50 border-stone-200/80 text-stone-800 hover:bg-stone-100 active:scale-95'
                }`}
              >
                {/* Icon Wrapper */}
                <div
                  className={`p-1 md:p-1.5 rounded-lg md:rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-red-500'
                  }`}
                >
                  <IconComponent size={14} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
                </div>
                
                {/* Category Name */}
                <div className="flex flex-col items-start text-left">
                  <span className={`font-bold tracking-tight text-xs md:text-sm ${isActive ? 'text-white' : 'text-stone-900'}`}>
                    {cat.name}
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