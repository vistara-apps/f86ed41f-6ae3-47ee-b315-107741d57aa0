'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { ExpenseList } from '@/components/ExpenseList';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { MemberBalanceCard } from '@/components/MemberBalanceCard';
import { PaymentButton } from '@/components/PaymentButton';
import { BudgetBar } from '@/components/BudgetBar';
import { useGroup, useData } from '@/lib/hooks/useData';
import { Expense, Balance } from '@/lib/types';

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const { group, balances, expenses, budgets } = useGroup(groupId);
  const { removeExpense } = useData();

  const [activeTab, setActiveTab] = useState<'expenses' | 'balances' | 'budget'>('expenses');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<Balance | null>(null);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseModal(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseModal(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      removeExpense(expenseId);
    }
  };

  const handleExpenseModalClose = () => {
    setShowExpenseModal(false);
    setEditingExpense(null);
  };

  const handlePayment = (result: { success: boolean; transactionId?: string; error?: string }) => {
    setShowPaymentModal(null);

    if (result.success) {
      alert(`Payment processed successfully! Transaction ID: ${result.transactionId || 'N/A'}`);
    } else {
      alert(`Payment failed: ${result.error || 'Unknown error'}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!group) {
    return (
      <AppShell title="Loading..." showBack onBack={() => router.back()}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </AppShell>
    );
  }

  const userBalance = balances.find(b => b.userName === 'You')?.amount || 0;

  return (
    <>
      <AppShell
        title={group.groupName}
        showBack
        onBack={() => router.back()}
        actions={
          <button
            onClick={handleAddExpense}
            className="btn-primary text-sm px-4 py-2"
          >
            Add Expense
          </button>
        }
      >
        {/* Trip Info */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-textPrimary">{group.tripDestination}</h2>
              <p className="text-sm text-textSecondary">
                {formatDate(group.startDate)} - {formatDate(group.endDate)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-textPrimary">
                {formatCurrency(group.totalExpenses)}
              </div>
              <div className="text-sm text-textSecondary">Total spent</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-textSecondary">Your balance</span>
            <span className={`font-semibold ${
              userBalance > 0 ? 'text-green-600' :
              userBalance < 0 ? 'text-red-600' :
              'text-textSecondary'
            }`}>
              {userBalance === 0
                ? 'Settled up'
                : `${userBalance > 0 ? '+' : ''}${formatCurrency(userBalance)}`
              }
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'expenses', label: 'Expenses' },
            { key: 'balances', label: 'Balances' },
            { key: 'budget', label: 'Budget' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-surface text-textPrimary shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-textPrimary">Recent Expenses</h3>
              <span className="text-sm text-textSecondary">{expenses.length} items</span>
            </div>

            <ExpenseList
              expenses={expenses}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
        )}

        {activeTab === 'balances' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-textPrimary">Group Balances</h3>

            <div className="space-y-3">
              {balances.map(balance => (
                <MemberBalanceCard
                  key={balance.userId}
                  balance={balance}
                  variant={balance.amount < 0 ? 'owing' : balance.amount > 0 ? 'owed' : undefined}
                  onSettle={balance.amount < 0 && balance.userName === 'You' ?
                    () => setShowPaymentModal(balance) : undefined
                  }
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-textPrimary">Budget Overview</h3>
              <button className="text-sm text-primary hover:underline">
                Edit Budget
              </button>
            </div>

            <div className="space-y-3">
              {budgets.map(budget => (
                <BudgetBar key={budget.budgetId} budget={budget} variant="progress" />
              ))}
            </div>

            <div className="card">
              <h4 className="font-medium text-textPrimary mb-3">Budget Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-textSecondary">Total Budget</span>
                  <span className="font-medium">
                    {formatCurrency(budgets.reduce((sum, b) => sum + b.estimatedAmount, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Spent So Far</span>
                  <span className="font-medium">
                    {formatCurrency(budgets.reduce((sum, b) => sum + b.allocatedAmount, 0))}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-textSecondary">Remaining</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(
                      budgets.reduce((sum, b) => sum + b.estimatedAmount, 0) -
                      budgets.reduce((sum, b) => sum + b.allocatedAmount, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AppShell>

      {/* Add/Edit Expense Modal */}
      <AddExpenseModal
        groupId={groupId}
        members={group.members}
        isOpen={showExpenseModal}
        onClose={handleExpenseModalClose}
        editExpense={editingExpense}
      />

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl w-full max-w-sm animate-fade-in">
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-textPrimary mb-2">
                  Settle Up
                </h3>
                <p className="text-textSecondary">
                  Pay {formatCurrency(Math.abs(showPaymentModal.amount))} to {showPaymentModal.userName}
                </p>
              </div>

              <div className="space-y-4">
                <PaymentButton
                  amount={Math.abs(showPaymentModal.amount)}
                  recipientName={showPaymentModal.userName}
                  onPayment={handlePayment}
                  variant="baseWallet"
                />

                <button
                  onClick={() => setShowPaymentModal(null)}
                  className="btn-secondary w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
