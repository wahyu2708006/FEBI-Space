export type MenuCategory = 'All' | 'Coffee' | 'Non-Coffee' | 'Food' | 'Pastry';

export interface MenuItem {
  id: string;
  name: string;
  category: 'Coffee' | 'Non-Coffee' | 'Food' | 'Pastry';
  price: number;
  description: string;
  image: string;
  featured: boolean;
  badge?: 'Signature' | 'Bestseller' | 'Seasonal' | 'Barista Choice' | 'Chef Pick';
  tags?: string[];
  temperature?: 'Hot' | 'Iced' | 'Both';
  tastingNotes?: string[];
  prepTime?: string;
}

export interface OrderCustomization {
  temperature?: 'Iced' | 'Hot';
  sweetness?: 'Normal (100%)' | 'Less Sugar (50%)' | 'No Sugar (0%)';
  milk?: 'Regular Milk' | 'Oat Milk (+Rp 6.000)' | 'Almond Milk (+Rp 7.000)';
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string; // unique key combining item id and customizations
  menuItem: MenuItem;
  quantity: number;
  customization: OrderCustomization;
  itemPrice: number; // base price + extras
  totalPrice: number;
}

export type OrderStatus = 'Diterima' | 'Sedang Diseduh' | 'Siap Disajikan' | 'Selesai';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  serviceType: 'Dine In' | 'Takeaway' | 'Delivery';
  tableOrAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  notes?: string;
  paymentMethod: 'QRIS' | 'Kasir (Tunai/Kartu)' | 'Transfer Bank BCA';
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  favoriteItem: string;
  verified: boolean;
}

export interface CollaborationInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: 'Workshop & Kelas Kreatif' | 'Private Meeting / Event' | 'Pameran Seni & Display' | 'Kemitraan Kopi / B2B';
  date?: string;
  estimatedGuests?: string;
  message: string;
  createdAt: string;
}
