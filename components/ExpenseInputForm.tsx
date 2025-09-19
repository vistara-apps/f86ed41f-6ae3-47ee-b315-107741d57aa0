'use client';

import { useState } from 'react';
import { EXPENSE_CATEGORIES } from '@/lib/constants';
import { User } from '@/lib/types';

interface ExpenseInputFormProps {
  members: User[];
  onSubmit: (expense: {
    description: string;
    amount: number;
    paidById: string;
    category: string;
    allocationType: 'equal' | 'custom';
    allocations: { userId: string; amount: number }[];
  }) => void;
  onCancel: () => void;
  variant?: 'simple' | 'detailedAllocation';
}

export function ExpenseInputForm({ 
  members, 
  onSubmit, 
  onCancel,
  variant = 'simple' 
}: ExpenseInputFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState(members[0]?.userId || '');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [allocationType, setAllocationType] = useState<'equal' | 'custom'>('equal');
  const [customAllocations, setCustomAllocations] = useState<{ [userId: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseAmount = parseFloat(amount);
    if (!description || !expenseAmount || !paidById) return;

    let allocations;
    if (allocationType === 'equal') {
      const perPerson = expenseAmount / members.length;
      allocations = members.map(member => ({
        userId: member.userId,
        amount: perPerson,
      }));
    } else {
      allocations = members.map(member => ({
        userId: member.userId,
        amount: parseFloat(customAllocations[member.userId] || '0'),
      }));
    }

    onSubmit({
      description,
      amount: expenseAmount,
      paidById,
      category,
      allocationType,
      allocations,
    });
  };

  const totalCustomAllocation = Object.values(customAllocations)
    .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-surface rounded-t-xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Add Expense</h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this expense for?"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-field pl-8"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Paid by
              </label>
              <select
                value={paidById}
                onChange={(e) => setPaidById(e.target.value)}
                className="input-field"
                required
              >
                {members.map(member => (
                  <option key={member.userId} value={member.userId}>
                    {member.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {variant === 'detailedAllocation' && (
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Split type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="equal"
                      checked={allocationType === 'equal'}
                      onChange={(e) => setAllocationType(e.target.value as 'equal')}
                      className="mr-2"
                    />
                    Equal split
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="custom"
                      checked={allocationType === 'custom'}
                      onChange={(e) => setAllocationType(e.target.value as 'custom')}
                      className="mr-2"
                    />
                    Custom amounts
                  </label>
                </div>

                {allocationType === 'custom' && (
                  <div className="mt-4 space-y-3">
                    {members.map(member => (
                      <div key={member.userId} className="flex items-center space-x-3">
                        <span className="flex-1 text-sm">{member.displayName}</span>
                        <div className="relative w-24">
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-textSecondary">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            value={customAllocations[member.userId] || ''}
                            onChange={(e) => setCustomAllocations(prev => ({
                              ...prev,
                              [member.userId]: e.target.value
                            }))}
                            className="w-full px-2 py-1 pl-6 text-sm border border-gray-200 rounded"
                          />
                        </div>
                      </div>
                    ))}
                    {allocationType === 'custom' && amount && (
                      <div className="text-sm text-textSecondary">
                        Total: ${totalCustomAllocation.toFixed(2)} / ${parseFloat(amount || '0').toFixed(2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={
                  !description || 
                  !amount || 
                  !paidById ||
                  (allocationType === 'custom' && Math.abs(totalCustomAllocation - parseFloat(amount || '0')) > 0.01)
                }
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
