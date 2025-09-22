// src/components/SubscriptionModal.tsx

import React, { useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '../types/subscription';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightTier?: SubscriptionTier;
}

export function SubscriptionModal({ isOpen, onClose, highlightTier }: SubscriptionModalProps) {
  const { subscription, updateSubscription } = useSubscription();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(highlightTier || 'premium');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (tier === 'free') return;

    setIsProcessing(true);
    
    try {
      // For now, simulate a payment process
      // In a real app, this would integrate with payment processors like Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the subscription
      updateSubscription(tier);
      
      // Show success and close modal
      alert(`Successfully upgraded to ${SUBSCRIPTION_PLANS[tier].name}!`);
      onClose();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = [
    { tier: 'free' as SubscriptionTier, plan: SUBSCRIPTION_PLANS.free },
    { tier: 'premium' as SubscriptionTier, plan: SUBSCRIPTION_PLANS.premium },
    { tier: 'pro' as SubscriptionTier, plan: SUBSCRIPTION_PLANS.pro },
  ];

  const getPrice = (tier: SubscriptionTier) => {
    const plan = SUBSCRIPTION_PLANS[tier];
    if (tier === 'free') return '$0';
    return billingCycle === 'monthly' 
      ? `$${plan.price.monthly}/month`
      : `$${plan.price.yearly}/year`;
  };

  const getSavings = (tier: SubscriptionTier) => {
    if (tier === 'free' || billingCycle === 'monthly') return null;
    const plan = SUBSCRIPTION_PLANS[tier];
    const monthlyCost = plan.price.monthly * 12;
    const savings = monthlyCost - plan.price.yearly;
    return `Save $${savings.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(({ tier, plan }) => {
              const isCurrentPlan = subscription.currentTier === tier;
              const isHighlighted = tier === highlightTier;
              const savings = getSavings(tier);

              return (
                <div
                  key={tier}
                  className={`relative rounded-lg border-2 p-6 ${
                    isHighlighted
                      ? 'border-blue-500 bg-blue-50'
                      : isCurrentPlan
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Popular Badge */}
                  {tier === 'premium' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">{getPrice(tier)}</span>
                      {tier !== 'free' && billingCycle === 'yearly' && (
                        <div className="text-sm text-green-600 font-medium mt-1">{savings}</div>
                      )}
                    </div>

                    {/* Features List */}
                    <ul className="text-left space-y-2 mb-6 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    {isCurrentPlan ? (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed"
                      >
                        Current Plan
                      </button>
                    ) : tier === 'free' ? (
                      <button
                        onClick={() => handleUpgrade('free')}
                        className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                      >
                        Downgrade to Free
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(tier)}
                        disabled={isProcessing}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          isHighlighted
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isProcessing ? 'Processing...' : `Upgrade to ${plan.name}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
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