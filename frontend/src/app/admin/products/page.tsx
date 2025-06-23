'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../../../types';
import AdminTable from '../../../components/admin/AdminTable';
import AdminModal from '../../../components/admin/AdminModal';
import { adminApi } from '../../../services/adminApi';

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminApi.products.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    try {
      await adminApi.products.delete(product.id);
      await fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setSubmitting(true);
      if (editingProduct) {
        await adminApi.products.update(editingProduct.id, formData);
      } else {
        await adminApi.products.create(formData);
      }
      setModalOpen(false);
      await fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'productName', label: 'Product Name' },
    { 
      key: 'price', 
      label: 'Price',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { key: 'category', label: 'Category' },
    { 
      key: 'availability', 
      label: 'Stock',
      render: (value: number) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value > 10 
            ? 'bg-green-600/20 text-green-400 border border-green-600/30'
            : value > 0
            ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
            : 'bg-red-600/20 text-red-400 border border-red-600/30'
        }`}>
          {value} units
        </span>
      )
    },
    { 
      key: 'discription', 
      label: 'Description',
      render: (value: string) => value?.substring(0, 50) + (value?.length > 50 ? '...' : '')
    },
  ];

  const formFields = [
    { name: 'productName', label: 'Product Name', type: 'text' as const, required: true },
    { name: 'price', label: 'Price', type: 'number' as const, required: true },
    { name: 'category', label: 'Category', type: 'text' as const, required: true },
    { name: 'availability', label: 'Stock Quantity', type: 'number' as const, required: true },
    { name: 'discription', label: 'Description', type: 'textarea' as const },
  ];

  return (
    <div>
      <AdminTable
        data={products}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        title="Products Management"
      />

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        fields={formFields}
        initialData={editingProduct}
        loading={submitting}
      />
    </div>
  );
}
