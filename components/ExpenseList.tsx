'use client';

import { Expense } from '@/lib/types';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

interface ExpenseListProps {
  expenses: Expense[];
  onEditExpense?: (expense: Expense) => void;
  onDeleteExpense?: (expenseId: string) => void;
}

export function ExpenseList({ expenses, onEditExpense, onDeleteExpense }: ExpenseListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryIcon = (category?: string) => {
    const icons: { [key: string]: string } = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Accommodation': '🏨',
      'Activities': '🎯',
      'Shopping': '🛍️',
      'Other': '📦',
    };
    return icons[category || 'Other'] || '📦';
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-textPrimary mb-2">No expenses yet</h3>
        <p className="text-textSecondary">Add your first shared expense to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses
        .sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
        .map(expense => (
          <div key={expense.expenseId} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-textPrimary">{expense.description}</h4>
                    <span className="text-xs text-textSecondary bg-gray-100 px-2 py-1 rounded">
                      {expense.category || 'Other'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-textSecondary mb-2">
                    <span>Paid by {expense.paidByName}</span>
                    <span>•</span>
                    <span>{formatDate(expense.expenseDate)}</span>
                  </div>
                  <div className="text-sm text-textSecondary">
                    Split {expense.allocationType === 'equal' ? 'equally' : 'custom'} among {expense.allocations.length} people
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-textPrimary">
                  {formatCurrency(expense.amount)}
                </div>
                {onEditExpense && onDeleteExpense && (
                  <div className="flex space-x-1 mt-2">
                    <button
                      onClick={() => onEditExpense(expense)}
                      className="text-xs text-primary hover:text-primary/80 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteExpense(expense.expenseId)}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Allocation details */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-textSecondary mb-2">Split details:</div>
              <div className="grid grid-cols-2 gap-2">
                {expense.allocations.map(allocation => (
                  <div key={allocation.userId} className="flex justify-between text-sm">
                    <span className="text-textSecondary">{allocation.userName}</span>
                    <span className="font-medium">{formatCurrency(allocation.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

