// src/types/subscription.ts

export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  limits: {
    maxHabits: number | 'unlimited';
    maxGoals: number | 'unlimited';
    historyDays: number | 'unlimited';
    cloudSync: boolean;
    analytics: boolean;
    customCategories: boolean;
    exportData: boolean;
    prioritySupport: boolean;
    advancedGoals: boolean;
    socialFeatures: boolean;
    customBadges: boolean;
    advancedScheduling: boolean;
    healthAppIntegration: boolean;
  };
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    id: 'free_tier',
    name: 'Free',
    tier: 'free',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      'Up to 3 active habits',
      'Basic badge system',
      'Daily inspiration quotes',
      '7-day habit history',
      'Core habit tracking'
    ],
    limits: {
      maxHabits: 3,
      maxGoals: 2,
      historyDays: 7,
      cloudSync: false,
      analytics: false,
      customCategories: false,
      exportData: false,
      prioritySupport: false,
      advancedGoals: false,
      socialFeatures: false,
      customBadges: false,
      advancedScheduling: false,
      healthAppIntegration: false,
    }
  },
  premium: {
    id: 'premium_monthly',
    name: 'Premium',
    tier: 'premium',
    price: {
      monthly: 4.99,
      yearly: 39.99,
    },
    features: [
      'Unlimited habits and goals',
      'Advanced analytics and insights',
      'Custom categories and templates',
      'Cloud sync across devices',
      'Export your data',
      'Priority customer support',
      'All basic features'
    ],
    limits: {
      maxHabits: 'unlimited',
      maxGoals: 'unlimited',
      historyDays: 'unlimited',
      cloudSync: true,
      analytics: true,
      customCategories: true,
      exportData: true,
      prioritySupport: true,
      advancedGoals: false,
      socialFeatures: false,
      customBadges: false,
      advancedScheduling: false,
      healthAppIntegration: false,
    }
  },
  pro: {
    id: 'pro_monthly',
    name: 'Pro',
    tier: 'pro',
    price: {
      monthly: 9.99,
      yearly: 79.99,
    },
    features: [
      'Everything in Premium',
      'Advanced goal milestones',
      'Habit sharing and social features',
      'Create custom badges',
      'Advanced scheduling options',
      'Health app integrations',
      'Detailed progress reports',
      'Advanced analytics dashboard'
    ],
    limits: {
      maxHabits: 'unlimited',
      maxGoals: 'unlimited',
      historyDays: 'unlimited',
      cloudSync: true,
      analytics: true,
      customCategories: true,
      exportData: true,
      prioritySupport: true,
      advancedGoals: true,
      socialFeatures: true,
      customBadges: true,
      advancedScheduling: true,
      healthAppIntegration: true,
    }
  }
};