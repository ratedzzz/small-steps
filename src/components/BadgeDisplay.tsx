// src/components/BadgeDisplay.tsx

import React, { useState, useEffect } from 'react';
import { 
  Badge, 
  UserStats, 
  getRarityColor, 
  getRarityGradient, 
  calculateBadgeProgress,
  calculateTotalPoints,
  getUserLevel,
  getAllBadges,
  getBadgesByCategory 
} from '../utils/rewardBadges';
import '../styles/BadgeDisplay.css';

// Individual Badge Component
interface BadgeCardProps {
  badge: Badge;
  isEarned: boolean;
  progress?: number;
  isNew?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function BadgeCard({ badge, isEarned, progress = 0, isNew = false, onClick, size = 'medium' }: BadgeCardProps) {
  const sizeClass = `badge-${size}`;
  const iconSizeClass = `badge-icon-${size}`;
  const rarityClass = `badge-${badge.rarity}`;
  
  // Convert progress to nearest 5% for CSS class
  const progressClass = `progress-${Math.round(progress / 5) * 5}`;

  return (
    <div 
      className={`relative ${sizeClass} cursor-pointer group badge-card`}
      onClick={onClick}
    >
      {/* Badge Container */}
      <div className={`
        w-full h-full rounded-lg border-2 transition-all duration-200
        ${isEarned 
          ? `${getRarityColor(badge.rarity)} ${rarityClass} shadow-md group-hover:shadow-lg` 
          : 'bg-gray-100 border-gray-300 badge-unearned'
        }
        ${isNew ? 'badge-new ring-2 ring-yellow-400' : ''}
      `}>
        
        {/* Badge Icon */}
        <div className="flex items-center justify-center h-2/3 pt-2">
          <span className={iconSizeClass}>
            {badge.icon}
          </span>
        </div>

        {/* Badge Name */}
        <div className="px-1 pb-1 h-1/3 flex items-center justify-center">
          <span className={`text-xs text-center font-medium leading-tight ${
            isEarned ? 'text-gray-800' : 'text-gray-500'
          }`}>
            {badge.name}
          </span>
        </div>

        {/* Progress Bar for Unearned Badges */}
        {!isEarned && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
            <div className={`h-full progress-fill-blue progress-bar ${progressClass}`} />
          </div>
        )}

        {/* New Badge Indicator */}
        {isNew && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs">✨</span>
          </div>
        )}

        {/* Rarity Indicator */}
        <div className={`absolute top-1 left-1 px-1 py-0.5 rounded text-xs font-bold ${
          isEarned ? getRarityColor(badge.rarity) : 'bg-gray-200 text-gray-500'
        }`}>
          {badge.rarity.charAt(0).toUpperCase()}
        </div>

        {/* Points */}
        {isEarned && (
          <div className="absolute top-1 right-1 text-xs font-bold text-gray-600">
            +{badge.points}
          </div>
        )}
      </div>
    </div>
  );
}

// Badge Detail Modal
interface BadgeDetailModalProps {
  badge: Badge | null;
  isEarned: boolean;
  progress: number;
  onClose: () => void;
}

