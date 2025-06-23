'use client';

import React, { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onCreate?: () => void;
  title: string;
}

export default function AdminTable<T extends { id: number }>({
  data,
  columns,
  loading = false,
  onEdit,
  onDelete,
  onCreate,
  title,
}: AdminTableProps<T>) {
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleDelete = (item: T) => {
    if (deleteConfirm === item.id) {
      onDelete?.(item);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(item.id);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {onCreate && (
          <button
            onClick={onCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-gold-600 hover:bg-gold-500 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <Plus size={16} />
            <span>Add New</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold-600/20">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="text-left py-3 px-4 text-gold-400 font-semibold"
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="text-left py-3 px-4 text-gold-400 font-semibold">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gold-600/10 hover:bg-gold-600/5 transition-colors"
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="py-3 px-4 text-silver-400">
                    {column.render
                      ? column.render(
                          typeof column.key === 'string' && column.key.includes('.')
                            ? column.key.split('.').reduce((obj: any, key: string) => obj?.[key], item)
                            : item[column.key as keyof T],
                          item
                        )
                      : String(
                          typeof column.key === 'string' && column.key.includes('.')
                            ? column.key.split('.').reduce((obj: any, key: string) => obj?.[key], item)
                            : item[column.key as keyof T] || ''
                        )}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 text-silver-400 hover:text-gold-400 hover:bg-gold-600/10 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => handleDelete(item)}
                          className={`p-2 rounded-lg transition-colors ${
                            deleteConfirm === item.id
                              ? 'text-red-400 bg-red-600/20 hover:bg-red-600/30'
                              : 'text-silver-400 hover:text-red-400 hover:bg-red-600/10'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-silver-400">
          No {title.toLowerCase()} found
        </div>
      )}
    </div>
  );
}
