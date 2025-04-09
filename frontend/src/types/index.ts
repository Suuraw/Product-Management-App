export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}