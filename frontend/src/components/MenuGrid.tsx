import React, { useEffect, useState } from 'react';
import MenuCard from './MenuCard';
import { MenuItem } from '../types';

export default function MenuGrid() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Replace with your local port or your production Render Web Service URL
    fetch('http://localhost:3000/menu-items?page=1&limit=12') 
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server returned status code: ${res.status}`);
        }
        return res.json();
      })
      .then((response) => {
        // PRODUCTION SAFEGUARD: 
        // Handles your new paginated NestJS output formatting ({ data, meta })
        if (response && response.data) {
          setMenuItems(response.data);
          if (response.meta) {
            setPaginationMeta(response.meta);
          }
        } else if (Array.isArray(response)) {
          // Fallback parsing handle for flat mock arrays
          setMenuItems(response);
        }
      })
      .catch((err) => {
        console.error('❌ Failed loading menu data matrix:', err);
        setError(err.message || 'Something went wrong while fetching menu items.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-red-600 rounded-full animate-spin" />
        <p className="font-mono text-xs text-stone-400">Loading live menu stream...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <p className="text-red-500 font-bold mb-2">Failed to sync view data</p>
        <p className="text-stone-400 font-mono text-xs max-w-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Menu Cards Layout Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {menuItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item} // Injected with the live Redis view counts from NestJS!
            isFavorite={false}
            onSelectItem={(selected) => console.log('Selected Item Details:', selected)}
            onToggleFavorite={(id, e) => console.log('Toggled Favorite Status:', id)}
          />
        ))}
      </div>

      {/* Optional Footnote Pagination Info */}
      <div className="mt-8 pt-4 border-t border-stone-100 flex justify-between items-center text-xs font-mono text-stone-400">
        <span>Total Items: {paginationMeta.total}</span>
        <span>Page {paginationMeta.page} of {paginationMeta.totalPages}</span>
      </div>
    </div>
  );
}