import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  RotateCcw, 
  GitBranch, 
  Truck,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide }) => {
  const { 
    cart, 
    setCurrentView, 
    currentView, 
    currentOrder, 
    resetDemo, 
    isUmlPanelOpen, 
    setIsUmlPanelOpen,
    setActiveUmlNode
  } = useDemo();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOpenCart = () => {
    setCurrentView('cart');
    setActiveUmlNode('decision_cart_empty');
  };

  const handleOpenTracking = () => {
    setCurrentView('tracking');
    setActiveUmlNode('track_order');
  };

  const handleResetConfirm = () => {
    resetDemo();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm transition-all">
        {/* Top presentation ribbon */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-[11px] py-1 px-4 text-center font-medium flex items-center justify-center space-x-2">
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Academic Prototype
          </span>
          <span>Software Engineering &amp; UML Activity Diagram Interactive Demonstration</span>
          <button 
            onClick={onOpenGuide}
            className="underline ml-2 hover:text-orange-100 font-semibold cursor-pointer"
          >
            Presenter Guide
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => {
              setCurrentView('menu');
              setActiveUmlNode('browse_menu');
            }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 flex items-center">
                Quick<span className="text-orange-600">Bite</span>
              </span>
              <span className="block text-[10px] text-gray-500 font-medium -mt-1">
                Online Food Delivery System
              </span>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Menu Link */}
            <button
              onClick={() => {
                setCurrentView('menu');
                setActiveUmlNode('browse_menu');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'menu'
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Browse Menu
            </button>

            {/* Active Order Tracking link if order exists */}
            {currentOrder && (
              <button
                onClick={handleOpenTracking}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  currentView === 'tracking'
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Track Order:</span>
                <span className="font-mono font-bold text-[11px]">{currentOrder.id}</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={handleOpenCart}
              className={`relative flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'cart'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  currentView === 'cart' ? 'bg-white text-orange-700' : 'bg-orange-600 text-white'
                }`}>
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* UML Panel Toggle */}
            <button
              onClick={() => setIsUmlPanelOpen(prev => !prev)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                isUmlPanelOpen
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
              title="Toggle UML Activity Diagram side-panel"
            >
              <GitBranch className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden md:inline">UML View</span>
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
              title="Reset application to clean initial demo state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-amber-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Reset Demo State?</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              This will clear the current cart, simulated orders, and reset the UML Activity Diagram to the <b>Initial Node (●)</b>.
            </p>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition"
              >
                Yes, Reset Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