export function BadgeDetailModal({ badge, isEarned, progress, onClose }: BadgeDetailModalProps) {
  if (!badge) return null;

  // Convert progress to nearest 5% for CSS class
  const progressClass = `progress-${Math.round(progress / 5) * 5}`;
  const gradientClass = getRarityGradient(badge.rarity);

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full modal-content">
        <div className={`bg-gradient-to-r ${gradientClass} p-6 text-white rounded-t-lg`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{badge.icon}</span>
              <div>
                <h2 className="text-xl font-bold">{badge.name}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/20`}>
                  {badge.rarity.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1 w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
          
          <p className="text-white/90 mb-4">{badge.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Category: {badge.category}</span>
            <span className="text-white font-bold">+{badge.points} points</span>
          </div>
        </div>

        <div className="p-6">
          {isEarned ? (
            <div className="text-center">
              <div className="text-green-600 text-4xl mb-2">🎉</div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">Congratulations!</h3>
              <p className="text-gray-600">You've earned this badge!</p>
              {badge.unlockedAt && (
                <p className="text-sm text-gray-500 mt-2">
                  Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div className={`progress-fill-blue h-3 rounded-full progress-bar ${progressClass}`} />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-800 mb-1">How to earn:</h4>
                <p className="text-sm text-gray-600">
                  {getCriteriaDescription(badge)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to describe badge criteria
function getCriteriaDescription(badge: Badge): string {
  const { criteria } = badge;
  
  switch (criteria.type) {
    case 'total_completions':
      return criteria.habitCategory 
        ? `Complete ${criteria.value} habits in the ${criteria.habitCategory} category`
        : `Complete ${criteria.value} habits in total`;
    
    case 'streak':
      return `Maintain a ${criteria.value}-day streak on any habit`;
    
    case 'habit_count':
      return `Create ${criteria.value} different habits`;
    
    case 'goal_completion':
      return `Complete ${criteria.value} goal${criteria.value > 1 ? 's' : ''}`;
    
    case 'perfect_week':
      return `Complete all your habits for ${criteria.value} consecutive days`;
    
    case 'comeback':
      return `Get back on track after missing ${criteria.value}+ days`;
    
    case 'early_bird':
      return `Complete habits before 8 AM for ${criteria.value} days`;
    
    case 'night_owl':
      return `Complete habits after 10 PM for ${criteria.value} days`;
    
    case 'weekend_warrior':
      return `Complete habits on weekends for ${criteria.value} consecutive weeks`;
    
    case 'variety':
      return `Have habits in ${criteria.value} different categories`;
    
    default:
      return badge.description;
  }
}

// Badge Gallery Component
interface BadgeGalleryProps {
  earnedBadgeIds: string[];
  userStats: UserStats;
  showOnlyEarned?: boolean;
  onToggleEarnedOnly?: (value: boolean) => void;
}

export function BadgeGallery({ earnedBadgeIds, userStats, showOnlyEarned = false, onToggleEarnedOnly }: BadgeGalleryProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const allBadges = getAllBadges();
  const categories = ['all', 'streak', 'consistency', 'milestone', 'variety', 'special'];
  
  const filteredBadges = allBadges.filter(badge => {
    const categoryMatch = selectedCategory === 'all' || badge.category === selectedCategory;
    const earnedMatch = !showOnlyEarned || earnedBadgeIds.includes(badge.id);
    return categoryMatch && earnedMatch;
  });

  const totalPoints = calculateTotalPoints(earnedBadgeIds);
  const userLevel = getUserLevel(totalPoints);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with Level Info */}
      <div className="header-gradient-blue-purple text-white rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Badge Collection</h1>
            <p className="text-blue-100">
              {earnedBadgeIds.length} of {allBadges.length} badges earned
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{userLevel.level}</div>
            <div className="text-sm text-blue-100">{userLevel.title}</div>
            <div className="text-xs text-blue-200">{totalPoints} points</div>
          </div>
        </div>
        
        {/* Level Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to {userLevel.nextLevelPoints !== Infinity ? `Level ${userLevel.level + 1}` : 'Max Level'}</span>
            <span>{totalPoints} / {userLevel.nextLevelPoints !== Infinity ? userLevel.nextLevelPoints : totalPoints}</span>
          </div>
          <div className="w-full bg-blue-700 rounded-full h-2">
            <div className={`progress-fill-yellow h-2 rounded-full level-progress-bar ${
              userLevel.nextLevelPoints !== Infinity 
                ? `progress-${Math.round((totalPoints / userLevel.nextLevelPoints) * 100 / 5) * 5}`
                : 'progress-100'
            }`} />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'category-filter-active'
                : 'category-filter-inactive'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Toggle for showing only earned badges */}
      <div className="flex items-center gap-2 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyEarned}
            onChange={(e) => {
              if (onToggleEarnedOnly) {
                onToggleEarnedOnly(e.target.checked);
              }
            }}
            className="rounded"
          />
          <span className="text-sm text-gray-600">Show only earned badges</span>
        </label>
      </div>

      {/* Badge Grid - Show All Badges */}
      <div className="badge-grid mb-6">
        {filteredBadges.map(badge => {
          const isEarned = earnedBadgeIds.includes(badge.id);
          const progress = calculateBadgeProgress(badge, userStats);
          
          return (
            <BadgeCard
              key={badge.id}
              badge={badge}
              isEarned={isEarned}
              progress={progress}
              onClick={() => setSelectedBadge(badge)}
              size="medium"
            />
          );
        })}
      </div>

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No badges found</h3>
          <p className="text-gray-500">
            {showOnlyEarned 
              ? "You haven't earned any badges in this category yet. Keep working on your habits!"
              : "No badges available in this category."
            }
          </p>
        </div>
      )}

      {/* Badge Detail Modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        isEarned={selectedBadge ? earnedBadgeIds.includes(selectedBadge.id) : false}
        progress={selectedBadge ? calculateBadgeProgress(selectedBadge, userStats) : 0}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  );
}

// New Badge Notification Component
interface NewBadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
  onViewCollection: () => void;
}

export function NewBadgeNotification({ badge, onClose, onViewCollection }: NewBadgeNotificationProps) {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Extract gradient class to avoid inline style warning
  const gradientClass = getRarityGradient(badge.rarity);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`bg-gradient-to-r ${gradientClass} p-4 rounded-lg shadow-lg text-white badge-notification-enter`}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{badge.icon}</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Badge Earned! 🎉</h3>
            <h4 className="font-semibold">{badge.name}</h4>
            <p className="text-sm opacity-90 mb-2">{badge.description}</p>
            <div className="text-xs opacity-75">+{badge.points} points</div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 w-6 h-6 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={onViewCollection}
            className="notification-button-primary px-3 py-1 rounded text-xs"
          >
            View Collection
          </button>
          <button
            onClick={onClose}
            className="notification-button-secondary px-3 py-1 rounded text-xs"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

// Badge Summary Widget for Dashboard - CLEANED UP VERSION
interface BadgeSummaryWidgetProps {
  earnedBadgeIds: string[];
  recentBadges: Badge[];
  totalPoints: number;
  userLevel: { level: number; title: string };
}

export function BadgeSummaryWidget({ 
  earnedBadgeIds, 
  recentBadges, 
  totalPoints, 
  userLevel
}: BadgeSummaryWidgetProps) {
  const allBadges = getAllBadges();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>🏆</span>
          Achievements
        </h3>
      </div>

      {/* Level and Points */}
      <div className="flex items-center justify-between mb-4 p-3 widget-gradient-light rounded-lg">
        <div>
          <div className="text-sm text-gray-600">Level {userLevel.level}</div>
          <div className="font-semibold text-gray-900">{userLevel.title}</div>
          <div className="text-sm text-gray-500">{totalPoints} points</div>
        </div>
      </div>

      {/* Earned Badges Display */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Badges Earned {earnedBadgeIds.length} / {allBadges.length}</h4>
        </div>
        
        {earnedBadgeIds.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {allBadges
              .filter(badge => earnedBadgeIds.includes(badge.id))
              .map(badge => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  isEarned={true}
                  size="small"
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-sm">No badges earned yet</p>
            <p className="text-xs">Complete habits to earn your first badge!</p>
          </div>
        )}
      </div>

      {/* Progress Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`progress-fill-blue h-2 rounded-full progress-bar progress-${Math.round((earnedBadgeIds.length / allBadges.length) * 100 / 5) * 5}`} />
        </div>
      </div>
    </div>
  );
}