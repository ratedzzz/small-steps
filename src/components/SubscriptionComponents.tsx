// src/components/SubscriptionComponents.tsx

import React from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionTier, SubscriptionPlan } from '../types/subscription';

interface SubscriptionGateProps {
  children: React.ReactNode;
  feature: keyof SubscriptionPlan['limits'];
  fallback?: React.ReactNode;
  requiredTier?: SubscriptionTier;
}

export function SubscriptionGate({ children, feature, fallback, requiredTier }: SubscriptionGateProps) {
  const { canUseFeature, upgradeRequired } = useSubscription();

  if (canUseFeature(feature)) {
    return <>{children}</>;
  }

  const tierNeeded = upgradeRequired(feature);
  
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
      <div className="text-gray-600 mb-2">
        This feature requires {tierNeeded === 'premium' ? 'Premium' : 'Pro'} subscription
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Upgrade to {tierNeeded === 'premium' ? 'Premium' : 'Pro'}
      </button>
    </div>
  );
}

interface LimitReachedBannerProps {
  limitType: 'habits' | 'goals';
  currentCount: number;
  onUpgrade: () => void;
}

export function LimitReachedBanner({ limitType, currentCount, onUpgrade }: LimitReachedBannerProps) {
  const { hasReachedLimit, subscription } = useSubscription();

  if (!hasReachedLimit(limitType, currentCount)) {
    return null;
  }

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