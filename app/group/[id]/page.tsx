'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { ExpenseInputForm } from '@/components/ExpenseInputForm';
import { MemberBalanceCard } from '@/components/MemberBalanceCard';
import { PaymentButton } from '@/components/PaymentButton';
import { BudgetBar } from '@/components/BudgetBar';
import { SAMPLE_GROUPS, SAMPLE_EXPENSES } from '@/lib/constants';
import { Group, Expense, Balance, Budget } from '@/lib/types';
import { formatCurrency, formatDate, calculateBalances, generateId } from '@/lib/utils';

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [budgets] = useState<Budget[]>([
    {
      budgetId: '1',
      groupId: groupId,
      category: 'Food & Dining',
      estimatedAmount: 800,
      allocatedAmount: 240,
    },
    {
      budgetId: '2',
      groupId: groupId,
      category: 'Transportation',
      estimatedAmount: 400,
      allocatedAmount: 45,
    },
  ]);
  
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances' | 'budget'>('expenses');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<Balance | null>(null);

  useEffect(() => {
    // Find the group
    const foundGroup = SAMPLE_GROUPS.find(g => g.groupId === groupId);
    if (foundGroup) {
      setGroup(foundGroup);
      // Filter expenses for this group
      const groupExpenses = SAMPLE_EXPENSES.filter(e => e.groupId === groupId);
      setExpenses(groupExpenses);
      // Calculate balances
      const calculatedBalances = calculateBalances(groupExpenses, foundGroup.members);
      setBalances(calculatedBalances);
    }
  }, [groupId]);

  const handleAddExpense = (expenseData: any) => {
    const newExpense: Expense = {
      expenseId: generateId(),
      groupId: groupId,
      description: expenseData.description,
      amount: expenseData.amount,
      paidById: expenseData.paidById,
      paidByName: group?.members.find(m => m.userId === expenseData.paidById)?.displayName || '',
      expenseDate: new Date().toISOString().split('T')[0],
      allocationType: expenseData.allocationType,
      allocations: expenseData.allocations.map((alloc: any) => ({
        ...alloc,
        userName: group?.members.find(m => m.userId === alloc.userId)?.displayName || '',
      })),
      category: expenseData.category,
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    
    // Recalculate balances
    if (group) {
      const calculatedBalances = calculateBalances(updatedExpenses, group.members);
      setBalances(calculatedBalances);
    }
    
    setShowExpenseForm(false);
  };

  const handlePayment = (balance: Balance) => {
    // Simulate payment processing
    console.log(`Processing payment of ${formatCurrency(Math.abs(balance.amount))} to ${balance.userName}`);
    setShowPaymentModal(null);
    
    // In a real app, this would update the backend and recalculate balances
    // For now, we'll just show a success message
    alert(`Payment of ${formatCurrency(Math.abs(balance.amount))} to ${balance.userName} processed successfully!`);
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
            onClick={() => setShowExpenseForm(true)}
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
            
            {expenses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <p className="text-textSecondary">No expenses yet. Add your first expense to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map(expense => (
                  <div key={expense.expenseId} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-textPrimary">{expense.description}</h4>
                        <p className="text-sm text-textSecondary">
                          Paid by {expense.paidByName} • {formatDate(expense.expenseDate)}
                        </p>
                        {expense.category && (
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-textSecondary rounded">
                            {expense.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-semibold text-textPrimary">
                          {formatCurrency(expense.amount)}
                        </div>
                        <div className="text-sm text-textSecondary">
                          {expense.allocationType === 'equal' ? 'Split equally' : 'Custom split'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* Expense Form Modal */}
      {showExpenseForm && group && (
        <ExpenseInputForm
          members={group.members}
          onSubmit={handleAddExpense}
          onCancel={() => setShowExpenseForm(false)}
          variant="detailedAllocation"
        />
      )}

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
                  onPayment={() => handlePayment(showPaymentModal)}
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
