import React, { useEffect } from 'react';
import { useDemo } from '../context/DemoContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Truck, 
  Receipt, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  const { currentOrder, setCurrentView, setActiveUmlNode } = useDemo();

  useEffect(() => {
    // Launch a celebratory confetti blast on confirmation mount
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if confetti fails in headless env
    }
  }, []);

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-3xl border border-stone-200">
        <p className="text-xs text-stone-500">No active order found.</p>
      </div>
    );
  }

  const handleGoToTracking = () => {
    setActiveUmlNode('track_order');
    setCurrentView('tracking');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-center space-y-6">
        {/* Success Icon */}
        <div className="relative inline-block">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulated Payment Successful</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Order Confirmed &amp; Dispatched!
          </h1>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Your demo order has been registered in the system. The UML workflow has successfully traversed the <code>[Payment OK? = Success]</code> branch.
          </p>
        </div>

        {/* Order ID & Meta Card */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Demo Order ID</span>
            <span className="text-base font-mono font-extrabold text-stone-900">{currentOrder.id}</span>
          </div>
          <div className="sm:text-right">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Placed At</span>
            <span className="text-xs font-semibold text-stone-700">{currentOrder.createdAt}</span>
          </div>
          <div className="sm:text-right">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Status</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {currentOrder.orderStatus}
            </span>
          </div>
        </div>

        {/* Items Summary */}
        <div className="border border-stone-100 rounded-2xl p-4 text-left space-y-3">
          <h3 className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
            <Receipt className="w-3.5 h-3.5 text-stone-500" />
            <span>Ordered Items ({currentOrder.items.length})</span>
          </h3>
          <div className="divide-y divide-stone-100 text-xs">
            {currentOrder.items.map(item => (
              <div key={item.menuItem.id} className="py-2 flex justify-between items-center text-stone-700">
                <span>{item.quantity}x {item.menuItem.name}</span>
                <span className="font-semibold text-stone-900">₹{item.menuItem.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-stone-200 flex justify-between text-xs font-bold text-stone-900">
            <span>Total Paid (Simulated)</span>
            <span className="text-sm font-extrabold text-orange-700">₹{currentOrder.total}</span>
          </div>
        </div>

        {/* CTA to Track Order */}
        <div className="pt-2">
          <button
            onClick={handleGoToTracking}
            className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-600/20 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Simulated Order Lifecycle &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
