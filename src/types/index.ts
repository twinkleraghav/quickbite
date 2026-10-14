export type Category = 'All' | 'Pizza' | 'Burgers' | 'Indian' | 'Snacks' | 'Beverages';

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  rating: number;
  preparationTime: string;
  tags?: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  address: string;
  landmark?: string;
  instructions?: string;
  deliveryType: 'standard' | 'express';
}

export type OrderStatus = 'Placed' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  deliveryDetails: DeliveryDetails;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  packagingFee: number;
  total: number;
  paymentStatus: 'PAID' | 'FAILED' | 'CANCELLED';
  paymentMethod: string;
  paymentAttempts: number;
  orderStatus: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string; note: string }[];
}

export type AppView = 'menu' | 'cart' | 'checkout' | 'payment' | 'confirmation' | 'tracking';

export type UMLNodeType = 
  | 'initial_node'
  | 'browse_menu'
  | 'select_items'
  | 'add_to_cart'
  | 'decision_cart_empty'
  | 'review_cart'
  | 'enter_delivery'
  | 'place_order'
  | 'process_payment'
  | 'decision_payment'
  | 'order_created'
  | 'track_order'
  | 'advance_status'
  | 'delivered'
  | 'payment_failed'
  | 'decision_retry'
  | 'cancel_payment'
  | 'cancel_order'
  | 'activity_final';
