// src/components/SubscriptionManager.tsx
// Replaces: SubscriptionComponents.tsx, SubscriptionDropdown.tsx, SubscriptionModal.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '../types/subscription';

// Banner Component
interface LimitBannerProps {
  limitType: 'habits' | 'goals';
  currentCount: number;
  onUpgrade: () => void;
}

export function LimitReachedBanner({ limitType, currentCount, onUpgrade }: LimitBannerProps) {
  const { hasReachedLimit, subscription } = useSubscription();

  if (!hasReachedLimit(limitType, currentCount)) return null;

  const limit = limitType === 'habits' 
    ? subscription.plan.limits.maxHabits 
    : subscription.plan.limits.maxGoals;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-yellow-800 font-medium">
            {limitType === 'habits' ? 'Habit' : 'Goal'} Limit Reached
          </h3>
          <p className="text-yellow-700 text-sm">
            You've reached your limit of {limit} {limitType}. Upgrade to add more!
          </p>
        </div>
        <button
          onClick={onUpgrade}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}

// Plan Card Component
interface PlanCardProps {
  tier: SubscriptionTier;
  isCurrentPlan: boolean;
  isProcessing: boolean;
  onUpgrade: (tier: SubscriptionTier) => void;
  compact?: boolean;
}

function PlanCard({ tier, isCurrentPlan, isProcessing, onUpgrade, compact = false }: PlanCardProps) {
  const plan = SUBSCRIPTION_PLANS[tier];
  
  if (compact) {
    return (
      <div className={`rounded-lg border p-4 ${tier === 'premium' ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'}`}>
        {tier === 'premium' && (
          <div className="absolute -top-2 left-4">
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">Popular</span>
          </div>
        )}
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">{plan.name}</h4>
          <div className="text-right">
            <div className="font-bold text-gray-900">${plan.price.monthly}/mo</div>
            <div className="text-xs text-green-600">Save ${(plan.price.monthly * 12 - plan.price.yearly).toFixed(2)}/year</div>
          </div>
        </div>
        <ul className="text-xs text-gray-600 space-y-1 mb-3">
          {plan.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-center gap-1">
              <span className="text-green-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        <button
          onClick={() => onUpgrade(tier)}
          disabled={isProcessing || isCurrentPlan}
          className={`w-full py-2 px-4 rounded font-medium text-sm transition-colors ${
            tier === 'premium'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          } disabled:opacity-50`}
        >
          {isProcessing ? 'Processing...' : isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
        </button>
      </div>
    );
  }

  // Full card for modal
  return (
    <div className={`relative rounded-lg border-2 p-6 ${
      tier === 'premium' ? 'border-blue-500 bg-blue-50' : 
      isCurrentPlan ? 'border-green-500 bg-green-50' : 
      'border-gray-200 bg-white'
    }`}>
      {tier === 'premium' && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">Most Popular</span>
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">Current Plan</span>
        </div>
      )}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">${plan.price.monthly}/month</span>
          <div className="text-sm text-green-600 font-medium mt-1">
            or ${plan.price.yearly}/year (Save ${(plan.price.monthly * 12 - plan.price.yearly).toFixed(2)})
          </div>
        </div>
        <ul className="text-left space-y-2 mb-6 text-sm">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => onUpgrade(tier)}
          disabled={isProcessing || isCurrentPlan}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            isCurrentPlan
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : tier === 'premium'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? 'Processing...' : isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
        </button>
      </div>
    </div>
  );
}

// Dropdown Component
interface SubscriptionDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

export function SubscriptionDropdown({ isOpen, onClose, anchorRef }: SubscriptionDropdownProps) {
  const { subscription, updateSubscription } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (tier === subscription.currentTier) return;
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateSubscription(tier);
      alert(`Successfully upgraded to ${SUBSCRIPTION_PLANS[tier].name}!`);
      onClose();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute w-80 bg-white rounded-lg shadow-2xl border-2 border-gray-300 z-50"
      style={{ top: '50px', right: '0px', maxHeight: '80vh', overflow: 'auto' }}
    >
      <div className="p-4 border-b border-gray-100 bg-blue-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Upgrade Your Plan</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">Choose a plan to unlock more features</p>
      </div>
      <div className="p-4 space-y-3">
        <PlanCard
          tier="premium"
          isCurrentPlan={subscription.currentTier === 'premium'}
          isProcessing={isProcessing}
          onUpgrade={handleUpgrade}
          compact
        />
        <PlanCard
          tier="pro"
          isCurrentPlan={subscription.currentTier === 'pro'}
          isProcessing={isProcessing}
          onUpgrade={handleUpgrade}
          compact
        />
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
        <div className="text-xs text-gray-500 text-center">
          <p>✓ Cancel anytime • ✓ 30-day guarantee</p>
        </div>
      </div>
    </div>
  );
}

// Modal Component
interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { subscription, updateSubscription } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (tier === 'free') return;
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateSubscription(tier);
      alert(`Successfully upgraded to ${SUBSCRIPTION_PLANS[tier].name}!`);
      onClose();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            ✕
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['free', 'premium', 'pro'] as SubscriptionTier[]).map(tier => (
              <PlanCard
                key={tier}
                tier={tier}
                isCurrentPlan={subscription.currentTier === tier}
                isProcessing={isProcessing}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>✓ Cancel anytime</p>
            <p>✓ 30-day money-back guarantee</p>
            <p>✓ Secure payment processing</p>
          </div>
        </div>
      </div>
    </div>
  );
}