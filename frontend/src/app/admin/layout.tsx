import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - RainbowForest E-commerce',
  description: 'Administrative interface for managing users, products, orders, and recommendations',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-silver-400">Manage your e-commerce platform</p>
        </div>
        {children}
      </div>
    </div>
  );
}
