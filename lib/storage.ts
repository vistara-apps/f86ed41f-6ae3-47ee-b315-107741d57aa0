import { User, Group, Expense, Budget, Contribution } from './types';

const STORAGE_KEYS = {
  USERS: 'tripsplitter_users',
  GROUPS: 'tripsplitter_groups',
  EXPENSES: 'tripsplitter_expenses',
  BUDGETS: 'tripsplitter_budgets',
  CONTRIBUTIONS: 'tripsplitter_contributions',
} as const;

// Generic storage utilities
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Specific data access functions
export const userStorage = {
  getAll: (): User[] => storage.get<User[]>(STORAGE_KEYS.USERS) || [],
  setAll: (users: User[]): void => storage.set(STORAGE_KEYS.USERS, users),
  add: (user: User): void => {
    const users = userStorage.getAll();
    const existingIndex = users.findIndex(u => u.userId === user.userId);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    userStorage.setAll(users);
  },
  getById: (userId: string): User | null => {
    const users = userStorage.getAll();
    return users.find(u => u.userId === userId) || null;
  },
  remove: (userId: string): void => {
    const users = userStorage.getAll().filter(u => u.userId !== userId);
    userStorage.setAll(users);
  },
};

export const groupStorage = {
  getAll: (): Group[] => storage.get<Group[]>(STORAGE_KEYS.GROUPS) || [],
  setAll: (groups: Group[]): void => storage.set(STORAGE_KEYS.GROUPS, groups),
  add: (group: Group): void => {
    const groups = groupStorage.getAll();
    const existingIndex = groups.findIndex(g => g.groupId === group.groupId);
    if (existingIndex >= 0) {
      groups[existingIndex] = group;
    } else {
      groups.push(group);
    }
    groupStorage.setAll(groups);
  },
  getById: (groupId: string): Group | null => {
    const groups = groupStorage.getAll();
    return groups.find(g => g.groupId === groupId) || null;
  },
  remove: (groupId: string): void => {
    const groups = groupStorage.getAll().filter(g => g.groupId !== groupId);
    groupStorage.setAll(groups);
  },
};

export const expenseStorage = {
  getAll: (): Expense[] => storage.get<Expense[]>(STORAGE_KEYS.EXPENSES) || [],
  setAll: (expenses: Expense[]): void => storage.set(STORAGE_KEYS.EXPENSES, expenses),
  add: (expense: Expense): void => {
    const expenses = expenseStorage.getAll();
    const existingIndex = expenses.findIndex(e => e.expenseId === expense.expenseId);
    if (existingIndex >= 0) {
      expenses[existingIndex] = expense;
    } else {
      expenses.push(expense);
    }
    expenseStorage.setAll(expenses);
  },
  getById: (expenseId: string): Expense | null => {
    const expenses = expenseStorage.getAll();
    return expenses.find(e => e.expenseId === expenseId) || null;
  },
  getByGroupId: (groupId: string): Expense[] => {
    const expenses = expenseStorage.getAll();
    return expenses.filter(e => e.groupId === groupId);
  },
  remove: (expenseId: string): void => {
    const expenses = expenseStorage.getAll().filter(e => e.expenseId !== expenseId);
    expenseStorage.setAll(expenses);
  },
};

export const budgetStorage = {
  getAll: (): Budget[] => storage.get<Budget[]>(STORAGE_KEYS.BUDGETS) || [],
  setAll: (budgets: Budget[]): void => storage.set(STORAGE_KEYS.BUDGETS, budgets),
  add: (budget: Budget): void => {
    const budgets = budgetStorage.getAll();
    const existingIndex = budgets.findIndex(b => b.budgetId === budget.budgetId);
    if (existingIndex >= 0) {
      budgets[existingIndex] = budget;
    } else {
      budgets.push(budget);
    }
    budgetStorage.setAll(budgets);
  },
  getById: (budgetId: string): Budget | null => {
    const budgets = budgetStorage.getAll();
    return budgets.find(b => b.budgetId === budgetId) || null;
  },
  getByGroupId: (groupId: string): Budget[] => {
    const budgets = budgetStorage.getAll();
    return budgets.filter(b => b.groupId === groupId);
  },
  remove: (budgetId: string): void => {
    const budgets = budgetStorage.getAll().filter(b => b.budgetId !== budgetId);
    budgetStorage.setAll(budgets);
  },
};

export const contributionStorage = {
  getAll: (): Contribution[] => storage.get<Contribution[]>(STORAGE_KEYS.CONTRIBUTIONS) || [],
  setAll: (contributions: Contribution[]): void => storage.set(STORAGE_KEYS.CONTRIBUTIONS, contributions),
  add: (contribution: Contribution): void => {
    const contributions = contributionStorage.getAll();
    contributions.push(contribution);
    contributionStorage.setAll(contributions);
  },
  getById: (contributionId: string): Contribution | null => {
    const contributions = contributionStorage.getAll();
    return contributions.find(c => c.contributionId === contributionId) || null;
  },
  getByGroupId: (groupId: string): Contribution[] => {
    const contributions = contributionStorage.getAll();
    return contributions.filter(c => c.groupId === groupId);
  },
  remove: (contributionId: string): void => {
    const contributions = contributionStorage.getAll().filter(c => c.contributionId !== contributionId);
    contributionStorage.setAll(contributions);
  },
};

// Utility functions for data management
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateBalances = (groupId: string): { [userId: string]: number } => {
  const expenses = expenseStorage.getByGroupId(groupId);
  const contributions = contributionStorage.getByGroupId(groupId);
  const balances: { [userId: string]: number } = {};

  // Calculate expense balances
  expenses.forEach(expense => {
    // Add amount paid by user
    if (!balances[expense.paidById]) {
      balances[expense.paidById] = 0;
    }
    balances[expense.paidById] += expense.amount;

    // Subtract allocated amounts from each user
    expense.allocations.forEach(allocation => {
      if (!balances[allocation.userId]) {
        balances[allocation.userId] = 0;
      }
      balances[allocation.userId] -= allocation.amount;
    });
  });

  // Add contributions
  contributions.forEach(contribution => {
    if (!balances[contribution.userId]) {
      balances[contribution.userId] = 0;
    }
    balances[contribution.userId] += contribution.amount;
  });

  return balances;
};

export const getGroupTotalExpenses = (groupId: string): number => {
  const expenses = expenseStorage.getByGroupId(groupId);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getGroupTotalContributions = (groupId: string): number => {
  const contributions = contributionStorage.getByGroupId(groupId);
  return contributions.reduce((total, contribution) => total + contribution.amount, 0);
};

