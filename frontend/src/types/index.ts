export interface User {
  id: number;
  userName: string;
  userPassword?: string;
  active: number;
  userDetails?: UserDetails;
  role?: UserRole;
}

export interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UserRole {
  id: number;
  roleName: string;
}

export interface Product {
  id: number;
  productName: string;
  price: number;
  discription: string;
  category: string;
  availability: number;
  imageUrl?: string;
}

export interface Recommendation {
  id: number;
  rating: number;
  product: Product;
  user: User;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  userId: number;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
