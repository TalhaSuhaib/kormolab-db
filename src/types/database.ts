export type UserRole = 'super_admin' | 'admin' | 'editor' | 'customer';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id?: string;
  short_description: string;
  description: string;
  features?: string[];
  price: number;
  sale_price?: number;
  is_digital: boolean;
  stock_quantity: number;
  is_featured: boolean;
  is_published: boolean;
  thumbnail_url: string;
  gallery_urls?: string[];
  digital_file_url?: string;
}
