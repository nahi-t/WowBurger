import React from 'react';
import { Star, Flame, Leaf, Shield, Award, Heart, Sparkles } from 'lucide-react';
import { MenuItem, DietaryType } from '../types';

interface MenuCardProps {
  key?: string;
  item: MenuItem;
  onSelectItem: (item: MenuItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const TagColors: Record<DietaryType, string> = {
  [DietaryType.VEGETARIAN]: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  [DietaryType.VEGAN]: 'bg-green-50 text-green-700 border-green-100',
  [DietaryType.GLUTEN_FREE]: 'bg-amber-50 text-amber-700 border-amber-100',
  [DietaryType.SPICY]: 'bg-red-50 text-red-700 border-red-100',
  [DietaryType.SIGNATURE]: 'bg-purple-50 text-purple-700 border-purple-100',
};

const TagIcons: Record<DietaryType, React.ReactNode> = {
  [DietaryType.VEGETARIAN]: <Leaf size={12} className="text-emerald-500 inline-block" />,
  [DietaryType.VEGAN]: <Leaf size={12} className="text-green-500 inline-block" />,
  [DietaryType.GLUTEN_FREE]: <Shield size={12} className="text-amber-500 inline-block" />,
  [DietaryType.SPICY]: <Flame size={12} className="text-red-500 inline-block animate-pulse" />,
  [DietaryType.SIGNATURE]: <Award size={12} className="text-purple-500 inline-block" />,
};

export default function MenuCard({
  item,
  onSelectItem,
  isFavorite,
  onToggleFavorite,
}: MenuCardProps) {
  return (
    <div
      onClick={() => onSelectItem(item)}
      className="group bg-white rounded-3xl border border-stone-200/50 overflow-hidden shadow-xs hover:shadow-xl hover:border-red-500/10 cursor-pointer transform hover:-translate-y-1.5 transition-all duration-400 flex flex-col h-full relative"
      id={`item-card-${item.id}`}
    >
      {/* Visual Image container with aspect-ratio matches our image-generation skill 4:3 template choice */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Ambient top dark overlay for the controls */}
        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        {/* Heart Favorite Trigger */}
        <button
          onClick={(e) => onToggleFavorite(item.id, e)}
          className="absolute right-3.5 top-3.5 p-2.5 rounded-full bg-white/95 backdrop-blur-xs shadow-md border border-stone-100 text-stone-700 hover:text-red-500 hover:scale-110 active:scale-90 transition-all duration-300 pointer-events-auto z-10"
          title={isFavorite ? 'Remove from Favs' : 'Add to Favs'}
          aria-label="Toggle Favorite"
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500 scale-105' : 'text-stone-500'}`}
          />
        </button>

        {/* Rating Overlay */}
        <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-lg text-white font-mono text-xs font-semibold select-none">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span>{item.rating.toFixed(1)}</span>
        </span>

        {/* Dietary overlays in visual layout */}
        <div className="absolute left-2 bottom-2 md:left-3.5 md:bottom-3.5 flex flex-wrap gap-1 pointer-events-none">
          {item.dietaryTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 md:gap-1 bg-stone-900/90 backdrop-blur-xs border border-white/10 px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg text-white font-sans text-[8px] md:text-[10px] font-bold tracking-wide uppercase shadow-sm"
            >
              {TagIcons[tag]}
              <span className="hidden xs:inline">{tag}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Culinary detail description */}
      <div className="p-3 md:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-col xs:flex-row justify-between items-start gap-1 mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectItem(item);
              }}
              className="text-left font-black text-stone-900 text-sm md:text-lg group-hover:text-red-600 group-hover:underline decoration-red-500/80 transition-all duration-300 leading-tight focus:outline-none focus:ring-1 focus:ring-red-500 rounded-sm cursor-pointer"
              title="Click to view full ingredients"
            >
              {item.name}
            </button>
            <span className="text-sm md:text-xl font-black text-red-600 font-sans tracking-tight shrink-0">
              {item.price}
            </span>
          </div>

          <p className="text-stone-500 font-sans text-[11px] md:text-sm line-clamp-2 leading-tight md:leading-relaxed mb-3">
            {item.description}
          </p>

          {/* Quick Peek of main visual ingredients */}
          <div className="mb-3">
            <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-stone-400 block mb-1">
              Core Stack
            </span>
            <div className="flex flex-wrap gap-0.5 md:gap-1">
              {item.ingredients.slice(0, 3).map((ing, idx) => (
                <span key={idx} className="bg-stone-100 text-stone-600 text-[9px] md:text-[10px] font-medium px-1.5 py-0.5 rounded-sm md:rounded-md">
                  {ing}
                </span>
              ))}
              {item.ingredients.length > 3 && (
                <span className="text-[9px] font-mono text-stone-400 py-0.5 px-0.5 font-bold">
                  +{item.ingredients.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Custom nutrition badge & Action click trigger footer */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] md:text-[11px] font-mono text-stone-400">
          <span className="flex items-center gap-0.5">
            <Sparkles size={10} className="text-amber-500 animate-pulse" />
            <span>{item.calories} cal</span>
          </span>
          <span className="text-red-500 font-bold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-0.5">
            Details <span className="font-sans">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}
