import React from 'react';
import { Search, MapPin, Clock, Flame, Sparkles } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesCount: number;
  onViewFavorites: () => void;
  showFavoritesOnly: boolean;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  favoritesCount,
  onViewFavorites,
  showFavoritesOnly,
}: HeaderProps) {
  // Let's check if the restaurant is current open (based on local hours: open 10:00 AM to 11:00 PM)
  const isCurrentlyOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 10 && hours < 23;
  };

  return (
    <header className="relative w-full bg-stone-900 text-stone-100 overflow-hidden" id="main-header">
      {/* Editorial Decorative Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.15),transparent_45%)]" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />

      {/* Header upper utilities */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2 border-b border-stone-800 flex flex-wrap gap-y-2 justify-between items-center text-xs font-mono text-stone-400 relative z-10">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-red-500" />
            <span>Bole Road, Walkway Plaza, Addis Ababa, Ethiopia</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-500 font-bold">☎</span>
            <span>+251 11 661 2345 / +251 911 412 345</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5">
            <Clock size={12} className="text-amber-500" />
            <span>10:00 AM - 11:00 PM (LT)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Real-time indicator */}
          <span className="flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${isCurrentlyOpen() ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="font-semibold text-stone-300">
              {isCurrentlyOpen() ? 'WE ARE OPEN' : 'WE REOPEN AT 10:00 AM'}
            </span>
          </span>
        </div>
      </div>

      {/* Primary Brand section */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center justify-center gap-2 bg-red-600/10 border border-red-500/30 px-3 py-1 rounded-full mb-3 text-red-400 font-mono text-xs uppercase tracking-widest animate-bounce">
          <Flame size={12} />
          <span>Award-Winning Crafted Taste</span>
          <Flame size={12} />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tightest text-stone-50" id="brand-logo-title">
          WOW<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">BURGER</span>
        </h1>
        
        <p className="mt-2 text-stone-400 font-sans max-w-lg text-sm md:text-base leading-relaxed">
          Gourmet ingredients, regenerative grass-fed Angus beef, and slow-churned secret recipes crafted with fiery passion.
        </p>

        {/* Search controls & favorite filter */}
        <div className="mt-8 w-full max-w-xl flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 text-stone-500" size={18} />
            <input
              type="text"
              placeholder="Search gourmet burgers, drinks..."
              className="w-full pl-11 pr-4 py-3 bg-stone-850 border border-stone-800 focus:border-red-500 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="menu-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-xs font-mono text-stone-500 hover:text-stone-300"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={onViewFavorites}
            className={`px-5 py-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 ${
              showFavoritesOnly
                ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/30'
                : 'bg-stone-800/50 border-stone-800 text-stone-300 hover:bg-stone-800 hover:border-stone-700'
            }`}
            id="favorite-toggle-btn"
          >
            <Sparkles size={16} className={showFavoritesOnly ? 'fill-white' : 'text-amber-500'} />
            <span className="whitespace-nowrap">Favorites ({favoritesCount})</span>
          </button>
        </div>
      </div>

      {/* Bottom organic curve cutout */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-stone-50 rounded-t-3xl" />
    </header>
  );
}
