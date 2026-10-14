import React, { useState } from 'react';
import { DemoProvider, useDemo } from './context/DemoContext';
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Payment } from './components/Payment';
import { OrderConfirmation } from './components/OrderConfirmation';
import { OrderTracking } from './components/OrderTracking';
import { UmlActivityPanel } from './components/UmlActivityPanel';
import { PresentationGuideModal } from './components/PresentationGuideModal';


const MainAppContent: React.FC = () => {
  const { currentView } = useDemo();
  const [guideOpen, setGuideOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentView) {
      case 'menu':
        return <Menu />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'payment':
        return <Payment />;
      case 'confirmation':
        return <OrderConfirmation />;
      case 'tracking':
        return <OrderTracking />;
      default:
        return <Menu />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbfa] text-stone-900">
      {/* Top App Header */}
      <Header onOpenGuide={() => setGuideOpen(true)} />

      {/* Main Presentation View Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Customer Interactive Application Panel */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>

        {/* Live UML Activity Diagram & Learning Panel */}
        <UmlActivityPanel />
      </div>

      {/* Presentation Footer */}
      <footer className="bg-white border-t border-stone-200 py-3 px-4 sm:px-8 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>QuickBite v1.0 — College SE &amp; UML Activity Diagram Demonstration</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <button
            onClick={() => setGuideOpen(true)}
            className="text-orange-600 hover:text-orange-700 font-bold underline cursor-pointer"
          >
            Open Presentation Cheat Sheet
          </button>
          <span>•</span>
          <span className="text-stone-400">All data &amp; payments simulated locally</span>
        </div>
      </footer>

      {/* Guide Modal */}
      <PresentationGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <DemoProvider>
      <MainAppContent />
    </DemoProvider>
  );
}

export default App;
