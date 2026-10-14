import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Phone, 
  FileText, 
  Zap, 
  AlertCircle,
  CreditCard,
  Sparkles
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const { 
    total, 
    deliveryDetails, 
    setDeliveryDetails, 
    fillSampleDetails, 
    setCurrentView,
    setActiveUmlNode
  } = useDemo();

  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; address?: string }>({});

  const validate = () => {
    const newErrors: { fullName?: string; phone?: string; address?: string } = {};

    if (!deliveryDetails.fullName.trim()) {
      newErrors.fullName = 'Customer name is required.';
    } else if (deliveryDetails.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter a valid full name (at least 3 characters).';
    }

    const cleanPhone = deliveryDetails.phone.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Contact phone number is required.';
    } else if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    if (!deliveryDetails.address.trim()) {
      newErrors.address = 'Delivery address is required for delivery simulation.';
    } else if (deliveryDetails.address.trim().length < 8) {
      newErrors.address = 'Please specify detailed hostel/flat address (min 8 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // UML Action: Place Order -> transitions to Process Payment
    setActiveUmlNode('place_order');
    setTimeout(() => {
      setActiveUmlNode('process_payment');
      setCurrentView('payment');
    }, 400);
  };

  const handleBackToCart = () => {
    setCurrentView('cart');
    setActiveUmlNode('review_cart');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={handleBackToCart}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart Review</span>
      </button>

      {/* Checkout Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Delivery Details</h2>
            <p className="text-xs text-stone-500">
              UML Action: <i>Enter Delivery Details</i>
            </p>
          </div>

          {/* Quick Demo Pre-fill Button */}
          <button
            type="button"
            onClick={fillSampleDetails}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl text-xs font-bold border border-orange-200 transition cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pre-fill Sample Data</span>
          </button>
        </div>

        <form onSubmit={handleProceedToPayment} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>Full Name <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={deliveryDetails.fullName}
              onChange={e => {
                setDeliveryDetails(prev => ({ ...prev, fullName: e.target.value }));
                if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 transition ${
                errors.fullName 
                  ? 'border-rose-400 focus:ring-rose-200' 
                  : 'border-stone-200 focus:ring-orange-500/20 focus:border-orange-500'
              }`}
            />
            {errors.fullName && (
              <p className="text-[11px] text-rose-600 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-500" />
              <span>Contact Number (Sample) <span className="text-rose-500">*</span></span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-500 font-semibold">
                +91
              </span>
              <input
                type="tel"
                placeholder="9876543210"
                value={deliveryDetails.phone}
                maxLength={10}
                onChange={e => {
                  setDeliveryDetails(prev => ({ ...prev, phone: e.target.value }));
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                }}
                className={`w-full pl-12 pr-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 transition ${
                  errors.phone 
                    ? 'border-rose-400 focus:ring-rose-200' 
                    : 'border-stone-200 focus:ring-orange-500/20 focus:border-orange-500'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-rose-600 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>

          {/* Delivery Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Delivery Address / Hostel / Room <span className="text-rose-500">*</span></span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Room 304, Kaveri Hostel, North Campus"
              value={deliveryDetails.address}
              onChange={e => {
                setDeliveryDetails(prev => ({ ...prev, address: e.target.value }));
                if (errors.address) setErrors(prev => ({ ...prev, address: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 transition ${
                errors.address 
                  ? 'border-rose-400 focus:ring-rose-200' 
                  : 'border-stone-200 focus:ring-orange-500/20 focus:border-orange-500'
              }`}
            />
            {errors.address && (
              <p className="text-[11px] text-rose-600 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.address}</span>
              </p>
            )}
          </div>

          {/* Landmark & Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-600">
                Landmark (Optional)
              </label>
              <input
                type="text"
                placeholder="Near Central Library"
                value={deliveryDetails.landmark || ''}
                onChange={e => setDeliveryDetails(prev => ({ ...prev, landmark: e.target.value }))}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-600 flex items-center space-x-1">
                <FileText className="w-3 h-3 text-stone-400" />
                <span>Delivery Note (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Call before arrival"
                value={deliveryDetails.instructions || ''}
                onChange={e => setDeliveryDetails(prev => ({ ...prev, instructions: e.target.value }))}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>
          </div>

          {/* Delivery Option */}
          <div className="pt-2">
            <span className="text-xs font-bold text-stone-700 block mb-2">Delivery Speed</span>
            <div className="grid grid-cols-2 gap-3">
              <label 
                className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition ${
                  deliveryDetails.deliveryType === 'standard'
                    ? 'border-orange-500 bg-orange-50/50'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  checked={deliveryDetails.deliveryType === 'standard'}
                  onChange={() => setDeliveryDetails(prev => ({ ...prev, deliveryType: 'standard' }))}
                  className="accent-orange-600"
                />
                <div className="text-xs">
                  <span className="font-bold text-stone-900 block">Standard (30-35m)</span>
                  <span className="text-[10px] text-stone-500">Regular transit</span>
                </div>
              </label>

              <label 
                className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition ${
                  deliveryDetails.deliveryType === 'express'
                    ? 'border-orange-500 bg-orange-50/50'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  checked={deliveryDetails.deliveryType === 'express'}
                  onChange={() => setDeliveryDetails(prev => ({ ...prev, deliveryType: 'express' }))}
                  className="accent-orange-600"
                />
                <div className="text-xs">
                  <span className="font-bold text-stone-900 flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>Express (20m)</span>
                  </span>
                  <span className="text-[10px] text-stone-500">Priority routing</span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Amount</span>
              <span className="text-lg font-extrabold text-stone-900">₹{total}</span>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition flex items-center space-x-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Demo Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
