// src/hooks/useSubscription.ts

import React, { useState, useEffect, createContext, useContext } from 'react';
import { SubscriptionTier, SubscriptionPlan, SUBSCRIPTION_PLANS } from '../types/subscription';

interface SubscriptionState {
  currentTier: SubscriptionTier;
  plan: SubscriptionPlan;
  isActive: boolean;
  expiresAt?: Date;
}

interface SubscriptionContextType {
  subscription: SubscriptionState;
  updateSubscription: (tier: SubscriptionTier) => void;
  canUseFeature: (feature: keyof SubscriptionPlan['limits']) => boolean;
  hasReachedLimit: (limitType: 'habits' | 'goals', currentCount: number) => boolean;
  upgradeRequired: (feature: keyof SubscriptionPlan['limits']) => SubscriptionTier | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

export function useSubscriptionLogic() {
  const [subscription, setSubscription] = useState<SubscriptionState>({
    currentTier: 'free',
    plan: SUBSCRIPTION_PLANS.free,
    isActive: true,
  });

  // Load subscription from storage (localStorage for web, AsyncStorage for mobile)
  useEffect(() => {
    const savedSubscription = localStorage.getItem('subscription');
    if (savedSubscription) {
      try {
        const parsed = JSON.parse(savedSubscription);
        // Validate that the parsed tier is valid
        if (parsed.currentTier && SUBSCRIPTION_PLANS[parsed.currentTier as SubscriptionTier]) {
          setSubscription({
            ...parsed,
            plan: SUBSCRIPTION_PLANS[parsed.currentTier as SubscriptionTier],
            expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : undefined,
          });
        }
      } catch (error) {
        console.error('Failed to parse saved subscription:', error);
      }
    }
  }, []);

  // Save subscription to storage
  const updateSubscription = (tier: SubscriptionTier) => {
    const newSubscription: SubscriptionState = {
      currentTier: tier,
      plan: SUBSCRIPTION_PLANS[tier],
      isActive: true,
      expiresAt: tier !== 'free' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined, // 30 days from now
    };
    
    setSubscription(newSubscription);
    localStorage.setItem('subscription', JSON.stringify(newSubscription));
  };

  // Check if user can use a specific feature
  const canUseFeature = (feature: keyof SubscriptionPlan['limits']): boolean => {
    return subscription.plan.limits[feature] === true;
  };

  // Check if user has reached a limit
  const hasReachedLimit = (limitType: 'habits' | 'goals', currentCount: number): boolean => {
    const limitKey = limitType === 'habits' ? 'maxHabits' : 'maxGoals';
    const limit = subscription.plan.limits[limitKey];
    
    if (limit === 'unlimited') return false;
    return currentCount >= (limit as number);
  };

  // Determine which tier is required for a feature
  const upgradeRequired = (feature: keyof SubscriptionPlan['limits']): SubscriptionTier | null => {
    if (canUseFeature(feature)) return null;
    
    // Check if premium has this feature
    if (SUBSCRIPTION_PLANS.premium.limits[feature]) return 'premium';
    
    // Check if pro has this feature
    if (SUBSCRIPTION_PLANS.pro.limits[feature]) return 'pro';
    
    return null;
  };

  return {
    subscription,
    updateSubscription,
    canUseFeature,
    hasReachedLimit,
    upgradeRequired,
  };
}

// Provider component
interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const subscriptionLogic = useSubscriptionLogic();

  return React.createElement(
    SubscriptionContext.Provider,
    { value: subscriptionLogic },
    children
  );
}