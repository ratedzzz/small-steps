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

  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen, anchorRef]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
      
      // Show success message
      const action = tier === 'free' ? 'downgraded' : 'upgraded';
      alert(`Successfully ${action} to ${SUBSCRIPTION_PLANS[tier].name}!`);
      onClose();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = [
    { tier: 'premium' as SubscriptionTier, plan: SUBSCRIPTION_PLANS.premium },
    { tier: 'pro' as SubscriptionTier, plan: SUBSCRIPTION_PLANS.pro },
  ];

  return (
    <div
      ref={dropdownRef}
      className="fixed z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Upgrade Your Plan</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">Choose a plan to unlock more features</p>
      </div>

      {/* Plans */}
      <div className="p-4 space-y-3">
        {plans.map(({ tier, plan }) => {
          const isCurrentPlan = subscription.currentTier === tier;
          const savings = tier === 'premium' ? '$20/year' : '$40/year';

          return (
            <div
              key={tier}
              className={`relative rounded-lg border p-4 ${
                tier === 'premium'
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {tier === 'premium' && (
                <div className="absolute -top-2 left-4">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Popular
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{plan.name}</h4>
                <div className="text-right">
                  <div className="font-bold text-gray-900">${plan.price.monthly}/mo</div>
                  <div className="text-xs text-green-600">Save {savings}</div>
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-3">
                <ul className="text-xs text-gray-600 space-y-1">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-gray-500">+ {plan.features.length - 3} more features</li>
                  )}
                </ul>
              </div>

              {/* Action Button */}
              {isCurrentPlan ? (
                <div className="text-center py-2 bg-green-100 rounded text-sm font-medium text-green-700">
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(tier)}
                  disabled={isProcessing}
                  className={`w-full py-2 px-4 rounded font-medium text-sm transition-colors ${
                    tier === 'premium'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? 'Processing...' : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>✓ Cancel anytime • ✓ 30-day guarantee</p>
          <button
            onClick={onClose}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View full comparison
          </button>
        </div>
      </div>
    </div>
  );
}