import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Receipt, 
  Info,
  AlertCircle
} from 'lucide-react';

export const Cart: React.FC = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    tax, 
    deliveryFee, 
    packagingFee, 
    total, 
    setCurrentView,
    setActiveUmlNode
  } = useDemo();

  const [emptyCartAlert, setEmptyCartAlert] = useState(false);

  const handleProceedToCheckout = () => {
    // UML Guard Condition Check: [Is Cart Empty?]
    setActiveUmlNode('decision_cart_empty');

    if (cart.length === 0) {
      setEmptyCartAlert(true);
      // Guard condition [Yes]: returns to browse menu
      setTimeout(() => {
        setActiveUmlNode('browse_menu');
      }, 1500);
      return;
    }

    // Guard condition [No]: proceed to review & checkout
    setActiveUmlNode('enter_delivery');
    setCurrentView('checkout');
  };

  const handleReturnToMenu = () => {
    setCurrentView('menu');
    setActiveUmlNode('browse_menu');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleReturnToMenu}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Browsing Menu</span>
        </button>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-750 transition flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {/* Empty Cart Guard Alert if triggered */}
      {emptyCartAlert && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start space-x-3 text-rose-900 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-rose-950">
              UML Guard Condition Triggered: [Is Cart Empty? = YES]
            </h4>
            <p className="leading-relaxed text-rose-800">
              Checkout cannot proceed with an empty cart. According to the UML Activity Diagram specification, this decision branch returns the customer flow to <b>Browse Menu</b>.
            </p>
          </div>
        </div>
      )}

      {cart.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-stone-900">Your Cart is Currently Empty</h2>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Please add at least one item from the menu to proceed through the UML ordering workflow.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleReturnToMenu}
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition cursor-pointer"
            >
              Explore Delicious Menu
            </button>
          </div>

          <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400">
            UML Spec: Guard condition <code>[Cart Empty? = Yes]</code> redirects back to <i>Browse Menu</i> action node.
          </div>
        </div>
      ) : (
        /* Active Cart View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items List (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-stone-900 flex items-center justify-between border-b border-stone-100 pb-3">
                <span>Selected Items ({cart.length})</span>
                <span className="text-xs text-stone-500 font-normal">Review before checkout</span>
              </h2>

              <div className="divide-y divide-stone-100">
                {cart.map(item => (
                  <div key={item.menuItem.id} className="py-3.5 flex items-center justify-between gap-3 first:pt-1 last:pb-1">
                    {/* Item info & thumb */}
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {item.menuItem.name}
                        </h4>
                        <span className="text-stone-500 text-[11px]">
                          ₹{item.menuItem.price} each
                        </span>
                        <div className="text-xs font-extrabold text-orange-700 mt-0.5">
                          ₹{item.menuItem.price * item.quantity}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="flex items-center space-x-1.5 bg-stone-100 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, -1)}
                          className="p-1 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, 1)}
                          className="p-1 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.menuItem.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UML Activity Mapping Info Box */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>UML Activity Spec:</strong> Currently at <i>Review Cart</i> action node. Clicking &ldquo;Proceed to Checkout&rdquo; traverses control flow along guard condition <code>[Is Cart Empty? = NO]</code> into <i>Enter Delivery Details</i>.
              </div>
            </div>
          </div>

          {/* Bill Summary (1 col) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center space-x-1.5">
                <Receipt className="w-4 h-4 text-orange-600" />
                <span>Order Summary</span>
              </h3>

              <div className="space-y-2 text-xs border-b border-stone-100 pb-3">
                <div className="flex justify-between text-stone-600">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Taxes &amp; GST (5%)</span>
                  <span className="font-semibold text-stone-900">₹{tax}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Partner Fee</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[10px] text-stone-400">
                    Add ₹{Math.max(0, 500 - subtotal)} more for free delivery!
                  </p>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Restaurant Packaging Fee</span>
                  <span className="font-semibold text-stone-900">₹{packagingFee}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Total Payable</span>
                  <span className="text-[10px] text-stone-400">Inclusive of all taxes</span>
                </div>
                <span className="text-xl font-extrabold text-stone-900">₹{total}</span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-stone-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulated demo checkout – safe &amp; free</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
