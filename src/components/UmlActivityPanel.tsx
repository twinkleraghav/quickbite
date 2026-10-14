import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import type { UMLNodeType } from '../types';
import { 
  GitBranch, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  X 
} from 'lucide-react';

interface UmlNodeData {
  id: UMLNodeType;
  label: string;
  type: 'initial' | 'action' | 'decision' | 'final';
  x: number;
  y: number;
  width: number;
  height: number;
  guard?: string;
  description: string;
}

export const UmlActivityPanel: React.FC = () => {
  const { activeUmlNode, isUmlPanelOpen, setIsUmlPanelOpen, umlExplanation, currentView } = useDemo();
  const [activeTab, setActiveTab] = useState<'diagram' | 'theory' | 'cheatSheet'>('diagram');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Nodes for the UML Activity Diagram SVG
  const nodes: UmlNodeData[] = [
    {
      id: 'initial_node',
      label: 'Start (●)',
      type: 'initial',
      x: 170,
      y: 20,
      width: 24,
      height: 24,
      description: 'Initial Node: Begins execution of the food delivery workflow.'
    },
    {
      id: 'browse_menu',
      label: 'Browse Menu',
      type: 'action',
      x: 105,
      y: 65,
      width: 154,
      height: 38,
      description: 'Action Node: Customer navigates menu, filters categories, and checks dish descriptions.'
    },
    {
      id: 'select_items',
      label: 'Select Items',
      type: 'action',
      x: 105,
      y: 125,
      width: 154,
      height: 38,
      description: 'Action Node: Evaluates food options and inspects prices in Indian Rupees (₹).'
    },
    {
      id: 'add_to_cart',
      label: 'Add Items to Cart',
      type: 'action',
      x: 105,
      y: 185,
      width: 154,
      height: 38,
      description: 'Action Node: Adds item with quantity; updates cart total in application state.'
    },
    {
      id: 'decision_cart_empty',
      label: 'Cart Empty?',
      type: 'decision',
      x: 152,
      y: 245,
      width: 60,
      height: 50,
      description: 'Decision Node: Branches based on guard condition [Yes] vs [No].'
    },
    {
      id: 'review_cart',
      label: 'Review Cart',
      type: 'action',
      x: 105,
      y: 325,
      width: 154,
      height: 38,
      description: 'Action Node: User verifies quantities, packaging charge, GST, and final price.'
    },
    {
      id: 'enter_delivery',
      label: 'Enter Delivery Details',
      type: 'action',
      x: 105,
      y: 385,
      width: 154,
      height: 38,
      description: 'Action Node: Enters customer name, phone number, and delivery address with validation.'
    },
    {
      id: 'place_order',
      label: 'Place Order & Pay',
      type: 'action',
      x: 105,
      y: 445,
      width: 154,
      height: 38,
      description: 'Action Node: Submits checkout request to trigger the demo payment gateway.'
    },
    {
      id: 'process_payment',
      label: 'Process Simulated Payment',
      type: 'action',
      x: 85,
      y: 505,
      width: 194,
      height: 38,
      description: 'Action Node: Executes simulated payment transaction.'
    },
    {
      id: 'decision_payment',
      label: 'Payment OK?',
      type: 'decision',
      x: 152,
      y: 565,
      width: 60,
      height: 50,
      description: 'Decision Node: Branches on [Success] vs [Failure].'
    },
    // Success branch
    {
      id: 'order_created',
      label: 'Create Order & Confirm',
      type: 'action',
      x: 20,
      y: 645,
      width: 150,
      height: 42,
      description: 'Action Node [Success]: Unique Order ID generated, cart cleared, order saved with PAID status.'
    },
    {
      id: 'track_order',
      label: 'Track Order',
      type: 'action',
      x: 20,
      y: 710,
      width: 150,
      height: 38,
      description: 'Action Node: Real-time simulated order timeline (Placed → Confirmed → Preparing → Out for Delivery).'
    },
    {
      id: 'advance_status',
      label: 'Advance Demo Status',
      type: 'action',
      x: 20,
      y: 770,
      width: 150,
      height: 38,
      description: 'Action Node: Presenter controls step-by-step state progression for evaluation.'
    },
    {
      id: 'delivered',
      label: 'Order Delivered (⦿)',
      type: 'final',
      x: 82,
      y: 835,
      width: 26,
      height: 26,
      description: 'Activity Final Node: Workflow finishes with successful delivery.'
    },
    // Failure branch
    {
      id: 'payment_failed',
      label: 'Display Payment Failure',
      type: 'action',
      x: 205,
      y: 645,
      width: 150,
      height: 42,
      description: 'Action Node [Failure]: Error notification shown with diagnostic reason.'
    },
    {
      id: 'decision_retry',
      label: 'Retry?',
      type: 'decision',
      x: 250,
      y: 710,
      width: 60,
      height: 48,
      description: 'Decision Node: Checks guard condition [Yes] to loop back or [No] to cancel.'
    },
    {
      id: 'cancel_payment',
      label: 'Cancel Payment Attempt',
      type: 'action',
      x: 205,
      y: 780,
      width: 150,
      height: 38,
      description: 'Action Node: Cancel transaction without duplicate orders.'
    },
    {
      id: 'cancel_order',
      label: 'Cancel Order (Guarded)',
      type: 'action',
      x: 20,
      y: 890,
      width: 150,
      height: 36,
      description: 'Action Node: Eligible only while Placed or Confirmed; aborts order progression.'
    },
    {
      id: 'activity_final',
      label: 'End (⦿)',
      type: 'final',
      x: 267,
      y: 840,
      width: 26,
      height: 26,
      description: 'Activity Final Node: Terminal point for cancelled payment or order.'
    }
  ];

  const isNodeActive = (id: UMLNodeType) => {
    if (activeUmlNode === id) return true;
    // Contextual active highlights
    if (currentView === 'menu' && (id === 'browse_menu' || id === 'select_items')) return true;
    if (currentView === 'cart' && id === 'review_cart') return true;
    if (currentView === 'checkout' && id === 'enter_delivery') return true;
    if (currentView === 'payment' && id === 'process_payment') return true;
    if (currentView === 'confirmation' && id === 'order_created') return true;
    if (currentView === 'tracking' && (id === 'track_order' || id === 'advance_status')) return true;
    return false;
  };

  return (
    <>
      {/* Floating Toggle if closed */}
      {!isUmlPanelOpen && (
        <button
          onClick={() => setIsUmlPanelOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 font-medium hover:scale-105 transition-all duration-200 border-2 border-white/20"
          title="Open UML Activity Diagram"
        >
          <GitBranch className="w-5 h-5" />
          <span>Show UML Activity Mode</span>
        </button>
      )}

      {/* Main Drawer / Panel */}
      {isUmlPanelOpen && (
        <aside 
          className={`flex flex-col bg-white border-l border-amber-100 shadow-2xl transition-all duration-300 z-30 shrink-0 ${
            isExpanded ? 'w-full md:w-[680px]' : 'w-full md:w-[380px] lg:w-[420px]'
          }`}
          style={{ maxHeight: '100vh' }}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/60 border-b border-orange-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-sm">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-1.5">
                  <span>UML Activity Mapping</span>
                  <span className="text-[10px] bg-orange-200 text-orange-800 font-semibold px-1.5 py-0.5 rounded-full">
                    LIVE
                  </span>
                </h3>
                <p className="text-[11px] text-gray-600">SE &amp; UML Presentation Engine</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-white/80 rounded-lg transition"
                title={isExpanded ? "Collapse width" : "Expand width"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsUmlPanelOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-white/80 rounded-lg transition"
                title="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Live State Banner */}
          <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-orange-200/70">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-gray-800">Current Node: </span>
                <span className="text-orange-700 font-mono font-bold capitalize">
                  {activeUmlNode.replace(/_/g, ' ')}
                </span>
                <p className="text-gray-600 mt-1 text-[11px] leading-relaxed">
                  {umlExplanation}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-medium">
            <button
              onClick={() => setActiveTab('diagram')}
              className={`flex-1 py-2.5 text-center transition ${
                activeTab === 'diagram'
                  ? 'border-b-2 border-orange-600 text-orange-600 font-bold bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Diagram (Live)
            </button>
            <button
              onClick={() => setActiveTab('theory')}
              className={`flex-1 py-2.5 text-center transition ${
                activeTab === 'theory'
                  ? 'border-b-2 border-orange-600 text-orange-600 font-bold bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              UML Concepts
            </button>
            <button
              onClick={() => setActiveTab('cheatSheet')}
              className={`flex-1 py-2.5 text-center transition ${
                activeTab === 'cheatSheet'
                  ? 'border-b-2 border-orange-600 text-orange-600 font-bold bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Demo Script
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'diagram' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block ring-2 ring-orange-200"></span>
                    <span>Highlighted = Active State</span>
                  </span>
                  <span>Standard OMG UML 2.5</span>
                </div>

                {/* SVG Visual Activity Diagram */}
                <div className="bg-gradient-to-b from-stone-50 to-orange-50/20 rounded-xl p-3 border border-stone-200 shadow-inner overflow-x-auto">
                  <svg
                    viewBox="0 0 380 940"
                    className="w-full max-w-[380px] mx-auto select-none"
                    style={{ minHeight: '880px' }}
                  >
                    <defs>
                      <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 8 5 L 0 9 z" fill="#78716c" />
                      </marker>
                      <marker
                        id="arrow-active"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 8 5 L 0 9 z" fill="#ea580c" />
                      </marker>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ea580c" floodOpacity="0.4" />
                      </filter>
                    </defs>

                    {/* Flow Lines */}
                    {/* Initial -> Browse */}
                    <line x1="182" y1="44" x2="182" y2="65" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Browse -> Select */}
                    <line x1="182" y1="103" x2="182" y2="125" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Select -> Add to Cart */}
                    <line x1="182" y1="163" x2="182" y2="185" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Add to Cart -> Decision Cart Empty */}
                    <line x1="182" y1="223" x2="182" y2="245" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Decision Cart Empty -> [Yes] Loop back to Browse */}
                    <path
                      d="M 212 270 H 290 V 84 H 262"
                      fill="none"
                      stroke="#78716c"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      markerEnd="url(#arrow)"
                    />
                    <text x="220" y="262" fill="#dc2626" fontSize="10" fontWeight="bold">[Yes, empty]</text>

                    {/* Decision Cart Empty -> [No] Review Cart */}
                    <line x1="182" y1="295" x2="182" y2="325" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />
                    <text x="188" y="312" fill="#16a34a" fontSize="10" fontWeight="bold">[No]</text>

                    {/* Review Cart -> Enter Delivery */}
                    <line x1="182" y1="363" x2="182" y2="385" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Enter Delivery -> Place Order */}
                    <line x1="182" y1="423" x2="182" y2="445" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Place Order -> Process Payment */}
                    <line x1="182" y1="483" x2="182" y2="505" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Process Payment -> Decision Payment OK */}
                    <line x1="182" y1="543" x2="182" y2="565" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Decision Payment -> [Success] to Left (Order Created) */}
                    <path
                      d="M 152 590 H 95 V 645"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="2"
                      markerEnd="url(#arrow)"
                    />
                    <text x="75" y="582" fill="#16a34a" fontSize="10" fontWeight="bold">[Success]</text>

                    {/* Decision Payment -> [Failure] to Right (Payment Failed) */}
                    <path
                      d="M 212 590 H 280 V 645"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="2"
                      markerEnd="url(#arrow)"
                    />
                    <text x="225" y="582" fill="#dc2626" fontSize="10" fontWeight="bold">[Failure]</text>

                    {/* Order Created -> Track Order */}
                    <line x1="95" y1="687" x2="95" y2="710" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Track Order -> Advance Status */}
                    <line x1="95" y1="748" x2="95" y2="770" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Advance Status -> Delivered (Final) */}
                    <line x1="95" y1="808" x2="95" y2="835" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Track Order -> Guarded Cancel Order */}
                    <path
                      d="M 95 861 V 890"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      markerEnd="url(#arrow)"
                    />

                    {/* Payment Failed -> Retry Decision */}
                    <line x1="280" y1="687" x2="280" y2="710" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Retry Decision -> [Yes] Loop back to Process Payment */}
                    <path
                      d="M 310 734 H 360 V 524 H 282"
                      fill="none"
                      stroke="#ea580c"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      markerEnd="url(#arrow-active)"
                    />
                    <text x="315" y="725" fill="#ea580c" fontSize="9" fontWeight="bold">[Retry: Yes]</text>

                    {/* Retry Decision -> [No] Cancel Payment Attempt */}
                    <line x1="280" y1="758" x2="280" y2="780" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />
                    <text x="286" y="773" fill="#64748b" fontSize="9" fontWeight="bold">[No]</text>

                    {/* Cancel Payment Attempt -> Activity Final */}
                    <line x1="280" y1="818" x2="280" y2="840" stroke="#78716c" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Render All UML Nodes */}
                    {nodes.map(node => {
                      const active = isNodeActive(node.id);

                      if (node.type === 'initial') {
                        return (
                          <g key={node.id} className="cursor-pointer">
                            <circle
                              cx={node.x + 12}
                              cy={node.y + 12}
                              r="12"
                              fill={active ? '#ea580c' : '#1e293b'}
                              stroke={active ? '#fb923c' : '#0f172a'}
                              strokeWidth={active ? '3' : '1'}
                              filter={active ? 'url(#glow)' : undefined}
                            />
                            {active && (
                              <circle
                                cx={node.x + 12}
                                cy={node.y + 12}
                                r="17"
                                fill="none"
                                stroke="#ea580c"
                                strokeWidth="2"
                                opacity="0.6"
                              >
                                <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                              </circle>
                            )}
                          </g>
                        );
                      }

                      if (node.type === 'final') {
                        return (
                          <g key={node.id} className="cursor-pointer">
                            <circle
                              cx={node.x + 13}
                              cy={node.y + 13}
                              r="13"
                              fill="none"
                              stroke={active ? '#ea580c' : '#1e293b'}
                              strokeWidth="2"
                            />
                            <circle
                              cx={node.x + 13}
                              cy={node.y + 13}
                              r="8"
                              fill={active ? '#ea580c' : '#1e293b'}
                            />
                          </g>
                        );
                      }

                      if (node.type === 'decision') {
                        const cx = node.x + node.width / 2;
                        const cy = node.y + node.height / 2;
                        const w = node.width / 2;
                        const h = node.height / 2;
                        const points = `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`;

                        return (
                          <g key={node.id} className="cursor-pointer">
                            <polygon
                              points={points}
                              fill={active ? '#fed7aa' : '#ffffff'}
                              stroke={active ? '#ea580c' : '#475569'}
                              strokeWidth={active ? '2.5' : '1.5'}
                              filter={active ? 'url(#glow)' : undefined}
                            />
                            <text
                              x={cx}
                              y={cy + 3}
                              textAnchor="middle"
                              fontSize="9"
                              fontWeight="600"
                              fill={active ? '#9a3412' : '#334155'}
                            >
                              {node.label}
                            </text>
                          </g>
                        );
                      }

                      // Action Node: Rounded Rectangle
                      return (
                        <g key={node.id} className="cursor-pointer">
                          <rect
                            x={node.x}
                            y={node.y}
                            width={node.width}
                            height={node.height}
                            rx="10"
                            ry="10"
                            fill={active ? '#ffedd5' : '#ffffff'}
                            stroke={active ? '#ea580c' : '#94a3b8'}
                            strokeWidth={active ? '2.5' : '1.5'}
                            filter={active ? 'url(#glow)' : undefined}
                          />
                          <text
                            x={node.x + node.width / 2}
                            y={node.y + node.height / 2 + 4}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight={active ? '700' : '500'}
                            fill={active ? '#9a3412' : '#1e293b'}
                          >
                            {node.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            )}

            {activeTab === 'theory' && (
              <div className="space-y-4 text-xs">
                <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl">
                  <h4 className="font-bold text-orange-950 flex items-center space-x-1.5 mb-1.5">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span>UML Activity Diagram Elements</span>
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-[11px]">
                    An Activity Diagram is a behavioral UML diagram specifying operational step sequences, decision logic, and control flows within software engineering.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-2.5 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center space-x-2 font-bold text-gray-900">
                      <span className="w-3.5 h-3.5 rounded-full bg-gray-900 inline-block"></span>
                      <span>Initial Node (●)</span>
                    </div>
                    <p className="text-gray-600 mt-1 text-[11px]">
                      The initial node marks where the modeled process begins. QuickBite enters this node when the customer opens the app.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center space-x-2 font-bold text-gray-900">
                      <span className="w-4 h-3 rounded bg-orange-100 border border-orange-600 inline-block"></span>
                      <span>Action Node (Rounded Rectangle)</span>
                    </div>
                    <p className="text-gray-600 mt-1 text-[11px]">
                      Represents a fundamental step of execution: e.g., <i>Browse Menu</i>, <i>Add Items to Cart</i>, <i>Process Payment</i>.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center space-x-2 font-bold text-gray-900">
                      <span className="w-3 h-3 rotate-45 border-2 border-amber-600 inline-block"></span>
                      <span>Decision Node (Diamond ◇)</span>
                    </div>
                    <p className="text-gray-600 mt-1 text-[11px]">
                      Evaluates guard conditions to route a single incoming control flow into mutually exclusive outgoing flows:
                      <br />• <i>[Cart Empty?]</i> → [Yes] vs [No]
                      <br />• <i>[Payment OK?]</i> → [Success] vs [Failure]
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center space-x-2 font-bold text-gray-900">
                      <ChevronRight className="w-4 h-4 text-orange-600 inline-block" />
                      <span>Guard Conditions [Condition]</span>
                    </div>
                    <p className="text-gray-600 mt-1 text-[11px]">
                      Enclosed in square brackets. A path is only traversed when its guard condition evaluates to true.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center space-x-2 font-bold text-gray-900">
                      <RotateCcw className="w-4 h-4 text-orange-600 inline-block" />
                      <span>Loop / Retry Flow</span>
                    </div>
                    <p className="text-gray-600 mt-1 text-[11px]">
                      A control flow directed backward to an earlier action node. If payment fails and user chooses <i>Retry</i>, control returns to <i>Process Payment</i>.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center space-x-2 font-bold text-gray-900">
                      <div className="w-4 h-4 rounded-full border border-gray-900 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                      </div>
                      <span>Activity Final Node (⦿)</span>
                    </div>
                    <p className="text-gray-600 mt-1 text-[11px]">
                      Bullseye symbol terminating the entire activity when delivery completes or cancellation concludes.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                    <strong>Note for Viva / Examiner:</strong> A <i>Merge Node</i> also uses a diamond symbol but combines multiple alternate flows into one without evaluating conditions, distinct from a <i>Decision Node</i>. <i>Fork/Join</i> bars are used only for concurrent parallel threads.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cheatSheet' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <h4 className="font-bold text-emerald-950 flex items-center space-x-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Presenter&apos;s 2-Minute Demo Script</span>
                  </h4>
                  <p className="text-emerald-800 text-[11px]">
                    Follow these simple steps in front of the audience or during video recording:
                  </p>
                </div>

                <ol className="space-y-2 text-gray-700 text-[11px]">
                  <li className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <strong className="text-orange-700">Step 1: Empty Cart Guard</strong>
                    <br />Open the cart while empty and click &ldquo;Proceed to Checkout&rdquo;. Notice the decision node prevents checkout: <i>[Cart Empty? Yes]</i> loops back.
                  </li>
                  <li className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <strong className="text-orange-700">Step 2: Add Food &amp; Fill Form</strong>
                    <br />Add Margherita Pizza and Dum Biryani. Click Cart → Checkout. Use &ldquo;Quick Fill Demo Data&rdquo; button to validate inputs instantly.
                  </li>
                  <li className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <strong className="text-orange-700">Step 3: Simulate Payment Failure</strong>
                    <br />On the Demo Payment page, select <b>Simulate Failed Payment</b>. Observe the failure state and decision node <i>[Retry Payment?]</i>.
                  </li>
                  <li className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <strong className="text-orange-700">Step 4: Retry Payment &amp; Succeed</strong>
                    <br />Click &ldquo;Retry Payment&rdquo; (demonstrating the control loop). Now select <b>Simulate Successful Payment</b>. Order ID generated!
                  </li>
                  <li className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <strong className="text-orange-700">Step 5: Step Through Order Tracking</strong>
                    <br />Click &ldquo;Advance Demo Status&rdquo; repeatedly: Placed → Confirmed → Preparing → Out for Delivery → Delivered (Activity Final ⦿).
                  </li>
                  <li className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <strong className="text-orange-700">Step 6: Reset Demo</strong>
                    <br />Click the &ldquo;Reset Demo&rdquo; button in the top navbar to return to a clean slate.
                  </li>
                </ol>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
};
