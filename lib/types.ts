export interface User {
  userId: string;
  farcasterId?: string;
  walletAddress?: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Group {
  groupId: string;
  groupName: string;
  tripDestination: string;
  startDate: string;
  endDate: string;
  members: User[];
  totalExpenses: number;
  userBalance: number;
}

export interface Expense {
  expenseId: string;
  groupId: string;
  description: string;
  amount: number;
  paidById: string;
  paidByName: string;
  expenseDate: string;
  allocationType: 'equal' | 'custom';
  allocations: ExpenseAllocation[];
  category?: string;
}

export interface ExpenseAllocation {
  userId: string;
  userName: string;
  amount: number;
}

export interface Budget {
  budgetId: string;
  groupId: string;
  category: string;
  estimatedAmount: number;
  allocatedAmount: number;
}

export interface Contribution {
  contributionId: string;
  groupId: string;
  userId: string;
  userName: string;
  amount: number;
  contributionDate: string;
}

export interface Balance {
  userId: string;
  userName: string;
  amount: number; // positive = owed to them, negative = they owe
}
