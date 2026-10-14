import React, { useState, useMemo } from 'react';
import { useDemo } from '../context/DemoContext';
import { MENU_ITEMS } from '../data/menu';
import type { Category, MenuItem } from '../types';
import { 
  Search, 
  Clock, 
  Star, 
  Plus, 
  Minus, 
  Flame, 
  ArrowRight,
  X,
  Check,
  Info
} from 'lucide-react';

const CATEGORIES: Category[] = ['All', 'Pizza', 'Burgers', 'Indian', 'Snacks', 'Beverages'];

const POPULAR_SEARCH_SUGGESTIONS = ['Pizza', 'Biryani', 'Burger', 'Paneer', 'Chicken', 'Fries', 'Coffee', 'Mojito'];

export const Menu: React.FC = () => {
  const { cart, addToCart, updateQuantity, setCurrentView, setActiveUmlNode } = useDemo();
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  // Dietary filter: 'all' | 'veg' | 'non-veg'
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Handle clicking category with smart auto-switch for dietary filter
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setActiveUmlNode('browse_menu');

    // If selecting a category (like Beverages) that has 0 items for current dietary filter,
    // automatically switch dietaryFilter to 'all' so items are immediately visible!
    if (category !== 'All' && dietaryFilter !== 'all') {
      const itemsInCat = MENU_ITEMS.filter(item => item.category === category);
      const hasMatchingDiet = itemsInCat.some(item => 
        dietaryFilter === 'veg' ? item.isVeg : !item.isVeg
      );
      if (!hasMatchingDiet) {
        setDietaryFilter('all');
      }
    }
  };

  // Filter items intelligently with fallback recommendations so screen is NEVER empty!
  const { filteredItems, noticeMessage } = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    const queryTokens = rawQuery.split(/\s+/).filter(Boolean);

    const matchesItem = (item: MenuItem, query: string, tokens: string[]) => {
      if (!query) return true;

      // Check direct name, category, description, tags
      const inName = item.name.toLowerCase().includes(query);
      const inCategory = item.category.toLowerCase().includes(query);
      const inDesc = item.description.toLowerCase().includes(query);
      const inTags = item.tags ? item.tags.some(t => t.toLowerCase().includes(query)) : false;

      if (inName || inCategory || inDesc || inTags) return true;

      // Check token match
      const matchesAllTokens = tokens.every(token => {
        if (token === 'veg' || token === 'vegetarian') return item.isVeg === true;
        if (token === 'non-veg' || token === 'nonveg' || token === 'meat' || token === 'chicken') return item.isVeg === false;
        return (
          item.name.toLowerCase().includes(token) ||
          item.category.toLowerCase().includes(token) ||
          item.description.toLowerCase().includes(token) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(token)))
        );
      });

      return matchesAllTokens;
    };

    const matchesDiet = (item: MenuItem, filter: 'all' | 'veg' | 'non-veg') => {
      if (filter === 'veg') return item.isVeg === true;
      if (filter === 'non-veg') return item.isVeg === false;
      return true;
    };

    // Step 1: Strict match with selected category and dietary filter
    let items = MENU_ITEMS.filter(item => {
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = matchesItem(item, rawQuery, queryTokens);
      const matchDiet = matchesDiet(item, dietaryFilter);
      return matchCategory && matchSearch && matchDiet;
    });

    if (items.length > 0) {
      return { filteredItems: items, noticeMessage: null, isFallback: false };
    }

    // Step 2: If 0 items because selectedCategory has 0 items for current dietary filter (e.g. Beverages + Non-Veg)
    if (selectedCategory !== 'All' && !rawQuery) {
      const categoryItemsAll = MENU_ITEMS.filter(item => item.category === selectedCategory);
      if (categoryItemsAll.length > 0) {
        return {
          filteredItems: categoryItemsAll,
          noticeMessage: `Notice: All ${selectedCategory} are 100% vegetarian. Showing all delicious ${selectedCategory} below:`,
          isFallback: true
        };
      }
    }

    // Step 3: If search query caused 0 items within selectedCategory, search across ALL categories
    if (rawQuery && selectedCategory !== 'All') {
      const allCategoryItems = MENU_ITEMS.filter(item => {
        return matchesItem(item, rawQuery, queryTokens) && matchesDiet(item, dietaryFilter);
      });
      if (allCategoryItems.length > 0) {
        return {
          filteredItems: allCategoryItems,
          noticeMessage: `Showing matching dishes across all categories for "${searchQuery}":`,
          isFallback: true
        };
      }
    }

    // Step 4: If still 0 items because of strict dietary filter, relax dietary filter
    if (rawQuery && dietaryFilter !== 'all') {
      const relaxedDietItems = MENU_ITEMS.filter(item => {
        return matchesItem(item, rawQuery, queryTokens);
      });
      if (relaxedDietItems.length > 0) {
        return {
          filteredItems: relaxedDietItems,
          noticeMessage: `Showing all dishes matching "${searchQuery}":`,
          isFallback: true
        };
      }
    }

    // Step 5: Partial token / related fallback
    if (rawQuery) {
      const partialMatches = MENU_ITEMS.filter(item => {
        return queryTokens.some(token => 
          item.name.toLowerCase().includes(token) ||
          item.category.toLowerCase().includes(token) ||
          item.description.toLowerCase().includes(token) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(token)))
        );
      });
      if (partialMatches.length > 0) {
        return {
          filteredItems: partialMatches,
          noticeMessage: `Showing closest related dishes for "${searchQuery}":`,
          isFallback: true
        };
      }
    }

    // Step 6: NEVER LEAVE THE SCREEN EMPTY!
    // Show popular chef recommendations
    const recommendations = MENU_ITEMS.slice(0, 6);
    return {
      filteredItems: recommendations,
      noticeMessage: `No exact dish named "${searchQuery}". Showing our most popular customer favorites below:`,
      isFallback: true
    };
  }, [selectedCategory, searchQuery, dietaryFilter]);

  const getItemQuantityInCart = (itemId: string) => {
    const found = cart.find(i => i.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  const handleItemSelect = (item: MenuItem) => {
    addToCart(item);
  };

  const handleViewCart = () => {
    setCurrentView('cart');
    setActiveUmlNode('decision_cart_empty');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalVegCount = MENU_ITEMS.filter(i => i.isVeg).length;
  const totalNonVegCount = MENU_ITEMS.filter(i => !i.isVeg).length;

  return (
    <div className="space-y-6">
      {/* Hero Presentation Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-orange-950 to-stone-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs border border-orange-500/30">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Interactive Food Delivery Prototype</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Delicious meals delivered, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400">
              UML workflow demonstrated.
            </span>
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl">
            Select items to simulate an end-to-end customer journey. Watch how each user action maps live to actions, decisions, and guard conditions in the UML Activity Diagram.
          </p>

          {/* Quick Action bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                addToCart(MENU_ITEMS[0]); // Margherita Pizza (Veg)
                addToCart(MENU_ITEMS[6]); // Chicken Dum Biryani (Non-Veg)
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30 transition flex items-center space-x-2 cursor-pointer"
            >
              <span>+ Quick Add Top 2 Items (Veg &amp; Non-Veg)</span>
            </button>
            {totalCartCount > 0 && (
              <button
                onClick={handleViewCart}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-stone-900 hover:bg-stone-100 transition flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <span>Review Cart ({totalCartCount})</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
              </button>
            )}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 bg-radial from-orange-500 to-transparent pointer-events-none" />
      </div>

      {/* Filters and Search Bar Section */}
      <div className="space-y-3.5 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs">
        {/* Row 1: Search Bar and Dietary Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, category, or ingredients (e.g. pizza, biryani, paneer, chicken, mojito, coffee)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Dietary Filter Buttons */}
          <div className="flex items-center space-x-2 bg-stone-100/80 p-1 rounded-xl self-start sm:self-auto shrink-0 border border-stone-200/60">
            {/* All Dishes */}
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                dietaryFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>All Dishes</span>
            </button>

            {/* Pure Veg Button */}
            <button
              onClick={() => setDietaryFilter(prev => prev === 'veg' ? 'all' : 'veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-200'
                  : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
              }`}
              title="Filter Pure Vegetarian Dishes"
            >
              <span className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 ${
                dietaryFilter === 'veg' ? 'border-white' : 'border-emerald-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  dietaryFilter === 'veg' ? 'bg-white' : 'bg-emerald-600'
                }`} />
              </span>
              <span>Pure Veg</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                dietaryFilter === 'veg' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {totalVegCount}
              </span>
              {dietaryFilter === 'veg' && <Check className="w-3 h-3 ml-0.5" />}
            </button>

            {/* Non-Veg Button */}
            <button
              onClick={() => setDietaryFilter(prev => prev === 'non-veg' ? 'all' : 'non-veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
                dietaryFilter === 'non-veg'
                  ? 'bg-rose-700 text-white border-rose-700 shadow-sm shadow-rose-700/30 ring-2 ring-rose-200'
                  : 'bg-white text-rose-800 border-rose-300 hover:bg-rose-50'
              }`}
              title="Filter Non-Vegetarian Dishes"
            >
              <span className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 ${
                dietaryFilter === 'non-veg' ? 'border-white' : 'border-rose-700'
              }`}>
                <span className={`w-1.5 h-1.5 transform rotate-45 ${
                  dietaryFilter === 'non-veg' ? 'bg-white' : 'bg-rose-700'
                }`} />
              </span>
              <span>Non-Veg</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                dietaryFilter === 'non-veg' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'
              }`}>
                {totalNonVegCount}
              </span>
              {dietaryFilter === 'non-veg' && <Check className="w-3 h-3 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Row 2: Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleSelectCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white shadow-orange-600/20 shadow-md font-bold'
                  : 'bg-stone-50 text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Fallback or Notification Banner if any filter was auto-relaxed */}
        {noticeMessage && (
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{noticeMessage}</span>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setDietaryFilter('all');
                setSelectedCategory('All');
              }}
              className="text-amber-800 font-bold underline ml-2 shrink-0 hover:text-amber-950 cursor-pointer text-[11px]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Active Filter Summary / Search Suggestions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100 text-[11px] text-stone-500">
          <div className="flex items-center space-x-2">
            <span>
              Showing <strong className="text-stone-900">{filteredItems.length}</strong> items
              {selectedCategory !== 'All' && (
                <span> in <strong className="text-orange-700">{selectedCategory}</strong></span>
              )}
              {dietaryFilter !== 'all' && (
                <span> • <strong className={dietaryFilter === 'veg' ? 'text-emerald-700' : 'text-rose-700'}>
                  {dietaryFilter === 'veg' ? 'Pure Veg Only' : 'Non-Veg Only'}
                </strong></span>
              )}
              {searchQuery && (
                <span> matching &ldquo;<strong className="text-stone-800">{searchQuery}</strong>&rdquo;</span>
              )}
            </span>

            {(searchQuery || dietaryFilter !== 'all' || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDietaryFilter('all');
                  setSelectedCategory('All');
                }}
                className="text-orange-600 hover:text-orange-800 font-bold underline ml-1 cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Quick search suggestion pills */}
          {!searchQuery && (
            <div className="hidden sm:flex items-center space-x-1.5 text-[11px]">
              <span className="text-stone-400">Try searching:</span>
              {POPULAR_SEARCH_SUGGESTIONS.slice(0, 6).map(term => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-2 py-0.5 bg-stone-100 hover:bg-orange-100 hover:text-orange-700 text-stone-600 rounded-md transition cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu Items Grid - ALWAYS SHOWS DISHES, NEVER BLANK! */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredItems.map(item => {
          const qty = getItemQuantityInCart(item.id);

          return (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-lg hover:border-orange-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Item Image with Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  
                  {/* Veg / Non-Veg Indicator Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-lg shadow-sm flex items-center space-x-1.5 border border-stone-200/60">
                    <span 
                      className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
                        item.isVeg ? 'border-emerald-600' : 'border-rose-700'
                      }`}
                    >
                      <span 
                        className={`w-2 h-2 ${
                          item.isVeg ? 'rounded-full bg-emerald-600' : 'bg-rose-700 transform rotate-45'
                        }`} 
                      />
                    </span>
                    <span className={`text-[10px] font-bold ${
                      item.isVeg ? 'text-emerald-800' : 'text-rose-800'
                    }`}>
                      {item.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                  </div>

                  {/* Rating & Prep Time */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                    <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{item.rating}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-xs">
                    <Clock className="w-3 h-3 text-stone-500" />
                    <span>{item.preparationTime}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-stone-900 text-sm leading-snug group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Keyword tag badges */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.slice(0, 3).map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="text-[9px] bg-stone-100 text-stone-500 px-1.5 py-0.2 rounded font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block -mb-0.5">Price</span>
                  <span className="text-base font-extrabold text-stone-900">₹{item.price}</span>
                </div>

                {qty === 0 ? (
                  <button
                    onClick={() => handleItemSelect(item)}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 hover:border-orange-600 font-bold text-xs flex items-center space-x-1 transition shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 bg-orange-600 text-white rounded-xl px-2 py-1 shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:bg-orange-700 rounded-lg transition"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{qty}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:bg-orange-700 rounded-lg transition"
                      title="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
