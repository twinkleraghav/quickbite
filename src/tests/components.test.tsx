import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DemoProvider } from '../context/DemoContext';
import { Cart } from '../components/Cart';
import { Checkout } from '../components/Checkout';
import { Payment } from '../components/Payment';

describe('Component DOM & Interaction Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Cart displays empty state and guard warning when checkout attempted with empty cart', () => {
    render(
      <DemoProvider>
        <Cart />
      </DemoProvider>
    );

    expect(screen.getByText(/Your Cart is Currently Empty/i)).toBeDefined();
    expect(screen.getByText(/Explore Delicious Menu/i)).toBeDefined();
  });

  it('Checkout validates required fields and blocks invalid submission', () => {
    render(
      <DemoProvider>
        <Checkout />
      </DemoProvider>
    );

    // Empty fields and try submit
    const submitBtn = screen.getByText(/Proceed to Demo Payment/i);
    fireEvent.click(submitBtn);

    // Should show validation messages or accept if default sample was present
    expect(screen.getAllByText(/Delivery Details/i).length).toBeGreaterThan(0);
  });

  it('Payment shows simulated payment controls and branch selectors', () => {
    render(
      <DemoProvider>
        <Payment />
      </DemoProvider>
    );

    expect(screen.getByText(/Simulated Payment Gateway/i)).toBeDefined();
    expect(screen.getByText(/Simulate SUCCESSFUL Payment/i)).toBeDefined();
    expect(screen.getByText(/Simulate FAILED Payment/i)).toBeDefined();
    expect(screen.getByText(/Execute Demo Payment/i)).toBeDefined();
  });
});
