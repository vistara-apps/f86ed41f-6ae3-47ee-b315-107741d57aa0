'use client';

import { Group } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface GroupListItemProps {
  group: Group;
  variant?: 'default' | 'withBalance';
  onClick?: () => void;
}

export function GroupListItem({ 
  group, 
  variant = 'default',
  onClick 
}: GroupListItemProps) {
  const isOwed = group.userBalance > 0;
  const owes = group.userBalance < 0;

  return (
    <div 
      className="card hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {group.groupName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-textPrimary">{group.groupName}</h3>
              <p className="text-sm text-textSecondary">{group.tripDestination}</p>
            </div>
          </div>
          
          {variant === 'withBalance' && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-textSecondary">Your balance</span>
              <span className={`font-semibold ${
                isOwed ? 'text-green-600' : owes ? 'text-red-600' : 'text-textSecondary'
              }`}>
                {group.userBalance === 0 
                  ? 'Settled up' 
                  : `${isOwed ? '+' : ''}${formatCurrency(group.userBalance)}`
                }
              </span>
            </div>
          )}
        </div>
        
        <div className="ml-4">
          <svg className="w-5 h-5 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
