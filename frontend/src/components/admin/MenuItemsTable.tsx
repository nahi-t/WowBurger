import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { MenuItem } from '../../types';

interface MenuItemsTableProps {
  items: MenuItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string, name: string) => void;
}

export default function MenuItemsTable({
  items,
  total,
  page,
  limit,
  totalPages,
  loading,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
}: MenuItemsTableProps) {
  return (
    <div className="bg-stone-950 border border-stone-850 rounded-3xl overflow-hidden shadow-xl" id="admin-items-shelf">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-850 bg-stone-900/60 text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
              <th className="p-4 sm:p-5">Thumb</th>
              <th className="p-4 sm:p-5">Dish Title</th>
              <th className="p-4 sm:p-5">Category</th>
              <th className="p-4 sm:p-5">Price</th>
              <th className="p-4 sm:p-5">Calories</th>
              <th className="p-4 sm:p-5">Dietary</th>
              <th className="p-4 sm:p-5 text-center">Status</th>
              <th className="p-4 sm:p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-900 text-xs sm:text-sm text-stone-300">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-stone-900/35 transition-colors">
                <td className="p-4 sm:p-5">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120'}
                    alt={item.name}
                    className="w-12 h-10 object-cover rounded-lg border border-stone-800 bg-stone-900 shrink-0"
                  />
                </td>
                <td className="p-4 sm:p-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{item.name}</span>
                    <span className="text-[10px] font-mono text-stone-500">{(item as any).slug}</span>
                  </div>
                </td>
                <td className="p-4 sm:p-5">
                  <span className="inline-block bg-stone-900 border border-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold">
                    {item.category}
                  </span>
                </td>
                <td className="p-4 sm:p-5 font-bold text-red-500 font-mono">{item.price}</td>
                <td className="p-4 sm:p-5 font-mono text-stone-400">{item.calories} cal</td>
                <td className="p-4 sm:p-5">
                  <div className="flex flex-wrap gap-1 max-w-35">
                    {item.dietaryTags?.map((tag) => (
                      <span key={tag} className="text-[9px] font-bold bg-stone-900 border border-stone-800 px-1 py-0.5 rounded text-amber-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 sm:p-5 text-center">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      (item as any).isAvailable !== false ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    title={(item as any).isAvailable !== false ? 'Available' : 'Unavailable'}
                  />
                </td>
                <td className="p-4 sm:p-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      disabled={loading}
                      className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg border border-stone-800 transition-colors cursor-pointer disabled:opacity-50"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id, item.name)}
                      disabled={loading}
                      className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg border border-red-900/30 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-stone-500 font-mono">
                  No menu items found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="bg-stone-900/50 border-t border-stone-850 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-xs text-stone-400 font-mono">
          <span>
            Showing <span className="text-red-500 font-bold">{items.length}</span> of <span className="text-amber-500 font-bold">{total}</span> items
          </span>
          <span className="mx-2 text-stone-600">•</span>
          <span>
            Page <span className="text-red-500 font-bold">{page}</span> of <span className="text-amber-500 font-bold">{totalPages}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className="px-3 py-2 text-xs font-bold uppercase rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-stone-300 cursor-pointer flex items-center gap-1.5"
            title="Previous page"
          >
            <span>← Prev</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  disabled={loading}
                  className={`w-8 h-8 text-xs font-bold uppercase rounded-lg border transition-colors cursor-pointer ${
                    page === pageNum
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-stone-900 border-stone-800 hover:bg-stone-800 text-stone-300'
                  } disabled:opacity-50`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || loading}
            className="px-3 py-2 text-xs font-bold uppercase rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-stone-300 cursor-pointer flex items-center gap-1.5"
            title="Next page"
          >
            <span>Next →</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-mono font-bold text-stone-400 uppercase">Items per page:</label>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            disabled={loading}
            className="px-2 py-1 text-xs font-bold uppercase rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 cursor-pointer focus:outline-none focus:border-red-500 disabled:opacity-50"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
