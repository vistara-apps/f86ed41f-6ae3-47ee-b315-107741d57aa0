'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/lib/hooks/useData';
import { Expense, User } from '@/lib/types';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

interface AddExpenseModalProps {
  groupId: string;
  members: User[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editExpense?: Expense | null;
}

export function AddExpenseModal({
  groupId,
  members,
  isOpen,
  onClose,
  onSuccess,
  editExpense
}: AddExpenseModalProps) {
  const { addExpense, updateExpense } = useData();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidById: '',
    expenseDate: new Date().toISOString().split('T')[0],
    category: '',
    allocationType: 'equal' as 'equal' | 'custom',
  });
  const [customAllocations, setCustomAllocations] = useState<{ [userId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize form when editing
  useEffect(() => {
    if (editExpense) {
      setFormData({
        description: editExpense.description,
        amount: editExpense.amount.toString(),
        paidById: editExpense.paidById,
        expenseDate: editExpense.expenseDate,
        category: editExpense.category || '',
        allocationType: editExpense.allocationType,
      });

      // Initialize custom allocations
      if (editExpense.allocationType === 'custom') {
        const allocations: { [userId: string]: string } = {};
        editExpense.allocations.forEach(allocation => {
          allocations[allocation.userId] = allocation.amount.toString();
        });
        setCustomAllocations(allocations);
      }
    } else {
      // Reset form for new expense
      setFormData({
        description: '',
        amount: '',
        paidById: '',
        expenseDate: new Date().toISOString().split('T')[0],
        category: '',
        allocationType: 'equal',
      });
      setCustomAllocations({});
    }
  }, [editExpense, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData.paidById) {
      newErrors.paidById = 'Please select who paid';
    }

    if (!formData.expenseDate) {
      newErrors.expenseDate = 'Date is required';
    }

    if (formData.allocationType === 'custom') {
      const totalCustom = Object.values(customAllocations).reduce((sum, amount) => {
        return sum + (parseFloat(amount) || 0);
      }, 0);

      if (Math.abs(totalCustom - parseFloat(formData.amount)) > 0.01) {
        newErrors.allocations = 'Custom allocations must equal the total amount';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomAllocationChange = (userId: string, amount: string) => {
    setCustomAllocations(prev => ({
      ...prev,
      [userId]: amount,
    }));
  };

  const getEqualAllocation = () => {
    const amount = parseFloat(formData.amount) || 0;
    return amount / members.length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const amount = parseFloat(formData.amount);
      const paidByUser = members.find(m => m.userId === formData.paidById);

      if (!paidByUser) {
        throw new Error('Invalid payer selected');
      }

      let allocations;

      if (formData.allocationType === 'equal') {
        const equalAmount = amount / members.length;
        allocations = members.map(member => ({
          userId: member.userId,
          userName: member.displayName,
          amount: equalAmount,
        }));
      } else {
        allocations = members.map(member => ({
          userId: member.userId,
          userName: member.displayName,
          amount: parseFloat(customAllocations[member.userId] || '0'),
        }));
      }

      const expenseData = {
        groupId,
        description: formData.description,
        amount,
        paidById: formData.paidById,
        paidByName: paidByUser.displayName,
        expenseDate: formData.expenseDate,
        allocationType: formData.allocationType,
        allocations,
        category: formData.category,
      };

      if (editExpense) {
        updateExpense({
          ...expenseData,
          expenseId: editExpense.expenseId,
        });
      } else {
        addExpense(expenseData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      setErrors({ submit: 'Failed to save expense. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-textPrimary">
              {editExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Dinner at Sushi Restaurant"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-textSecondary">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            {/* Paid By */}
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Paid By
              </label>
              <select
                value={formData.paidById}
                onChange={(e) => setFormData(prev => ({ ...prev, paidById: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select who paid</option>
                {members.map(member => (
                  <option key={member.userId} value={member.userId}>
                    {member.displayName}
                  </option>
                ))}
              </select>
              {errors.paidById && <p className="text-red-500 text-sm mt-1">{errors.paidById}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.expenseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expenseDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.expenseDate && <p className="text-red-500 text-sm mt-1">{errors.expenseDate}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select category</option>
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Allocation Type */}
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Split Method
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="equal"
                    checked={formData.allocationType === 'equal'}
                    onChange={(e) => setFormData(prev => ({ ...prev, allocationType: e.target.value as 'equal' }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Split equally</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="custom"
                    checked={formData.allocationType === 'custom'}
                    onChange={(e) => setFormData(prev => ({ ...prev, allocationType: e.target.value as 'custom' }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Custom split</span>
                </label>
              </div>
            </div>

            {/* Custom Allocations */}
            {formData.allocationType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Custom Split
                </label>
                <div className="space-y-2">
                  {members.map(member => (
                    <div key={member.userId} className="flex items-center space-x-2">
                      <span className="flex-1 text-sm">{member.displayName}</span>
                      <div className="relative w-24">
                        <span className="absolute left-2 top-2 text-xs text-textSecondary">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={customAllocations[member.userId] || ''}
                          onChange={(e) => handleCustomAllocationChange(member.userId, e.target.value)}
                          className="w-full pl-5 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {errors.allocations && <p className="text-red-500 text-sm mt-1">{errors.allocations}</p>}
              </div>
            )}

            {/* Preview */}
            {formData.amount && formData.allocationType === 'equal' && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-textSecondary mb-1">Each person pays:</div>
                <div className="font-semibold text-textPrimary">
                  ${getEqualAllocation().toFixed(2)}
                </div>
              </div>
            )}

            {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-textPrimary rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (editExpense ? 'Update Expense' : 'Add Expense')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

