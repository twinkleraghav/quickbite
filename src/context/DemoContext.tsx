import React, { createContext, useContext, useState, useEffect } from 'react';
import type { MenuItem, CartItem, DeliveryDetails, Order, OrderStatus, AppView, UMLNodeType } from '../types';

interface DemoContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  packagingFee: number;
  total: number;
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: React.Dispatch<React.SetStateAction<DeliveryDetails>>;
  fillSampleDetails: () => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activeUmlNode: UMLNodeType;
  setActiveUmlNode: (node: UMLNodeType) => void;
  currentOrder: Order | null;
  orders: Order[];
  paymentError: string | null;
  paymentAttempts: number;
  simulatePayment: (outcome: 'success' | 'failure') => void;
  retryPayment: () => void;
  cancelPaymentAttempt: () => void;
  advanceOrderStatus: () => void;
  cancelOrder: (reason?: string) => boolean;
  resetDemo: () => void;
  isUmlPanelOpen: boolean;
  setIsUmlPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  umlExplanation: string;
}

const DEFAULT_DELIVERY: DeliveryDetails = {
  fullName: 'Aarav Sharma',
  phone: '9876543210',
  address: 'Room 304, Kaveri Hostel, North Campus',
  landmark: 'Near Central Library & Cafeteria',
  instructions: 'Please call once arrived at hostel main gate.',
  deliveryType: 'standard'
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'quickbite_demo_state_v1';

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_delivery');
      return saved ? JSON.parse(saved) : DEFAULT_DELIVERY;
    } catch {
      return DEFAULT_DELIVERY;
    }
  });

  const [currentView, setCurrentView] = useState<AppView>('menu');
  const [activeUmlNode, setActiveUmlNode] = useState<UMLNodeType>('initial_node');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_currentOrder');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentAttempts, setPaymentAttempts] = useState<number>(0);
  const [isUmlPanelOpen, setIsUmlPanelOpen] = useState<boolean>(true);

  // Synchronize localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY + '_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY + '_delivery', JSON.stringify(deliveryDetails));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [deliveryDetails]);

  useEffect(() => {
    try {
      if (currentOrder) {
        localStorage.setItem(LOCAL_STORAGE_KEY + '_currentOrder', JSON.stringify(currentOrder));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY + '_currentOrder');
      }
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [currentOrder]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY + '_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [orders]);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 35;
  const packagingFee = subtotal === 0 ? 0 : 15;
  const total = subtotal + tax + deliveryFee + packagingFee;

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItem.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
    setActiveUmlNode('add_to_cart');
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(i => {
          if (i.menuItem.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter((i): i is CartItem => i !== null);
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.menuItem.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const fillSampleDetails = () => {
    setDeliveryDetails(DEFAULT_DELIVERY);
  };

  // Payment Simulation
  const simulatePayment = (outcome: 'success' | 'failure') => {
    setActiveUmlNode('process_payment');
    const newAttemptCount = paymentAttempts + 1;
    setPaymentAttempts(newAttemptCount);

    if (outcome === 'success') {
      setPaymentError(null);
      const newOrderId = `QB-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newOrder: Order = {
        id: newOrderId,
        createdAt: now,
        items: [...cart],
        deliveryDetails: { ...deliveryDetails },
        subtotal,
        tax,
        deliveryFee,
        packagingFee,
        total,
        paymentStatus: 'PAID',
        paymentMethod: 'Simulated UPI (Fast Pay)',
        paymentAttempts: newAttemptCount,
        orderStatus: 'Placed',
        statusHistory: [
          { status: 'Placed', timestamp: now, note: 'Order placed and payment authorized.' }
        ]
      };

      setCurrentOrder(newOrder);
      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      setCurrentView('confirmation');
      setActiveUmlNode('order_created');
    } else {
      setPaymentError(`Payment Gateway Declined: Simulation test failure (Attempt #${newAttemptCount}). Authorization token expired.`);
      setActiveUmlNode('payment_failed');
    }
  };

  const retryPayment = () => {
    setPaymentError(null);
    setActiveUmlNode('process_payment');
  };

  const cancelPaymentAttempt = () => {
    setPaymentError(null);
    setActiveUmlNode('cancel_payment');
    setCurrentView('cart');
  };

  // Order Status Stepper
  const statusProgression: OrderStatus[] = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

  const advanceOrderStatus = () => {
    setCurrentOrder(prev => {
      if (!prev) return null;
      const currentIndex = statusProgression.indexOf(prev.orderStatus);
      if (currentIndex === -1 || currentIndex >= statusProgression.length - 1) return prev;

      const nextStatus = statusProgression[currentIndex + 1];
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      let note = '';
      switch (nextStatus) {
        case 'Confirmed':
          note = 'Restaurant accepted and confirmed order.';
          break;
        case 'Preparing':
          note = 'Kitchen is cooking and packing your meal.';
          break;
        case 'Out for Delivery':
          note = 'Assigned delivery partner picked up the package.';
          break;
        case 'Delivered':
          note = 'Order safely delivered to recipient. Enjoy your food!';
          break;
      }

      const updatedOrder: Order = {
        ...prev,
        orderStatus: nextStatus,
        statusHistory: [
          ...prev.statusHistory,
          { status: nextStatus, timestamp: now, note }
        ]
      };

      setOrders(ordersList => ordersList.map(o => o.id === updatedOrder.id ? updatedOrder : o));

      if (nextStatus === 'Delivered') {
        setActiveUmlNode('delivered');
      } else {
        setActiveUmlNode('advance_status');
      }

      return updatedOrder;
    });
  };

  const cancelOrder = (reason = 'Cancelled by customer'): boolean => {
    if (!currentOrder) return false;
    // Guard condition: cancellation only permitted if Placed or Confirmed
    if (currentOrder.orderStatus !== 'Placed' && currentOrder.orderStatus !== 'Confirmed') {
      return false;
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatedOrder: Order = {
      ...currentOrder,
      orderStatus: 'Cancelled',
      statusHistory: [
        ...currentOrder.statusHistory,
        { status: 'Cancelled', timestamp: now, note: reason }
      ]
    };

    setCurrentOrder(updatedOrder);
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setActiveUmlNode('cancel_order');
    return true;
  };

  const resetDemo = () => {
    setCart([]);
    setCurrentOrder(null);
    setOrders([]);
    setDeliveryDetails(DEFAULT_DELIVERY);
    setPaymentError(null);
    setPaymentAttempts(0);
    setCurrentView('menu');
    setActiveUmlNode('initial_node');
    localStorage.removeItem(LOCAL_STORAGE_KEY + '_cart');
    localStorage.removeItem(LOCAL_STORAGE_KEY + '_currentOrder');
    localStorage.removeItem(LOCAL_STORAGE_KEY + '_orders');
  };

  // Generate dynamic UML explanation based on active node
  let umlExplanation = '';
  switch (activeUmlNode) {
    case 'initial_node':
      umlExplanation = 'Initial Node (●): Entry point of the activity diagram representing the start of the ordering process.';
      break;
    case 'browse_menu':
      umlExplanation = 'Action Node: Customer browses through the restaurant catalog and dish categories.';
      break;
    case 'select_items':
      umlExplanation = 'Action Node: Customer inspects food items, descriptions, and pricing in Indian Rupees (₹).';
      break;
    case 'add_to_cart':
      umlExplanation = 'Action Node: Item added to the active cart state; subtotal and taxes recomputed.';
      break;
    case 'decision_cart_empty':
      umlExplanation = 'Decision Node (◇): Evaluates guard condition [Is Cart Empty?]. If Yes → loop back to browse; if No → proceed to review cart.';
      break;
    case 'review_cart':
      umlExplanation = 'Action Node: Customer reviews selected items, adjusts quantities, and verifies fees.';
      break;
    case 'enter_delivery':
      umlExplanation = 'Action Node: Customer enters name, contact number, and hostel/apartment delivery address.';
      break;
    case 'place_order':
      umlExplanation = 'Action Node: Customer submits order details to trigger the payment gateway transaction.';
      break;
    case 'process_payment':
      umlExplanation = 'Action Node: Simulation of payment processing (Simulated UPI / Gateway verification).';
      break;
    case 'decision_payment':
      umlExplanation = 'Decision Node (◇): Guard condition [Was Payment Successful?]. Branches into [Success] or [Failure].';
      break;
    case 'order_created':
      umlExplanation = 'Action Node: Unique Order ID generated; order recorded with payment status PAID; cart cleared.';
      break;
    case 'track_order':
      umlExplanation = 'Action Node: Live simulated tracking interface displays lifecycle progress.';
      break;
    case 'advance_status':
      umlExplanation = 'Action Node: Presenter manually transitions lifecycle (Placed → Confirmed → Preparing → Out for Delivery).';
      break;
    case 'delivered':
      umlExplanation = 'Activity Final Node (⦿): Order fulfilled successfully; activity completes normally.';
      break;
    case 'payment_failed':
      umlExplanation = 'Action Node: Payment error displayed with reason; triggers retry decision.';
      break;
    case 'decision_retry':
      umlExplanation = 'Decision Node (◇): Guard condition [Retry Payment?]. If [Yes] → control loop re-enters payment action; if [No] → cancel payment attempt.';
      break;
    case 'cancel_payment':
      umlExplanation = 'Action Node: Customer aborts payment attempt; no duplicate order created; cart preserved.';
      break;
    case 'cancel_order':
      umlExplanation = 'Action Node: Guarded order cancellation branch (valid only during early states Placed/Confirmed). Leads to Activity Final (⦿).';
      break;
    case 'activity_final':
      umlExplanation = 'Activity Final Node (⦿): Terminal state terminating the entire activity execution.';
      break;
  }

  return (
    <DemoContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        tax,
        deliveryFee,
        packagingFee,
        total,
        deliveryDetails,
        setDeliveryDetails,
        fillSampleDetails,
        currentView,
        setCurrentView,
        activeUmlNode,
        setActiveUmlNode,
        currentOrder,
        orders,
        paymentError,
        paymentAttempts,
        simulatePayment,
        retryPayment,
        cancelPaymentAttempt,
        advanceOrderStatus,
        cancelOrder,
        resetDemo,
        isUmlPanelOpen,
        setIsUmlPanelOpen,
        umlExplanation
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
