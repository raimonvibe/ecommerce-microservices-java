'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  fields: FormField[];
  initialData?: any;
  loading?: boolean;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'textarea';
  required?: boolean;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
}

export default function AdminModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  initialData,
  loading = false,
}: AdminModalProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const emptyData: any = {};
      fields.forEach((field) => {
        emptyData[field.name] = field.type === 'number' ? 0 : '';
      });
      setFormData(emptyData);
    }
  }, [initialData, fields]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-effect rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-silver-400 hover:text-gold-400 hover:bg-gold-600/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gold-400 mb-2">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  className="w-full px-3 py-2 bg-dark-800 border border-gold-600/20 rounded-lg text-white placeholder-silver-400 focus:border-gold-400 focus:outline-none transition-colors"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  className="w-full px-3 py-2 bg-dark-800 border border-gold-600/20 rounded-lg text-white placeholder-silver-400 focus:border-gold-400 focus:outline-none transition-colors resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  step={field.type === 'number' ? '0.01' : undefined}
                  className="w-full px-3 py-2 bg-dark-800 border border-gold-600/20 rounded-lg text-white placeholder-silver-400 focus:border-gold-400 focus:outline-none transition-colors"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-silver-400 hover:text-white border border-silver-600/20 hover:border-silver-400/40 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:bg-gold-600/50 text-white rounded-lg transition-colors font-medium"
            >
              {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
