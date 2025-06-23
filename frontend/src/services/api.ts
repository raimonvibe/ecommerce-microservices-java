import axios from 'axios';
import { User, Product, Recommendation, CartItem, Order } from '@/types';

const API_BASE_URL = 'http://localhost:8900/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  getAllUsers: () => api.get<User[]>('/accounts/users'),
  getUserById: (id: number) => api.get<User>(`/accounts/users/${id}`),
  getUserByName: (name: string) => api.get<User>(`/accounts/users?name=${name}`),
  registerUser: (user: Partial<User>) => api.post<User>('/accounts/registration', user),
  createUser: (user: Partial<User>) => api.post<User>('/accounts/users', user),
};

export const productService = {
  getAllProducts: () => api.get<Product[]>('/catalog/products'),
  getProductById: (id: number) => api.get<Product>(`/catalog/products/${id}`),
  getProductsByCategory: (category: string) => api.get<Product[]>(`/catalog/products?category=${category}`),
  getProductsByName: (name: string) => api.get<Product[]>(`/catalog/products?name=${name}`),
  createProduct: (product: Partial<Product>) => api.post<Product>('/catalog/admin/products', product),
};

export const recommendationService = {
  getAllRecommendations: () => api.get<Recommendation[]>('/review/recommendations'),
  getRecommendationsByUser: (userId: number) => api.get<Recommendation[]>(`/review/recommendations?userId=${userId}`),
  createRecommendation: (recommendation: Partial<Recommendation>) => api.post<Recommendation>('/review/recommendations', recommendation),
};

export const cartService = {
  getCart: (userId: number) => api.get<CartItem[]>(`/shop/cart?userId=${userId}`),
  addToCart: (item: Partial<CartItem>) => api.post<CartItem>('/shop/cart', item),
  updateCartItem: (id: number, item: Partial<CartItem>) => api.put<CartItem>(`/shop/cart/${id}`, item),
  removeFromCart: (id: number) => api.delete(`/shop/cart/${id}`),
};

export const orderService = {
  getAllOrders: () => api.get<Order[]>('/shop/orders'),
  getOrdersByUser: (userId: number) => api.get<Order[]>(`/shop/orders?userId=${userId}`),
  createOrder: (order: Partial<Order>) => api.post<Order>('/shop/orders', order),
};

export default api;
