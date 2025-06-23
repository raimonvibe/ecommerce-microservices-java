'use client';

import React, { useState, useEffect } from 'react';
import { Recommendation, User, Product } from '../../../types';
import AdminTable from '../../../components/admin/AdminTable';
import AdminModal from '../../../components/admin/AdminModal';
import { adminApi } from '../../../services/adminApi';

export default function RecommendationsManagement() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recommendationsData, usersData, productsData] = await Promise.all([
        adminApi.recommendations.getAll(),
        adminApi.users.getAll(),
        adminApi.products.getAll(),
      ]);
      setRecommendations(recommendationsData);
      setUsers(usersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setModalOpen(true);
  };

  const handleDelete = async (recommendation: Recommendation) => {
    try {
      await adminApi.recommendations.delete(recommendation.id);
      await fetchData();
    } catch (error) {
      console.error('Failed to delete recommendation:', error);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setSubmitting(true);
      await adminApi.recommendations.create(
        parseInt(formData.userId),
        parseInt(formData.productId),
        parseInt(formData.rating)
      );
      setModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Failed to create recommendation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'user.userName', 
      label: 'User',
      render: (value: string) => value || 'Unknown User'
    },
    { 
      key: 'product.productName', 
      label: 'Product',
      render: (value: string) => value || 'Unknown Product'
    },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (value: number) => (
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-sm ${
                star <= value ? 'text-gold-400' : 'text-silver-600'
              }`}
            >
              ★
            </span>
          ))}
          <span className="text-silver-400 ml-2">({value})</span>
        </div>
      )
    },
  ];

  const formFields = [
    { 
      name: 'userId', 
      label: 'User', 
      type: 'select' as const, 
      required: true,
      options: users.map(user => ({ value: user.id, label: user.userName }))
    },
    { 
      name: 'productId', 
      label: 'Product', 
      type: 'select' as const, 
      required: true,
      options: products.map(product => ({ value: product.id, label: product.productName }))
    },
    { 
      name: 'rating', 
      label: 'Rating', 
      type: 'select' as const, 
      required: true,
      options: [
        { value: 1, label: '1 Star' },
        { value: 2, label: '2 Stars' },
        { value: 3, label: '3 Stars' },
        { value: 4, label: '4 Stars' },
        { value: 5, label: '5 Stars' },
      ]
    },
  ];

  return (
    <div>
      <AdminTable
        data={recommendations}
        columns={columns}
        loading={loading}
        onDelete={handleDelete}
        onCreate={handleCreate}
        title="Recommendations Management"
      />

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        title="Create Recommendation"
        fields={formFields}
        loading={submitting}
      />
    </div>
  );
}
