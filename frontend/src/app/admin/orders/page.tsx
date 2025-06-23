'use client';

import React, { useState, useEffect } from 'react';
import { Order } from '../../../types';
import AdminTable from '../../../components/admin/AdminTable';
import { adminApi } from '../../../services/adminApi';

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminApi.orders.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (order: Order) => {
    try {
      const newStatus = order.status === 'PAYMENT_EXPECTED' ? 'PROCESSING' : 'COMPLETED';
      await adminApi.orders.updateStatus(order.id, newStatus);
      await fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'userId', label: 'User ID' },
    { 
      key: 'totalAmount', 
      label: 'Total',
      render: (value: number) => `$${value?.toFixed(2) || '0.00'}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'COMPLETED' 
            ? 'bg-green-600/20 text-green-400 border border-green-600/30'
            : value === 'PROCESSING'
            ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
            : 'bg-red-600/20 text-red-400 border border-red-600/30'
        }`}>
          {value || 'PENDING'}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Date',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    { 
      key: 'items', 
      label: 'Items',
      render: (value: any[]) => `${value?.length || 0} items`
    },
  ];

  return (
    <div>
      <AdminTable
        data={orders}
        columns={columns}
        loading={loading}
        onEdit={handleStatusUpdate}
        title="Orders Management"
      />
      
      {orders.length === 0 && !loading && (
        <div className="glass-effect rounded-xl p-8 text-center mt-6">
          <p className="text-silver-400 mb-4">No orders found in the system.</p>
          <p className="text-sm text-silver-500">
            Orders will appear here once customers start placing orders through the frontend.
          </p>
        </div>
      )}
    </div>
  );
}
