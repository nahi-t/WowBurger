import React from 'react';
import { Home, Utensils, GlassWater, Heart } from 'lucide-react';

interface BottomNavigationProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  favoriteCount?: number;
}

export default function BottomNavigation({
  currentTab,
  onChangeTab,
  favoriteCount = 0
}: BottomNavigationProps) {
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'food', label: 'Food', icon: Utensils },
    { id: 'drinks', label: 'Drinks', icon: GlassWater },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoriteCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-lg border-t border-stone-200/60 px-2 pb-safe-bottom z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full select-none outline-hidden tap-highlight-transparent group"
            >
              {/* Dynamic Icon Wrapper Wrapper */}
              <div 
                className={`p-2 rounded-2xl transition-all duration-300 relative ${
                  isActive 
                    ? 'text-red-600 scale-110 -translate-y-1 bg-red-50/80 shadow-xs' 
                    : 'text-stone-400 active:scale-95 group-hover:text-stone-600'
                }`}
              >
                <Icon 
                  size={20} 
                  className={`transition-transform duration-300 ${
                    isActive ? 'stroke-[2.5] animate-none' : 'stroke-[2]'
                  }`} 
                />
                
                {/* Notification Badge with Pop/Scale Animation on count changes */}
                {item.badge! > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white font-mono text-[9px] font-bold px-1 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in-50 duration-200">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Text Label styling */}
              <span 
                className={`text-[10px] tracking-wide mt-0.5 transition-all duration-300 ${
                  isActive 
                    ? 'text-stone-900 font-black opacity-100' 
                    : 'text-stone-400 font-medium opacity-80'
                }`}
              >
                {item.label}
              </span>

              {/* Little Active Indicator Pill Underneath */}
              <span 
                className={`absolute bottom-1 w-1 h-1 bg-red-600 rounded-full transition-all duration-300 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}