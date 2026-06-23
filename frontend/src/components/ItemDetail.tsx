import React, { useEffect, useState } from 'react';
import { X, Flame, Leaf, Shield, Award, Sparkles, ChevronLeft, Eye } from 'lucide-react'; // Added Eye icon
import { MenuItem } from '../types';
import { incrementView } from '../services/api'; // Import your exact backend view tracker function

interface ItemDetailProps {
  item: MenuItem;
  onBack: () => void;
}

export default function ItemDetail({ item, onBack }: ItemDetailProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (!item.id) return;

    // Trigger the exact NestJS backend route using the item's ID
    incrementView(item.id)
      .then((data) => {
        if (data.success) {
          setViews(data.views); // Set the returned Redis counter
        }
      })
      .catch((err) => console.error("Could not sync view count:", err));
  }, [item.id]);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-in fade-in duration-300">
      {/* Header Image */}
      <div className="relative h-80 w-full bg-stone-100">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover" 
        />
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Title & Price */}
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-black text-stone-900 leading-tight">{item.name}</h1>
          <span className="text-2xl font-black text-red-600">{item.price}</span>
        </div>

        {/* View Count Badge Added Here */}
        <div className="flex items-center gap-1.5 text-stone-400 mb-5 text-xs font-bold uppercase tracking-wider">
          <Eye size={14} className="text-stone-400" />
          {views !== null ? (
            <span>{views} views</span>
          ) : (
            <span className="animate-pulse bg-stone-200 h-3 w-12 rounded" /> // Soft loading skeleton
          )}
        </div>
        
        <p className="text-stone-600 text-lg leading-relaxed mb-8">{item.description}</p>

        {/* Nutrition Grid */}
        <div className="grid grid-cols-4 gap-2 mb-10">
          {Object.entries(item.nutrition).map(([key, value]) => (
            <div key={key} className="bg-stone-50 border border-stone-100 p-3 rounded-2xl text-center">
              <div className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-1">{key}</div>
              <div className="font-black text-stone-900">{value}</div>
            </div>
          ))}
        </div>

        {/* Detailed Ingredients List */}
        <div className="mb-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-stone-900 mb-4 border-b border-stone-200 pb-2">
            The Crafted Build
          </h3>
          <div className="space-y-4">
            {item.detailedIngredients?.map((ing, idx) => (
              <div key={idx} className="flex gap-4 items-start p-3 bg-stone-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg border border-stone-200">
                  <Sparkles size={16} className="text-red-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{ing.name}</h4>
                  <p className="text-[11px] text-stone-500">{ing.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Status */}
        <div className="flex items-center gap-2 p-4 bg-stone-900 rounded-2xl text-white">
          <div className={`w-3 h-3 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className="text-xs font-bold uppercase tracking-wider">
            {item.isAvailable ? 'Available for Immediate Order' : 'Currently Unavailable'}
          </span>
        </div>
      </main>
    </div>
  );
}