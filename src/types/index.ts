export type ProductTag =
  | 'new'
  | 'bestseller'
  | 'popular'
  | 'professional'
  | 'budget'
  | 'sale'
  | 'featured'
  | (string & {});

export interface Product {
  id: number;
  slug: string;
  name: string;
  model: string;
  brand: string;
  category: string;
  subcategory?: 'Wired' | 'Wireless';
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  feature: string;
  image: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  tags: (ProductTag | string)[];
}

export interface Category {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export type InquiryStatus =
  | 'New'
  | 'Contacted'
  | 'Follow Up'
  | 'Converted'
  | 'Closed';

export interface Inquiry {
  name: string;
  phone: string;
  email?: string;
  productId?: number;
  productName?: string;
  message: string;
  createdAt: string;
  status: InquiryStatus;
}

export interface HomeSection {
  id: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  type: 'category' | 'tag' | 'top-picks' | 'custom';
  filterValue?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  maxProducts: number;
  productIds?: number[];
  enabled: boolean;
  variant?: 'default' | 'spec';
  specKeys?: string[];
  dark?: boolean;
  order?: number;
}
