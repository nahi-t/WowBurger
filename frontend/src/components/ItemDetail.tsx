import React, { useEffect, useState } from 'react';
import { ChevronLeft, Eye, ChevronRight, Sparkles } from 'lucide-react'; 
import { MenuItem } from '../types';
import { incrementView } from '../services/api'; 

interface ItemDetailProps {
  item: MenuItem; // Assumes item.images is now string[] instead of item.image
  onBack: () => void;
}

export default function ItemDetail({ item, onBack }: ItemDetailProps) {
  const [views, setViews] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Fallback to array format support if backend payload varies
// Force 'images' to be a strict string array, whether it's a string, an array, or missing
const images: string[] = Array.isArray(item.image)
  ? item.image
  : typeof item.image === 'string'
  ? [item.image]
  : item.image
  ? [item.image]
  : [];

  useEffect(() => {
    if (!item.id) return;

    incrementView(item.id)
      .then((data) => {
        if (data.success) {
          setViews(data.views); 
        }
      })
      .catch((err) => console.error("Could not sync view count:", err));
  }, [item.id]);

  /**
   * Slide Handler using a Closure
   * Encapsulates the specific step parameter inside the returned state-updater function.
   */
  const changeImage = (step: number) => {
    return () => {
      setCurrentImageIndex((prevIndex) => {
        const totalImages = images.length;
        if (totalImages === 0) return 0;
        // Loops around safely if boundaries are exceeded
        return (prevIndex + step + totalImages) % totalImages;
      });
    };
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-in fade-in duration-300">
      
      {/* --- Multi-Image Cloudinary Header Slider --- */}
      <div className="relative h-80 w-full bg-stone-100 group">
        {images.length > 0 ? (
          <img 
            src={images[currentImageIndex]} 
            alt={`${item.name} view ${currentImageIndex + 1}`} 
            className="w-full h-full object-cover transition-all duration-500 ease-in-out" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">No images available</div>
        )}

        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all z-10"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Dynamic Carousel Navigation Controls (only displays if multi-image exists) */}
        {images.length > 1 && (
          <>
            {/* Left Control (uses closure instance passing -1 step) */}
            <button 
              onClick={changeImage(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Right Control (uses closure instance passing +1 step) */}
            <button 
              onClick={changeImage(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image Indicator Dots Badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {images.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Title & Price */}
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-black text-stone-900 leading-tight">{item.name}</h1>
          <span className="text-2xl font-black text-red-600">{item.price}</span>
        </div>

        {/* View Count Badge */}
        <div className="flex items-center gap-1.5 text-stone-400 mb-5 text-xs font-bold uppercase tracking-wider">
          <Eye size={14} className="text-stone-400" />
          {views !== null ? (
            <span>{views} views</span>
          ) : (
            <span className="animate-pulse bg-stone-200 h-3 w-12 rounded" />
          )}
        </div>
        
        <p className="text-stone-600 text-lg leading-relaxed mb-8">{item.description}</p>

        {/* Nutrition Grid */}
        <div className="grid grid-cols-4 gap-2 mb-10">
          {item.nutrition && Object.entries(item.nutrition).map(([key, value]) => (
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