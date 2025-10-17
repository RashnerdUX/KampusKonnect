export interface VendorItem {
  title: string;
  price: number;
}

export interface Review {
  name: string;
  text: string;
  stars: number;
  createdAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  university: string;
  category: string;
  whatsApp: string;
  cover: string;
  items: VendorItem[];
  ratings: number[];
  reviews: Review[];
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id?: string;
  name: string;
  university: string;
  role: 'student' | 'vendor';
  phone: string;
  createdAt?: string;
}

export interface Category {
  key: string;
  label: string;
}

export interface University {
  name: string;
  shortName?: string;
}

export interface FilterOptions {
  query: string;
  university: string;
  category: string;
}

export interface VendorFormData {
  name: string;
  university: string;
  category: string;
  whatsApp: string;
  cover: string;
  title: string;
  price: string;
}

export interface ReviewFormData {
  stars: number;
  name: string;
  text: string;
}

export interface AuthFormData {
  name: string;
  university: string;
  role: 'student' | 'vendor';
  phone: string;
}