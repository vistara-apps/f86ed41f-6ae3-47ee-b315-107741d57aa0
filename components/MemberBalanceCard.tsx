'use client';

import { Balance } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface MemberBalanceCardProps {
  balance: Balance;
  variant?: 'owing' | 'owed';
  onSettle?: () => void;
}

export function MemberBalanceCard({ 
  balance, 
  variant,
  onSettle 
}: MemberBalanceCardProps) {
  const isOwed = balance.amount > 0;
  const owes = balance.amount < 0;
  const isSettled = balance.amount === 0;

  const displayVariant = variant || (isOwed ? 'owed' : owes ? 'owing' : undefined);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-textPrimary font-semibold text-sm">
              {balance.userName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-textPrimary">{balance.userName}</h3>
            <p className="text-sm text-textSecondary">
              {isSettled ? 'Settled up' : 
               isOwed ? 'Owes you' : 
               'You owe'}
            </p>
          </div>
        </div>

        <div className="text-right">
          {!isSettled && (
            <>
              <div className={`font-semibold ${
                displayVariant === 'owed' ? 'text-green-600' : 
                displayVariant === 'owing' ? 'text-red-600' : 
                'text-textPrimary'
              }`}>
                {formatCurrency(Math.abs(balance.amount))}
              </div>
              {onSettle && displayVariant === 'owing' && (
                <button
                  onClick={onSettle}
                  className="text-xs text-primary hover:underline mt-1"
                >
                  Settle up
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
