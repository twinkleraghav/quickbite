import React from 'react';
import { 
  X, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

interface GuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationGuideModal: React.FC<GuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/60 rounded-t-3xl">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Presenter&apos;s Demo &amp; Viva Companion
              </h3>
              <p className="text-xs text-stone-500">
                Software Engineering &amp; Object-Oriented Modeling Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-xl hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          {/* Quick Flow */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-stone-900 flex items-center space-x-2 text-orange-700">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Recommended 90-Second Live Demo Script</span>
            </h4>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2.5 text-[11px] leading-relaxed">
              <p>
                <strong>1. Initial State:</strong> Point to the UML Panel on the right. Note that the <b>Initial Node (●)</b> is active.
              </p>
              <p>
                <strong>2. Guard Condition (Empty Cart):</strong> Click &ldquo;Cart&rdquo; without adding items &rarr; click &ldquo;Proceed to Checkout&rdquo;. Show that guard condition <code>[Is Cart Empty? = YES]</code> blocks progression and loops back to browsing.
              </p>
              <p>
                <strong>3. Normal Selection &amp; Checkout:</strong> Add Margherita Pizza &amp; Dum Biryani. Click &ldquo;Review Cart&rdquo; &rarr; &ldquo;Proceed to Checkout&rdquo;. Use &ldquo;Pre-fill Sample Data&rdquo; button.
              </p>
              <p>
                <strong>4. Decision Node &amp; Retry Loop (Payment Failure):</strong> On the Demo Payment page, choose <b>Simulate Failed Payment</b> &rarr; Execute. Highlight how the Activity Diagram branches to <i>Display Payment Failure</i> and guard <code>[Retry Payment?]</code>. Click &ldquo;Retry Payment&rdquo; to demonstrate the feedback loop.
              </p>
              <p>
                <strong>5. Successful Path &amp; Confirmation:</strong> Select <b>Simulate Successful Payment</b> &rarr; Execute. Show the generated unique Order ID, PAID status, and transition to <i>Track Order</i>.
              </p>
              <p>
                <strong>6. Stepper &amp; Activity Final:</strong> Click &ldquo;Advance Demo Status&rdquo; to step through Placed &rarr; Confirmed &rarr; Preparing &rarr; Out for Delivery &rarr; Delivered. Observe that reaching <i>Delivered</i> terminates at <b>Activity Final (⦿)</b>.
              </p>
            </div>
          </div>

          {/* Theoretical UML Mappings */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-stone-900 flex items-center space-x-2 text-orange-700">
              <Layers className="w-4 h-4 text-orange-600" />
              <span>UML Activity Diagram Theoretical Mapping</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block">Initial Node (●)</span>
                <span className="text-stone-500">Entry point of activity execution upon opening the QuickBite web application.</span>
              </div>
              <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block">Action Nodes (Rounded Box)</span>
                <span className="text-stone-500">Atomic functional tasks: Browse Menu, Add to Cart, Review Cart, Enter Delivery, Process Payment.</span>
              </div>
              <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block">Decision Nodes (Diamond ◇)</span>
                <span className="text-stone-500">Points of branching with guard conditions: [Is Cart Empty?] and [Payment OK?].</span>
              </div>
              <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block">Activity Final (⦿)</span>
                <span className="text-stone-500">Terminal node that stops execution: reached either via Delivered or Cancelled order.</span>
              </div>
            </div>
          </div>

          {/* Academic Transparency Statement */}
          <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-1 text-[11px] text-orange-950">
            <div className="font-bold flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-700" />
              <span>Academic Transparency Note</span>
            </div>
            <p className="leading-relaxed text-orange-900">
              This prototype utilizes client-side state machine modeling and browser storage for data persistence. Payment gateways and delivery GPS trackers are deliberately simulated to illustrate behavioral workflows cleanly without external payment risks or API keys.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close Guide &amp; Return to App
          </button>
        </div>
      </div>
    </div>
  );
};
