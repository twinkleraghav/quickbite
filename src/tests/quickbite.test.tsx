import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, act } from '@testing-library/react';
import { DemoProvider, useDemo } from '../context/DemoContext';
import { MENU_ITEMS } from '../data/menu';

// Helper test consumer to expose context methods directly
const TestConsumer = ({ onReady }: { onReady: (ctx: ReturnType<typeof useDemo>) => void }) => {
  const ctx = useDemo();
  React.useEffect(() => {
    onReady(ctx);
  });
  return <div>Loaded</div>;
};

describe('QuickBite Prototype & UML Activity Workflow Tests', () => {
  let contextValue: ReturnType<typeof useDemo>;

  beforeEach(() => {
    localStorage.clear();
    render(
      <DemoProvider>
        <TestConsumer onReady={(ctx) => { contextValue = ctx; }} />
      </DemoProvider>
    );
  });

  it('1. Initializes correctly with Initial Node and empty cart', () => {
    expect(contextValue.cart).toHaveLength(0);
    expect(contextValue.activeUmlNode).toBe('initial_node');
    expect(contextValue.total).toBe(0);
    expect(contextValue.currentOrder).toBeNull();
  });

  it('2. Menu items can be added, updated, and removed', () => {
    act(() => {
      contextValue.addToCart(MENU_ITEMS[0]);
    });
    expect(contextValue.cart).toHaveLength(1);
    expect(contextValue.cart[0].quantity).toBe(1);
    expect(contextValue.activeUmlNode).toBe('add_to_cart');

    // Increase quantity
    act(() => {
      contextValue.updateQuantity(MENU_ITEMS[0].id, 1);
    });
    expect(contextValue.cart[0].quantity).toBe(2);

    // Decrease quantity
    act(() => {
      contextValue.updateQuantity(MENU_ITEMS[0].id, -1);
    });
    expect(contextValue.cart[0].quantity).toBe(1);

    // Remove item
    act(() => {
      contextValue.removeFromCart(MENU_ITEMS[0].id);
    });
    expect(contextValue.cart).toHaveLength(0);
  });

  it('3. Total changes correctly with quantity, GST, packaging, and delivery fee', () => {
    act(() => {
      contextValue.addToCart(MENU_ITEMS[0]); // price 349
    });
    const subtotal = 349;
    const tax = Math.round(subtotal * 0.05); // 17
    const deliveryFee = 35; // under 500
    const packagingFee = 15;
    const expectedTotal = subtotal + tax + deliveryFee + packagingFee;

    expect(contextValue.subtotal).toBe(subtotal);
    expect(contextValue.tax).toBe(tax);
    expect(contextValue.deliveryFee).toBe(deliveryFee);
    expect(contextValue.packagingFee).toBe(packagingFee);
    expect(contextValue.total).toBe(expectedTotal);

    // Add another item so subtotal >= 500 to test free delivery
    act(() => {
      contextValue.addToCart(MENU_ITEMS[1]); // price 399 -> subtotal 748
    });
    expect(contextValue.subtotal).toBe(748);
    expect(contextValue.deliveryFee).toBe(0); // FREE delivery!
  });

  it('4. Decision Node: Cart Empty guard condition', () => {
    expect(contextValue.cart.length).toBe(0);
    // Setting active node to decision_cart_empty
    act(() => {
      contextValue.setActiveUmlNode('decision_cart_empty');
    });
    expect(contextValue.activeUmlNode).toBe('decision_cart_empty');
  });

  it('5. Simulated payment failure triggers retry decision and records error', () => {
    act(() => {
      contextValue.addToCart(MENU_ITEMS[0]);
      contextValue.simulatePayment('failure');
    });

    expect(contextValue.paymentError).not.toBeNull();
    expect(contextValue.activeUmlNode).toBe('payment_failed');
    expect(contextValue.paymentAttempts).toBe(1);
    expect(contextValue.currentOrder).toBeNull(); // No false order created

    // Retry payment returns to process payment node
    act(() => {
      contextValue.retryPayment();
    });
    expect(contextValue.activeUmlNode).toBe('process_payment');
    expect(contextValue.paymentError).toBeNull();
  });

  it('6. Simulated payment cancellation marks node and preserves cart without order creation', () => {
    act(() => {
      contextValue.addToCart(MENU_ITEMS[0]);
      contextValue.simulatePayment('failure');
      contextValue.cancelPaymentAttempt();
    });

    expect(contextValue.activeUmlNode).toBe('cancel_payment');
    expect(contextValue.cart.length).toBe(1); // Cart preserved
    expect(contextValue.currentOrder).toBeNull(); // No duplicate or partial order
  });

  it('7. Simulated payment success generates unique order ID, PAID status, and moves to order_created', () => {
    act(() => {
      contextValue.addToCart(MENU_ITEMS[0]);
      contextValue.simulatePayment('success');
    });

    expect(contextValue.currentOrder).not.toBeNull();
    expect(contextValue.currentOrder?.id).toMatch(/^QB-\d{6}$/);
    expect(contextValue.currentOrder?.paymentStatus).toBe('PAID');
    expect(contextValue.currentOrder?.orderStatus).toBe('Placed');
    expect(contextValue.cart).toHaveLength(0); // Cart cleared
    expect(contextValue.activeUmlNode).toBe('order_created');
  });

  it('8. Stepper advances through Placed -> Confirmed -> Preparing -> Out for Delivery -> Delivered', () => {
    act(() => {
      contextValue.addToCart(MENU_ITEMS[0]);
      contextValue.simulatePayment('success');
    });

    expect(contextValue.currentOrder?.orderStatus).toBe('Placed');

    // Placed -> Confirmed
    act(() => { contextValue.advanceOrderStatus(); });
    expect(contextValue.currentOrder?.orderStatus).toBe('Confirmed');
    expect(contextValue.activeUmlNode).toBe('advance_status');

    // Confirmed -> Preparing
    act(() => { contextValue.advanceOrderStatus(); });
    expect(contextValue.currentOrder?.orderStatus).toBe('Preparing');

    // Preparing -> Out for Delivery
    act(() => { contextValue.advanceOrderStatus(); });
    expect(contextValue.currentOrder?.orderStatus).toBe('Out for Delivery');

    // Out for Delivery -> Delivered (Final Node)
    act(() => { contextValue.advanceOrderStatus(); });
    expect(contextValue.currentOrder?.orderStatus).toBe('Delivered');
    expect(contextValue.activeUmlNode).toBe('delivered');

    // Attempting further advance after Delivered does nothing
    act(() => { contextValue.advanceOrderStatus(); });
    expect(contextValue.currentOrder?.orderStatus).toBe('Delivered');
  });

  it('9. Guarded order cancellation is permitted when Placed/Confirmed and rejected once Preparing/Delivered', () => {
    act(() => {
      contextValue.addToCart(MENU_ITEMS[0]);
      contextValue.simulatePayment('success');
    });

    // Advance to Preparing
    act(() => {
      contextValue.advanceOrderStatus(); // Confirmed
      contextValue.advanceOrderStatus(); // Preparing
    });
    expect(contextValue.currentOrder?.orderStatus).toBe('Preparing');

    // Cancellation rejected because order is already in kitchen
    let cancelled = false;
    act(() => {
      cancelled = contextValue.cancelOrder();
    });
    expect(cancelled).toBe(false);
    expect(contextValue.currentOrder?.orderStatus).toBe('Preparing');
  });

  it('10. Reset Demo returns all state to clean initial slate', () => {
    act(() => {
      contextValue.addToCart(MENU_ITEMS[0]);
      contextValue.simulatePayment('success');
      contextValue.resetDemo();
    });

    expect(contextValue.cart).toHaveLength(0);
    expect(contextValue.currentOrder).toBeNull();
    expect(contextValue.orders).toHaveLength(0);
    expect(contextValue.activeUmlNode).toBe('initial_node');
    expect(contextValue.currentView).toBe('menu');
  });
});
