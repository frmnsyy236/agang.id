export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  notes?: string;
}

export interface OrderCustomerData {
  name: string;
  phone: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryZone?: string;
  shippingFee?: number;
  address: string;
  landmark?: string;
  outlet: 'pongtiku' | 'inpres_maccini';
  paymentMethod: 'qris' | 'transfer' | 'cash';
  notes?: string;
}

export interface OrderRecord {
  id: string;
  customer: OrderCustomerData;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}
