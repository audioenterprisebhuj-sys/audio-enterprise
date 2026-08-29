export type ProductTag =
'new' |
'bestseller' |
'popular' |
'professional' |
'budget' |
'sale';

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
  availability: 'In Stock' | 'Limited Stock' | 'Made To Order';
  tags: ProductTag[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export type InquiryStatus =
'New' |
'Contacted' |
'Follow Up' |
'Converted' |
'Closed';

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