'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Package, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import AdminCard from '../../components/admin/AdminCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../services/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    recommendations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, products, recommendations] = await Promise.all([
          adminApi.users.getAll(),
          adminApi.products.getAll(),
          adminApi.recommendations.getAll(),
        ]);

        setStats({
          users: users.length,
          products: products.length,
          orders: 0,
          recommendations: recommendations.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const adminSections = [
    {
      title: 'Users Management',
      description: 'Manage user accounts, roles, and permissions',
      icon: <Users className="text-gold-400" size={24} />,
      href: '/admin/users',
      count: stats.users,
    },
    {
      title: 'Products Management',
      description: 'Manage product catalog, pricing, and inventory',
      icon: <Package className="text-gold-400" size={24} />,
      href: '/admin/products',
      count: stats.products,
    },
    {
      title: 'Orders Management',
      description: 'View and process customer orders',
      icon: <ShoppingCart className="text-gold-400" size={24} />,
      href: '/admin/orders',
      count: stats.orders,
    },
    {
      title: 'Recommendations Management',
      description: 'Oversee product recommendation system',
      icon: <Star className="text-gold-400" size={24} />,
      href: '/admin/recommendations',
      count: stats.recommendations,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminCard
          title="Total Users"
          value={stats.users}
          icon={<Users className="text-gold-400" size={24} />}
          description="Registered users"
        />
        <AdminCard
          title="Total Products"
          value={stats.products}
          icon={<Package className="text-gold-400" size={24} />}
          description="Products in catalog"
        />
        <AdminCard
          title="Total Orders"
          value={stats.orders}
          icon={<ShoppingCart className="text-gold-400" size={24} />}
          description="Orders processed"
        />
        <AdminCard
          title="Recommendations"
          value={stats.recommendations}
          icon={<Star className="text-gold-400" size={24} />}
          description="User recommendations"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group glass-effect rounded-xl p-6 hover:border-gold-400/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gold-600/20 rounded-lg group-hover:bg-gold-600/30 transition-colors">
                {section.icon}
              </div>
              <ArrowRight className="text-silver-400 group-hover:text-gold-400 transition-colors" size={20} />
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
              {section.title}
            </h3>
            <p className="text-silver-400 mb-3">{section.description}</p>
            <div className="text-2xl font-bold text-gold-400">{section.count}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
