import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { 
  ShieldAlert, 
  XCircle, 
  RotateCcw, 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Building2, 
  Info,
  Check,
  X
} from 'lucide-react';

export const Payment: React.FC = () => {
  const { 
    total, 
    simulatePayment, 
    paymentError, 
    paymentAttempts, 
    retryPayment, 
    cancelPaymentAttempt, 
    setCurrentView,
    setActiveUmlNode,
    deliveryDetails
  } = useDemo();

  const [simulationOutcome, setSimulationOutcome] = useState<'success' | 'failure'>('success');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExecutePayment = () => {
    setIsProcessing(true);
    // UML Decision: Was Payment Successful?
    setActiveUmlNode('decision_payment');

    setTimeout(() => {
      setIsProcessing(false);
      simulatePayment(simulationOutcome);
    }, 800);
  };

  const handleRetry = () => {
    retryPayment();
  };

  const handleCancelAttempt = () => {
    cancelPaymentAttempt();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Return to checkout button */}
      {!paymentError && (
        <button
          onClick={() => {
            setCurrentView('checkout');
            setActiveUmlNode('enter_delivery');
          }}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Delivery Address</span>
        </button>
      )}

      {/* Main Payment Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        {/* Header with simulation notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulated Payment Gateway</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900">Demo Checkout &amp; Payment</h2>
            <p className="text-xs text-stone-500">
              UML Action: <i>Process Simulated Payment</i> &rarr; <i>[Decision: Payment OK?]</i>
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">Amount Due</span>
            <span className="text-xl font-extrabold text-stone-900">₹{total}</span>
          </div>
        </div>

        {/* If Payment Failed State */}
        {paymentError ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Failure Alert Box */}
            <div className="p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-3">
              <div className="flex items-center space-x-3 text-rose-700">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-rose-950">
                    Payment Simulation Failed (Attempt #{paymentAttempts})
                  </h3>
                  <p className="text-xs text-rose-800 mt-0.5">
                    {paymentError}
                  </p>
                </div>
              </div>

              {/* UML Activity Mapping Explanation */}
              <div className="p-3 bg-white/80 rounded-xl border border-rose-200 text-[11px] text-rose-900 space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-rose-700" />
                  <span>UML Activity Diagram Branch Triggered: [Payment OK? = Failure]</span>
                </div>
                <p className="text-rose-800 leading-relaxed">
                  As shown in the Activity Diagram, a failed authorization evaluates guard condition <b>[Retry Payment?]</b>. You can either retry the payment (forming a <i>control loop</i>) or cancel the payment attempt cleanly.
                </p>
              </div>
            </div>

            {/* Decision Controls: Retry or Cancel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleRetry}
                className="py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Payment [Guard: Yes]</span>
              </button>

              <button
                onClick={handleCancelAttempt}
                className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Cancel Payment [Guard: No]</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-400 text-center">
              No duplicate orders are created during retry loops. Your cart remains intact.
            </p>
          </div>
        ) : (
          /* Normal / Retry Payment Configurator */
          <div className="space-y-6">
            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">
                Select Simulated Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3 rounded-xl border flex items-center space-x-2.5 transition text-left cursor-pointer ${
                    selectedMethod === 'upi'
                      ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="text-xs">UPI / GPay / PhonePe</div>
                    <div className="text-[10px] text-stone-400 font-normal">Instant demo authorization</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-xl border flex items-center space-x-2.5 transition text-left cursor-pointer ${
                    selectedMethod === 'card'
                      ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="text-xs">Debit / Credit Card</div>
                    <div className="text-[10px] text-stone-400 font-normal">Simulated 3D Secure</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`p-3 rounded-xl border flex items-center space-x-2.5 transition text-left cursor-pointer ${
                    selectedMethod === 'netbanking'
                      ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="text-xs">Net Banking</div>
                    <div className="text-[10px] text-stone-400 font-normal">Simulated bank portal</div>
                  </div>
                </button>
              </div>
            </div>

            {/* SEPM / UML Decision Simulator Radio Control */}
            <div className="p-4 bg-stone-50 rounded-2xl border-2 border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  <span>UML Presentation Controller: Branch Selector</span>
                </span>
                <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-mono font-semibold">
                  [Guard Condition]
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-snug">
                Select which decision branch you want to test and present to the evaluation committee:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Branch 1: Success */}
                <label 
                  className={`p-3 rounded-xl border-2 flex items-start space-x-3 cursor-pointer transition ${
                    simulationOutcome === 'success'
                      ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="simulationOutcome"
                    checked={simulationOutcome === 'success'}
                    onChange={() => setSimulationOutcome('success')}
                    className="accent-emerald-600 mt-1 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Simulate SUCCESSFUL Payment</span>
                    </span>
                    <span className="text-[11px] text-emerald-800 block mt-0.5">
                      Traverse guard <code>[Payment OK? = Success]</code> &rarr; Generate Order ID &rarr; Order Confirmation.
                    </span>
                  </div>
                </label>

                {/* Branch 2: Failure */}
                <label 
                  className={`p-3 rounded-xl border-2 flex items-start space-x-3 cursor-pointer transition ${
                    simulationOutcome === 'failure'
                      ? 'border-rose-500 bg-rose-50/60 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="simulationOutcome"
                    checked={simulationOutcome === 'failure'}
                    onChange={() => setSimulationOutcome('failure')}
                    className="accent-rose-600 mt-1 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-rose-950 block flex items-center space-x-1">
                      <X className="w-3.5 h-3.5 text-rose-600" />
                      <span>Simulate FAILED Payment</span>
                    </span>
                    <span className="text-[11px] text-rose-800 block mt-0.5">
                      Traverse guard <code>[Payment OK? = Failure]</code> &rarr; Show error &rarr; Test retry loop or cancellation.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Recipient summary */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <span>Delivering to: <strong>{deliveryDetails.fullName}</strong></span>
              <span className="truncate max-w-[200px] text-[11px] text-stone-500">{deliveryDetails.address}</span>
            </div>

            {/* Execute Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecutePayment}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-md ${
                  simulationOutcome === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                }`}
              >
                {isProcessing ? (
                  <span className="inline-flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing Demo Payment Simulation...</span>
                  </span>
                ) : (
                  <span>
                    Execute Demo Payment ({simulationOutcome === 'success' ? 'Simulate Success' : 'Simulate Failure'})
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
