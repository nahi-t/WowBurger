import React from 'react';
import { Edit3, Trash2, Flame, Sparkles, GlassWater, Cookie } from 'lucide-react';
import { MenuCategory } from '../../types';

interface CategoryTableProps {
  categories: MenuCategory[];
  loading: boolean;
  onEdit: (category: MenuCategory) => void;
  onDelete: (id: string, name: string) => void;
}

export default function CategoryTable({ categories, loading, onEdit, onDelete }: CategoryTableProps) {
  const renderCategoryIcon = (iconName: string) => {
    const iconProps = { size: 16 };
    switch (iconName) {
      case 'Flame':
        return <Flame {...iconProps} />;
      case 'Sparkles':
        return <Sparkles {...iconProps} />;
      case 'GlassWater':
        return <GlassWater {...iconProps} />;
      case 'Cookie':
        return <Cookie {...iconProps} />;
      default:
        return <span>{iconName}</span>;
    }
  };

  return (
    <div className="w-full bg-stone-950 border border-stone-850 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
      
      {/* 📱 MOBILE CARDS VIEW (Hidden on Tablet/Desktop) */}
      <div className="block sm:hidden p-4 space-y-4">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="p-4 bg-stone-900/40 border border-stone-900 rounded-xl space-y-3 relative overflow-hidden"
          >
            {/* Header Area of Card */}
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 bg-stone-900 border border-stone-800 text-red-500 rounded-xl flex items-center justify-center font-bold shrink-0">
                {renderCategoryIcon(cat.iconName)}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm truncate">{cat.name}</h4>
                <p className="font-mono text-[10px] text-red-400 truncate">{(cat as any).slug}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono uppercase tracking-wider text-stone-500 block">Order</span>
                <span className="font-mono font-bold text-amber-500 text-sm">{(cat as any).displayOrder}</span>
              </div>
            </div>

            {/* Description Body */}
            {cat.description && (
              <p className="text-xs text-stone-400 line-clamp-2 bg-stone-950/40 p-2.5 rounded-lg border border-stone-900/30">
                {cat.description}
              </p>
            )}

            {/* Interactive Actions Strip */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-900/60">
              <button
                onClick={() => onEdit(cat)}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg border border-stone-800 text-xs font-semibold flex-1 transition-colors disabled:opacity-50"
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(cat.id, cat.name)}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg border border-red-900/30 text-xs font-semibold flex-1 transition-colors disabled:opacity-50"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="p-8 text-center text-stone-500 font-mono text-xs">
            No categories found in database.
          </div>
        )}
      </div>

      {/* 💻 TRADITIONAL TABLE MATRIX (Hidden on Mobile) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-850 bg-stone-900/60 text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
              <th className="p-5">Icon</th>
              <th className="p-5">Category Name</th>
              <th className="p-5">Slug ID</th>
              <th className="p-5">Description</th>
              <th className="p-5 text-center">Order</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-900 text-sm text-stone-300">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-stone-900/35 transition-colors">
                <td className="p-5">
                  <span className="w-8 h-8 bg-stone-900 border border-stone-800 text-red-500 rounded-lg flex items-center justify-center font-bold">
                    {renderCategoryIcon(cat.iconName)}
                  </span>
                </td>
                <td className="p-5 font-bold text-white">{cat.name}</td>
                <td className="p-5 font-mono text-red-400">{(cat as any).slug}</td>
                <td className="p-5 text-stone-450 max-w-xs truncate">{cat.description}</td>
                <td className="p-5 text-center font-mono font-bold text-amber-500">{(cat as any).displayOrder}</td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(cat)}
                      disabled={loading}
                      className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg border border-stone-800 transition-colors cursor-pointer disabled:opacity-50"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(cat.id, cat.name)}
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
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-stone-500 font-mono">
                  No categories found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}