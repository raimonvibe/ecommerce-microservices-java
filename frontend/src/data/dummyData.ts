import { User, Product, Recommendation, UserDetails, UserRole } from '@/types';

export const dummyUserRoles: UserRole[] = [
  { id: 1, roleName: 'ADMIN' },
  { id: 2, roleName: 'USER' },
  { id: 3, roleName: 'PREMIUM_USER' },
];

export const dummyUserDetails: UserDetails[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '+1-555-0123', address: '123 Main St, New York, NY 10001' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '+1-555-0124', address: '456 Oak Ave, Los Angeles, CA 90210' },
  { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@example.com', phone: '+1-555-0125', address: '789 Pine Rd, Chicago, IL 60601' },
  { id: 4, firstName: 'Sarah', lastName: 'Williams', email: 'sarah.williams@example.com', phone: '+1-555-0126', address: '321 Elm St, Houston, TX 77001' },
];

export const dummyUsers: User[] = [
  { id: 1, userName: 'johndoe', active: 1, userDetails: dummyUserDetails[0], role: dummyUserRoles[1] },
  { id: 2, userName: 'janesmith', active: 1, userDetails: dummyUserDetails[1], role: dummyUserRoles[2] },
  { id: 3, userName: 'mikejohnson', active: 1, userDetails: dummyUserDetails[2], role: dummyUserRoles[1] },
  { id: 4, userName: 'sarahwilliams', active: 1, userDetails: dummyUserDetails[3], role: dummyUserRoles[0] },
];

export const dummyProducts: Product[] = [
  {
    id: 1,
    productName: 'MacBook Pro 16"',
    price: 2499.99,
    discription: 'Powerful laptop with M3 Pro chip, 18GB RAM, and 512GB SSD. Perfect for professional work and creative tasks.',
    category: 'Electronics',
    availability: 15,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop'
  },
  {
    id: 2,
    productName: 'iPhone 15 Pro',
    price: 999.99,
    discription: 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system. Available in multiple colors.',
    category: 'Electronics',
    availability: 25,
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=300&fit=crop'
  },
  {
    id: 3,
    productName: 'Premium Leather Jacket',
    price: 299.99,
    discription: 'Genuine leather jacket with modern cut and premium finish. Perfect for casual and semi-formal occasions.',
    category: 'Clothing',
    availability: 8,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=300&fit=crop'
  },
  {
    id: 4,
    productName: 'Wireless Headphones',
    price: 199.99,
    discription: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    category: 'Electronics',
    availability: 30,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=300&fit=crop'
  },
  {
    id: 5,
    productName: 'Smart Watch',
    price: 399.99,
    discription: 'Advanced smartwatch with health monitoring, GPS, and cellular connectivity.',
    category: 'Electronics',
    availability: 20,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=300&fit=crop'
  },
  {
    id: 6,
    productName: 'Designer Sneakers',
    price: 149.99,
    discription: 'Comfortable and stylish sneakers with premium materials and modern design.',
    category: 'Clothing',
    availability: 12,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=300&fit=crop'
  },
  {
    id: 7,
    productName: 'Programming Fundamentals',
    price: 49.99,
    discription: 'Comprehensive guide to programming fundamentals with practical examples and exercises.',
    category: 'Books',
    availability: 50,
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=300&fit=crop'
  },
  {
    id: 8,
    productName: 'Coffee Maker Pro',
    price: 179.99,
    discription: 'Professional-grade coffee maker with programmable settings and thermal carafe.',
    category: 'Home',
    availability: 18,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=300&fit=crop'
  },
];

export const dummyRecommendations: Recommendation[] = [
  { id: 1, rating: 5, product: dummyProducts[0], user: dummyUsers[0] },
  { id: 2, rating: 4, product: dummyProducts[1], user: dummyUsers[1] },
  { id: 3, rating: 5, product: dummyProducts[2], user: dummyUsers[2] },
  { id: 4, rating: 4, product: dummyProducts[3], user: dummyUsers[0] },
  { id: 5, rating: 5, product: dummyProducts[4], user: dummyUsers[1] },
  { id: 6, rating: 3, product: dummyProducts[5], user: dummyUsers[3] },
];

export const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home'];
