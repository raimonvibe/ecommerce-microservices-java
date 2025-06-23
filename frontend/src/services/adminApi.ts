import { User, Product, Order, Recommendation } from '../types';

const API_BASE_URL = 'http://localhost:8900';

export const adminApi = {
  users: {
    getAll: async (): Promise<User[]> => {
      const response = await fetch(`${API_BASE_URL}/api/accounts/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    
    create: async (user: Omit<User, 'id'>): Promise<User> => {
      const response = await fetch(`${API_BASE_URL}/api/accounts/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    
    update: async (id: number, user: Partial<User>): Promise<User> => {
      const response = await fetch(`${API_BASE_URL}/api/accounts/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    
    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/api/accounts/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
    },
  },

  products: {
    getAll: async (): Promise<Product[]> => {
      const response = await fetch(`${API_BASE_URL}/api/catalog/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    
    create: async (product: Omit<Product, 'id'>): Promise<Product> => {
      const response = await fetch(`${API_BASE_URL}/api/catalog/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
    },
    
    update: async (id: number, product: Partial<Product>): Promise<Product> => {
      const response = await fetch(`${API_BASE_URL}/api/catalog/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },
    
    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/api/catalog/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
    },
  },

  recommendations: {
    getAll: async (): Promise<Recommendation[]> => {
      const response = await fetch(`${API_BASE_URL}/api/review/recommendations?name=all`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    },
    
    create: async (userId: number, productId: number, rating: number): Promise<Recommendation> => {
      const response = await fetch(`${API_BASE_URL}/api/review/${userId}/recommendations/${productId}?rating=${rating}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to create recommendation');
      return response.json();
    },
    
    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/api/review/recommendations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete recommendation');
    },
  },

  orders: {
    getAll: async (): Promise<Order[]> => {
      return [];
    },
    
    updateStatus: async (id: number, status: string): Promise<Order> => {
      throw new Error('Order status update not implemented');
    },
  },
};
