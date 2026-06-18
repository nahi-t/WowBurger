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
    <div className="bg-stone-950 border border-stone-850 rounded-3xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-850 bg-stone-900/60 text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
              <th className="p-4 sm:p-5">Icon</th>
              <th className="p-4 sm:p-5">Category Name</th>
              <th className="p-4 sm:p-5">Slug ID</th>
              <th className="p-4 sm:p-5">Description</th>
              <th className="p-4 sm:p-5 text-center">Order</th>
              <th className="p-4 sm:p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-900 text-xs sm:text-sm text-stone-300">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-stone-900/35 transition-colors">
                <td className="p-4 sm:p-5">
                  <span className="w-8 h-8 bg-stone-900 border border-stone-800 text-red-500 rounded-lg flex items-center justify-center font-bold">
                    {renderCategoryIcon(cat.iconName)}
                  </span>
                </td>
                <td className="p-4 sm:p-5 font-bold text-white">{cat.name}</td>
                <td className="p-4 sm:p-5 font-mono text-red-400">{(cat as any).slug}</td>
                <td className="p-4 sm:p-5 text-stone-450 max-w-xs truncate">{cat.description}</td>
                <td className="p-4 sm:p-5 text-center font-mono font-bold text-amber-500">{(cat as any).displayOrder}</td>
                <td className="p-4 sm:p-5 text-right">
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
