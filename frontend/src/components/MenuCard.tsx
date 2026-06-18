import React from 'react';
import { Star, Flame, Leaf, Shield, Award, Heart, Sparkles } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuCardProps {
  key?: string;
  item: MenuItem;
  onSelectItem: (item: MenuItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const getTagIcon = (tag: string) => {
  const t = tag.toLowerCase();
  if (t.includes('vegetarian')) return <Leaf size={10} className="text-emerald-500" />;
  if (t.includes('vegan')) return <Leaf size={10} className="text-green-500" />;
  if (t.includes('gluten')) return <Shield size={10} className="text-amber-500" />;
  if (t.includes('spicy')) return <Flame size={10} className="text-red-500 animate-pulse" />;
  return <Award size={10} className="text-purple-500" />;
};

export default function MenuCard({
  item,
  onSelectItem,
  isFavorite,
  onToggleFavorite,
}: MenuCardProps) {
  
  const ratingValue = typeof item.rating === 'number' ? item.rating : 5.0;

  return (
    <div
      onClick={() => onSelectItem(item)}
      className="group bg-white rounded-2xl md:rounded-3xl border border-stone-200/50 overflow-hidden shadow-xs hover:shadow-xl hover:border-red-500/10 cursor-pointer transform md:hover:-translate-y-1.5 transition-all duration-400 flex flex-col h-full relative"
    >
      {/* Top Image Box (Aspect ratio keeps it vertical everywhere) */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(item.id, e)}
          className="absolute right-2 top-2 p-1.5 md:p-2.5 rounded-full bg-white/95 backdrop-blur-xs shadow-md border border-stone-100 text-stone-700 hover:text-red-500 hover:scale-110 active:scale-90 transition-all duration-300 pointer-events-auto z-10"
        >
          <Heart
            size={13}
            className={`transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500 scale-105' : 'text-stone-500'}`}
          />
        </button>

        {/* Rating Badge */}
        <span className="absolute left-2 top-2 inline-flex items-center gap-0.5 bg-black/70 backdrop-blur-xs px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-md text-white font-mono text-[9px] md:text-xs font-semibold select-none">
          <Star size={9} className="fill-amber-400 text-amber-400" />
          <span>{ratingValue.toFixed(1)}</span>
        </span>

        {/* Dietary Tags (Hidden on mobile grid to prevent layout crowding) */}
        <div className="hidden md:flex absolute left-3.5 bottom-3.5 flex-wrap gap-1 pointer-events-none">
          {item.dietaryTags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-stone-900/90 backdrop-blur-xs border border-white/10 px-2 py-1 rounded-lg text-white font-sans text-[10px] font-bold tracking-wide uppercase shadow-sm"
            >
              {getTagIcon(tag)}
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Content Box */}
      <div className="p-2.5 md:p-5 flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Title and Price row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-0.5 mb-1">
            <h3 className="font-bold md:font-black text-stone-900 text-xs md:text-lg group-hover:text-red-600 transition-colors truncate w-full">
              {item.name}
            </h3>
            <span className="text-xs md:text-xl font-black text-red-600 shrink-0">
              {item.price}
            </span>
          </div>

          <p className="text-stone-500 text-[10px] md:text-sm line-clamp-2 mb-2">
            {item.description}
          </p>

          {/* Core Stack (Desktop-only to optimize grid card space) */}
          <div className="hidden md:block mb-3">
            <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-stone-400 block mb-1">
              Core Stack
            </span>
            <div className="flex flex-wrap gap-1">
              {item.ingredients?.slice(0, 3).map((ing, idx) => (
                <span key={idx} className="bg-stone-100 text-stone-600 text-[10px] font-medium px-2 py-0.5 rounded-md">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info row */}
        <div className="pt-1.5 md:pt-2 border-t border-stone-100 flex items-center justify-between text-[9px] md:text-[11px] font-mono text-stone-400">
          <span className="flex items-center gap-0.5">
            <Sparkles size={9} className="text-amber-500" />
            <span>{item.calories} cal</span>
          </span>
          <span className="text-red-500 font-bold group-hover:translate-x-1 transition-transform text-[10px] md:text-xs">
            Details →
          </span>
        </div>
      </div>
    </div>
  );
}