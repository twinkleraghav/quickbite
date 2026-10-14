import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import type { OrderStatus } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Bike, 
  PackageCheck, 
  XCircle, 
  FastForward, 
  Ban, 
  MapPin, 
  Receipt, 
  Info,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

const ORDER_STEPS: { status: OrderStatus; label: string; icon: React.FC<{ className?: string }> }[] = [
  { status: 'Placed', label: 'Order Placed', icon: Clock },
  { status: 'Confirmed', label: 'Confirmed by Restaurant', icon: CheckCircle2 },
  { status: 'Preparing', label: 'Food in Kitchen', icon: ChefHat },
  { status: 'Out for Delivery', label: 'Out for Delivery', icon: Bike },
  { status: 'Delivered', label: 'Delivered (Final)', icon: PackageCheck }
];

export const OrderTracking: React.FC = () => {
  const { 
    currentOrder, 
    advanceOrderStatus, 
    cancelOrder, 
    setCurrentView,
    setActiveUmlNode 
  } = useDemo();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-3xl border border-stone-200 space-y-4">
        <p className="text-xs text-stone-500">No active demo order found to track.</p>
        <button
          onClick={() => {
            setCurrentView('menu');
            setActiveUmlNode('browse_menu');
          }}
          className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Browse Menu &amp; Place Demo Order
        </button>
      </div>
    );
  }

  const currentStatusIndex = ORDER_STEPS.findIndex(s => s.status === currentOrder.orderStatus);
  const isCancelled = currentOrder.orderStatus === 'Cancelled';
  const isDelivered = currentOrder.orderStatus === 'Delivered';
  const isCancellable = currentOrder.orderStatus === 'Placed' || currentOrder.orderStatus === 'Confirmed';
  const canAdvance = !isCancelled && !isDelivered && currentStatusIndex < ORDER_STEPS.length - 1;

  const handleCancelClick = () => {
    if (!isCancellable) return;
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    const success = cancelOrder('Cancelled by presenter during demonstration.');
    setCancelModalOpen(false);
    if (success) {
      setCancelFeedback('Order successfully cancelled. UML workflow branched to Activity Final (⦿).');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Return to menu button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setCurrentView('menu');
            setActiveUmlNode('browse_menu');
          }}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Simulated Logistics &amp; Status Stepper
        </span>
      </div>

      {/* Cancellation Feedback Banner */}
      {cancelFeedback && (
        <div className="p-4 bg-stone-900 text-white rounded-2xl flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center space-x-2 text-xs">
            <Ban className="w-4 h-4 text-rose-400" />
            <span>{cancelFeedback}</span>
          </div>
          <button
            onClick={() => setCancelFeedback(null)}
            className="text-xs text-stone-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Tracking Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-stone-900">Live Order Lifecycle</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isCancelled 
                  ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                  : isDelivered 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-orange-100 text-orange-800 border border-orange-200'
              }`}>
                {currentOrder.orderStatus}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Order ID: <span className="font-bold text-stone-800">{currentOrder.id}</span> • Placed at {currentOrder.createdAt}
            </p>
          </div>

          {/* Stepper Controller Button for Presentation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={advanceOrderStatus}
              disabled={!canAdvance}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm ${
                canAdvance
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:scale-105 cursor-pointer shadow-orange-600/20'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
              }`}
              title="Manually advance to next UML Activity state for evaluation"
            >
              <FastForward className="w-4 h-4" />
              <span>
                {isDelivered 
                  ? 'Workflow Completed (⦿)' 
                  : isCancelled 
                    ? 'Order Terminated' 
                    : 'Advance Demo Status &rarr;'}
              </span>
            </button>
          </div>
        </div>

        {/* Stepper Visual Timeline */}
        {isCancelled ? (
          <div className="p-6 bg-rose-50 border-2 border-rose-200 rounded-2xl text-center space-y-2">
            <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-sm font-bold text-rose-950">This Order Was Cancelled</h3>
            <p className="text-xs text-rose-800 max-w-md mx-auto">
              Per UML Activity Diagram rules, cancellation occurred while the order was eligible (in <i>Placed</i> or <i>Confirmed</i> state). The activity has completed at <b>Activity Final (⦿)</b>. Further state transitions are prevented.
            </p>
          </div>
        ) : (
          <div className="py-4">
            <div className="relative flex items-center justify-between">
              {/* Progress track line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-stone-100 z-0">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                  style={{ 
                    width: `${Math.max(0, (currentStatusIndex / (ORDER_STEPS.length - 1)) * 100)}%` 
                  }}
                />
              </div>

              {ORDER_STEPS.map((step, idx) => {
                const isPassed = idx < currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;
                const StepIcon = step.icon;

                return (
                  <div key={step.status} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                        isCurrent
                          ? 'bg-orange-600 text-white ring-4 ring-orange-100 scale-110 shadow-orange-600/30'
                          : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-stone-400 border-2 border-stone-200'
                      }`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <span 
                      className={`text-[11px] mt-2 font-bold text-center max-w-[85px] leading-tight ${
                        isCurrent
                          ? 'text-orange-700 font-extrabold'
                          : isPassed
                            ? 'text-stone-800'
                            : 'text-stone-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancellation Eligibility Guard Bar */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5 text-xs text-stone-600">
            <div className="font-bold text-stone-900 flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-orange-600" />
              <span>Cancellation Policy Guard Condition</span>
            </div>
            <p className="text-[11px] text-stone-500">
              {isCancellable 
                ? 'Cancellation is currently permitted (order is in Placed or Confirmed state).'
                : isDelivered || isCancelled
                  ? 'Order is finalized. Cancellation is no longer applicable.'
                  : 'Order is already being cooked or out for delivery. In accordance with system constraints, cancellation is now locked.'}
            </p>
          </div>

          {isCancellable && (
            <button
              onClick={handleCancelClick}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto shrink-0"
            >
              Cancel Order (Guarded Branch)
            </button>
          )}
        </div>

        {/* Order Details & Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Destination */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2 text-xs">
            <h4 className="font-bold text-stone-900 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Delivery Address</span>
            </h4>
            <div className="text-stone-600 leading-relaxed text-[11px]">
              <strong className="text-stone-900">{currentOrder.deliveryDetails.fullName}</strong>
              <br />
              {currentOrder.deliveryDetails.address}
              {currentOrder.deliveryDetails.landmark && (
                <span className="block text-stone-400">Near: {currentOrder.deliveryDetails.landmark}</span>
              )}
              <span className="block text-stone-400">Phone: +91 {currentOrder.deliveryDetails.phone}</span>
            </div>
          </div>

          {/* Lifecycle Audit Log */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2 text-xs">
            <h4 className="font-bold text-stone-900 flex items-center space-x-1.5">
              <Receipt className="w-3.5 h-3.5 text-stone-500" />
              <span>State Transition History</span>
            </h4>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {currentOrder.statusHistory.map((hist, idx) => (
                <div key={idx} className="text-[11px] text-stone-600 flex items-start justify-between border-b border-stone-100 pb-1 last:border-0">
                  <span>
                    <strong className="text-stone-800">{hist.status}</strong>: {hist.note}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono shrink-0 ml-2">{hist.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-100 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Cancel Active Order?</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Confirm cancellation of order <b>{currentOrder.id}</b>? The UML Activity Diagram will navigate along the guarded <i>Cancel Order</i> branch to <b>Activity Final (⦿)</b>.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 rounded-xl"
              >
                Keep Order Active
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
