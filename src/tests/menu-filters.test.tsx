import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { DemoProvider } from '../context/DemoContext';
import { Menu } from '../components/Menu';

describe('Menu Filters and Search Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('Toggling Pure Veg filter shows only vegetarian dishes and hides non-veg dishes', () => {
    render(
      <DemoProvider>
        <Menu />
      </DemoProvider>
    );

    // Click Pure Veg button
    const pureVegBtn = screen.getByRole('button', { name: /Pure Veg/i });
    fireEvent.click(pureVegBtn);

    // Verify Pure Veg filter state is active
    expect(screen.getByText(/Pure Veg Only/i)).toBeDefined();

    // Verify non-veg dishes are hidden
    expect(screen.queryByText(/Loaded Pepperoni & Smoked Chicken Pizza/i)).toBeNull();
    expect(screen.queryByText(/Royal Hyderabadi Dum Chicken Biryani/i)).toBeNull();

    // Verify veg dishes are visible
    expect(screen.getByText(/Classic Margherita Basil Pizza/i)).toBeDefined();
    expect(screen.getByText(/Paneer Butter Masala Meal Box/i)).toBeDefined();
  });

  it('Search filters items across names, categories, and tags', () => {
    render(
      <DemoProvider>
        <Menu />
      </DemoProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search by name, category, or ingredients/i);

    // Search for "biryani"
    fireEvent.change(searchInput, { target: { value: 'biryani' } });
    expect(screen.getByText(/Royal Hyderabadi Dum Chicken Biryani/i)).toBeDefined();
    expect(screen.queryByText(/Classic Margherita Basil Pizza/i)).toBeNull();

    // Search for "paneer"
    fireEvent.change(searchInput, { target: { value: 'paneer' } });
    expect(screen.getByText(/Spicy Farmhouse Paneer Pizza/i)).toBeDefined();
    expect(screen.getByText(/Paneer Butter Masala Meal Box/i)).toBeDefined();
    expect(screen.getByText(/Crisp Amritsari Paneer Pakora/i)).toBeDefined();

    // Search for "burger"
    fireEvent.change(searchInput, { target: { value: 'burger' } });
    expect(screen.getByText(/Classic Crispy Veggie Burger/i)).toBeDefined();
    expect(screen.getByText(/Smoked Barbecue Chicken Burger/i)).toBeDefined();
  });

  it('Search works even if a different category was selected by searching across all categories', () => {
    render(
      <DemoProvider>
        <Menu />
      </DemoProvider>
    );

    // Select category "Burgers"
    const burgersCategoryBtns = screen.getAllByRole('button', { name: /^Burgers$/i });
    fireEvent.click(burgersCategoryBtns[0]);

    // Search for "biryani" (which is in Indian category)
    const searchInput = screen.getByPlaceholderText(/Search by name, category, or ingredients/i);
    fireEvent.change(searchInput, { target: { value: 'biryani' } });

    // Should find the biryani through cross-category fallback
    expect(screen.getByText(/Royal Hyderabadi Dum Chicken Biryani/i)).toBeDefined();
    expect(screen.getByText(/across all categories/i)).toBeDefined();
  });

  it('Clicking Beverages always displays drinks even if Non-Veg was previously active', () => {
    render(
      <DemoProvider>
        <Menu />
      </DemoProvider>
    );

    // Turn ON Non-Veg filter
    const nonVegBtn = screen.getByTitle('Filter Non-Vegetarian Dishes');
    fireEvent.click(nonVegBtn);

    // Now click Beverages category
    const beveragesBtn = screen.getByRole('button', { name: /^Beverages$/i });
    fireEvent.click(beveragesBtn);

    // Beverages should be displayed, never empty!
    expect(screen.getByText(/Alphonso Mango Lassi/i)).toBeDefined();
    expect(screen.getByText(/Signature Cold Brew Coffee/i)).toBeDefined();
    expect(screen.getByText(/Fresh Mint Lime Mojito/i)).toBeDefined();
  });
});
