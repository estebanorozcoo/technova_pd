export type ProductCategory = 
  | 'laptops' 
  | 'monitors' 
  | 'peripherals' 
  | 'accessories';

export interface Product {
  _id?: string;
  sku: string;
  name: string;
  brand: string;
  quantity: number;
  price: number;
  isActive: boolean;
  category: ProductCategory;
  imageUrl: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProductFormData {
  sku: string;
  name: string;
  brand: string;
  quantity: number;
  price: number;
  category: ProductCategory;
  imageUrl: string;
}

export interface ProductFilters {
  category?: ProductCategory;
  brand?: string;
  isActive?: boolean;
}