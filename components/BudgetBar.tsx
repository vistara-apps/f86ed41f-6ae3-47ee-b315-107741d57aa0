'use client';

import { Budget } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface BudgetBarProps {
  budget: Budget;
  variant?: 'progress';
}

export function BudgetBar({ budget, variant = 'progress' }: BudgetBarProps) {
  const percentage = budget.estimatedAmount > 0 
    ? Math.min((budget.allocatedAmount / budget.estimatedAmount) * 100, 100)
    : 0;

  const isOverBudget = budget.allocatedAmount > budget.estimatedAmount;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-textPrimary">{budget.category}</h3>
        <span className="text-sm text-textSecondary">
          {formatCurrency(budget.allocatedAmount)} / {formatCurrency(budget.estimatedAmount)}
        </span>
      </div>
      
      {variant === 'progress' && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isOverBudget ? 'bg-red-500' : 'bg-accent'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-textSecondary">
            <span>{percentage.toFixed(0)}% used</span>
            {isOverBudget && (
              <span className="text-red-500 font-medium">Over budget</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
