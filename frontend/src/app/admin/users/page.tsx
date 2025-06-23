'use client';

import React, { useState, useEffect } from 'react';
import { User } from '../../../types';
import AdminTable from '../../../components/admin/AdminTable';
import AdminModal from '../../../components/admin/AdminModal';
import { adminApi } from '../../../services/adminApi';

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.users.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    try {
      await adminApi.users.delete(user.id);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setSubmitting(true);
      if (editingUser) {
        await adminApi.users.update(editingUser.id, formData);
      } else {
        await adminApi.users.create(formData);
      }
      setModalOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'userName', label: 'Username' },
    { 
      key: 'userDetails.email', 
      label: 'Email',
      render: (value: string) => value || 'N/A'
    },
    { 
      key: 'userDetails.firstName', 
      label: 'First Name',
      render: (value: string) => value || 'N/A'
    },
    { 
      key: 'userDetails.lastName', 
      label: 'Last Name',
      render: (value: string) => value || 'N/A'
    },
    { 
      key: 'role.roleName', 
      label: 'Role',
      render: (value: string) => value || 'USER'
    },
    { 
      key: 'active', 
      label: 'Status',
      render: (value: number) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 1 
            ? 'bg-green-600/20 text-green-400 border border-green-600/30'
            : 'bg-red-600/20 text-red-400 border border-red-600/30'
        }`}>
          {value === 1 ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  const formFields = [
    { name: 'userName', label: 'Username', type: 'text' as const, required: true },
    { name: 'userPassword', label: 'Password', type: 'text' as const, required: !editingUser },
    { name: 'userDetails.firstName', label: 'First Name', type: 'text' as const },
    { name: 'userDetails.lastName', label: 'Last Name', type: 'text' as const },
    { name: 'userDetails.email', label: 'Email', type: 'email' as const },
    { name: 'userDetails.phoneNumber', label: 'Phone', type: 'text' as const },
    { 
      name: 'active', 
      label: 'Status', 
      type: 'select' as const,
      options: [
        { value: 1, label: 'Active' },
        { value: 0, label: 'Inactive' }
      ]
    },
  ];

  return (
    <div>
      <AdminTable
        data={users}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        title="Users Management"
      />

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingUser ? 'Edit User' : 'Create User'}
        fields={formFields}
        initialData={editingUser}
        loading={submitting}
      />
    </div>
  );
}
