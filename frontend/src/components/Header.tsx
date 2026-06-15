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

      {/* Sleek compact Brand section */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        
        {/* Brand logo title aligned left/center */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Flame size={18} className="animate-pulse" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black tracking-tightest leading-none text-stone-50" id="brand-logo-title">
              WOW<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 font-extrabold">BURGER</span>
            </h1>
            <p className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-widest mt-0.5 sm:block hidden">
              Ethiopia’s Premier Craft Burgers
            </p>
          </div>
        </div>

        {/* Search controls & favorite filter aligned right/compacted */}
        <div className="w-full sm:w-auto flex flex-row items-center gap-2 flex-1 max-w-lg justify-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-stone-500" size={14} />
            <input
              type="text"
              placeholder="Search dishes or ingredients..."
              className="w-full pl-9 pr-8 py-1.5 bg-stone-850 border border-stone-800 focus:border-red-500 rounded-lg text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="menu-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2.5 text-[10px] font-mono text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={onViewFavorites}
            className={`px-3 py-2 rounded-lg border flex items-center justify-center gap-1 text-xs font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
              showFavoritesOnly
                ? 'bg-red-600 border-red-600 text-white shadow-md'
                : 'bg-stone-800/80 border-stone-800 text-stone-300 hover:bg-stone-800'
            }`}
            id="favorite-toggle-btn"
          >
            <Sparkles size={12} className={showFavoritesOnly ? 'fill-white' : 'text-amber-500'} />
            <span>Favs ({favoritesCount})</span>
          </button>
        </div>
      </div>

      {/* Bottom thin accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
    </header>
  );
}
