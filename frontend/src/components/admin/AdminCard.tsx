'use client';

import React from 'react';

interface AdminCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function AdminCard({ title, value, icon, description, trend }: AdminCardProps) {
  return (
    <div className="glass-effect rounded-xl p-6 hover:border-gold-400/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gold-600/20 rounded-lg">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      
      <div className="mb-2">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-gold-400 font-medium">{title}</p>
      </div>
      
      {description && (
        <p className="text-silver-400 text-sm">{description}</p>
      )}
    </div>
  );
}
