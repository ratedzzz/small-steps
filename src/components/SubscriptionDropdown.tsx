
// src/components/SubscriptionDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '../types/subscription';

interface SubscriptionDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

export function SubscriptionDropdown({ isOpen, onClose, anchorRef }: SubscriptionDropdownProps) {
  const { subscription, updateSubscription } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Robust click outside handler uses "click" event, and adds handler after a timeout (to avoid closing instantly)
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 200);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (tier === subscription.currentTier) return;
    setIsProcessing(true);

    try {
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 1500));

      updateSubscription(tier);

      // Show success message, then close dropdown
      const action = tier === 'free' ? 'downgraded' : 'upgraded';
      alert(`Successfully ${action} to ${SUBSCRIPTION_PLANS[tier].name}!`);
      onClose();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute w-80 bg-white rounded-lg shadow-2xl border-2 border-gray-300 z-50"
      style={{
        top: '50px',
        right: '0px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-blue-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Upgrade Your Plan</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">Choose a plan to unlock more features</p>
      </div>
      {/* Plans */}
      <div className="p-4 space-y-3">
        {/* Premium Plan */}
        <div className="relative rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="absolute -top-2 left-4">
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
              Popular
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Premium</h4>
            <div className="text-right">
              <div className="font-bold text-gray-900">$4.99/mo</div>
              <div className="text-xs text-green-600">Save $20/year</div>
            </div>
          </div>
          <div className="mb-3">
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center gap-1">
                <span className="text-green-500">✓</span>
                Unlimited habits and goals
              </li>
              <li className="flex items-center gap-1">
                <span className="text-green-500">✓</span>
                Advanced analytics
              </li>
              <li className="flex items-center gap-1">
                <span className="text-green-500">✓</span>
                Cloud sync across devices
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleUpgrade('premium')}
            disabled={isProcessing || subscription.currentTier === 'premium'}
            className="w-full py-2 px-4 rounded font-medium text-sm transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isProcessing
              ? 'Processing...'
              : subscription.currentTier === 'premium'
              ? 'Current Plan'
              : 'Upgrade to Premium'}
          </button>
        </div>
        {/* Pro Plan */}
        <div className="relative rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Pro</h4>
            <div className="text-right">
              <div className="font-bold text-gray-900">$9.99/mo</div>
              <div className="text-xs text-green-600">Save $40/year</div>
            </div>
          </div>
          <div className="mb-3">
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center gap-1">
                <span className="text-green-500">✓</span>
                Everything in Premium
              </li>
              <li className="flex items-center gap-1">
                <span className="text-green-500">✓</span>
                Social features
              </li>
              <li className="flex items-center gap-1">
                <span className="text-green-500">✓</span>
                Custom badges
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleUpgrade('pro')}
            disabled={isProcessing || subscription.currentTier === 'pro'}
            className="w-full py-2 px-4 rounded font-medium text-sm transition-colors bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isProcessing
              ? 'Processing...'
              : subscription.currentTier === 'pro'
              ? 'Current Plan'
              : 'Upgrade to Pro'}
          </button>
        </div>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
        <div className="text-xs text-gray-500 text-center">
          <p>✓ Cancel anytime • ✓ 30-day guarantee</p>
        </div>
      </div>
    </div>
  );
}
