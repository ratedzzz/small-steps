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

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full modal-content">
        <div className={`bg-gradient-to-r ${getRarityGradient(badge.rarity)} p-6 text-white rounded-t-lg`}>
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

      {/* Badge Grid */}
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

[{
	"resource": "/c:/Users/zzzis/small-steps/src/components/BadgeDisplay.tsx",
	"owner": "typescript",
	"code": "2304",
	"severity": 8,
	"message": "Cannot find name 'gradientClass'.",
	"source": "ts",
	"startLineNumber": 374,
	"startColumn": 43,
	"endLineNumber": 374,
	"endColumn": 56,
	"origin": "extHost1"
},{
	"resource": "/c:/Users/zzzis/small-steps/src/components/BadgeDisplay.tsx",
	"owner": "typescript",
	"code": "2353",
	"severity": 8,
	"message": "Object literal may only specify known properties, and 'animation' does not exist in type 'ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<...>'.",
	"source": "ts",
	"startLineNumber": 376,
	"startColumn": 11,
	"endLineNumber": 376,
	"endColumn": 20,
	"origin": "extHost1"
},{
	"resource": "/c:/Users/zzzis/small-steps/src/components/BadgeDisplay.tsx",
	"owner": "typescript",
	"code": "1382",
	"severity": 8,
	"message": "Unexpected token. Did you mean `{'>'}` or `&gt;`?",
	"source": "ts",
	"startLineNumber": 378,
	"startColumn": 7,
	"endLineNumber": 378,
	"endColumn": 8,
	"origin": "extHost1"
}]
// Badge Summary Widget for Dashboard
interface BadgeSummaryWidgetProps {
  earnedBadgeIds: string[];
  recentBadges: Badge[];
  totalPoints: number;
  userLevel: { level: number; title: string };
  onViewAll: () => void;
}

export function BadgeSummaryWidget({ 
  earnedBadgeIds, 
  recentBadges, 
  totalPoints, 
  userLevel, 
  onViewAll 
}: BadgeSummaryWidgetProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>🏆</span>
          Achievements
        </h3>
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View All
        </button>
      </div>

      {/* Level and Points */}
      <div className="flex items-center justify-between mb-4 p-3 widget-gradient-light rounded-lg">
        <div>
          <div className="text-sm text-gray-600">Level {userLevel.level}</div>
          <div className="font-semibold text-gray-900">{userLevel.title}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">{totalPoints}</div>
          <div className="text-xs text-gray-500">points</div>
        </div>
      </div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Badges</h4>
          <div className="flex gap-2 overflow-x-auto">
            {recentBadges.slice(0, 4).map(badge => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isEarned={true}
                size="small"
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Badges Earned</span>
          <span className="font-medium">{earnedBadgeIds.length} / {getAllBadges().length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div className={`progress-fill-blue h-2 rounded-full progress-bar progress-${Math.round((earnedBadgeIds.length / getAllBadges().length) * 100 / 5) * 5}`} />
        </div>
      </div>
    </div>
  );
}