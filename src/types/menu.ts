export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceDisplay?: string;
  image: string;
  category: 'ricebowl' | 'taiwan' | 'dimsum' | string;
  isPopular?: boolean;
  isNew?: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItemInput {
  name: string;
  description: string;
  price: number;
  priceDisplay?: string;
  image: string;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
  order?: number;
}
