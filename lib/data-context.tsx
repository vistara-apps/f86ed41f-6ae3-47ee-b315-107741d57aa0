'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Group, Expense, Budget, Contribution, Balance } from './types';
import {
  userStorage,
  groupStorage,
  expenseStorage,
  budgetStorage,
  contributionStorage,
  generateId,
  calculateBalances,
  getGroupTotalExpenses,
  getGroupTotalContributions,
} from './storage';

// Action types
type DataAction =
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'REMOVE_USER'; payload: string }
  | { type: 'SET_GROUPS'; payload: Group[] }
  | { type: 'ADD_GROUP'; payload: Group }
  | { type: 'UPDATE_GROUP'; payload: Group }
  | { type: 'REMOVE_GROUP'; payload: string }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'REMOVE_EXPENSE'; payload: string }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'REMOVE_BUDGET'; payload: string }
  | { type: 'SET_CONTRIBUTIONS'; payload: Contribution[] }
  | { type: 'ADD_CONTRIBUTION'; payload: Contribution }
  | { type: 'REMOVE_CONTRIBUTION'; payload: string };

// State interface
interface DataState {
  users: User[];
  groups: Group[];
  expenses: Expense[];
  budgets: Budget[];
  contributions: Contribution[];
  currentUser: User | null;
}

// Initial state
const initialState: DataState = {
  users: [],
  groups: [],
  expenses: [],
  budgets: [],
  contributions: [],
  currentUser: null,
};

// Reducer
function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.userId === action.payload.userId ? action.payload : user
        ),
      };
    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.userId !== action.payload),
      };
    case 'SET_GROUPS':
      return { ...state, groups: action.payload };
    case 'ADD_GROUP':
      return { ...state, groups: [...state.groups, action.payload] };
    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map(group =>
          group.groupId === action.payload.groupId ? action.payload : group
        ),
      };
    case 'REMOVE_GROUP':
      return {
        ...state,
        groups: state.groups.filter(group => group.groupId !== action.payload),
      };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.expenseId === action.payload.expenseId ? action.payload : expense
        ),
      };
    case 'REMOVE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.expenseId !== action.payload),
      };
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.budgetId === action.payload.budgetId ? action.payload : budget
        ),
      };
    case 'REMOVE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.budgetId !== action.payload),
      };
    case 'SET_CONTRIBUTIONS':
      return { ...state, contributions: action.payload };
    case 'ADD_CONTRIBUTION':
      return { ...state, contributions: [...state.contributions, action.payload] };
    case 'REMOVE_CONTRIBUTION':
      return {
        ...state,
        contributions: state.contributions.filter(contribution => contribution.contributionId !== action.payload),
      };
    default:
      return state;
  }
}

// Context
interface DataContextType {
  state: DataState;
  // User actions
  addUser: (user: Omit<User, 'userId'>) => void;
  updateUser: (user: User) => void;
  removeUser: (userId: string) => void;
  getUserById: (userId: string) => User | null;
  setCurrentUser: (user: User | null) => void;

  // Group actions
  addGroup: (group: Omit<Group, 'groupId'>) => void;
  updateGroup: (group: Group) => void;
  removeGroup: (groupId: string) => void;
  getGroupById: (groupId: string) => Group | null;
  getGroupBalances: (groupId: string) => Balance[];
  getGroupTotalExpenses: (groupId: string) => number;
  getGroupTotalContributions: (groupId: string) => number;

  // Expense actions
  addExpense: (expense: Omit<Expense, 'expenseId'>) => void;
  updateExpense: (expense: Expense) => void;
  removeExpense: (expenseId: string) => void;
  getExpensesByGroupId: (groupId: string) => Expense[];
  getExpenseById: (expenseId: string) => Expense | null;

  // Budget actions
  addBudget: (budget: Omit<Budget, 'budgetId'>) => void;
  updateBudget: (budget: Budget) => void;
  removeBudget: (budgetId: string) => void;
  getBudgetsByGroupId: (groupId: string) => Budget[];

  // Contribution actions
  addContribution: (contribution: Omit<Contribution, 'contributionId'>) => void;
  removeContribution: (contributionId: string) => void;
  getContributionsByGroupId: (groupId: string) => Contribution[];
}

const DataContext = createContext<DataContextType | null>(null);

// Provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const users = userStorage.getAll();
    const groups = groupStorage.getAll();
    const expenses = expenseStorage.getAll();
    const budgets = budgetStorage.getAll();
    const contributions = contributionStorage.getAll();

    dispatch({ type: 'SET_USERS', payload: users });
    dispatch({ type: 'SET_GROUPS', payload: groups });
    dispatch({ type: 'SET_EXPENSES', payload: expenses });
    dispatch({ type: 'SET_BUDGETS', payload: budgets });
    dispatch({ type: 'SET_CONTRIBUTIONS', payload: contributions });
  }, []);

  // User actions
  const addUser = (userData: Omit<User, 'userId'>) => {
    const user: User = { ...userData, userId: generateId() };
    dispatch({ type: 'ADD_USER', payload: user });
    userStorage.add(user);
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
    userStorage.add(user);
  };

  const removeUser = (userId: string) => {
    dispatch({ type: 'REMOVE_USER', payload: userId });
    userStorage.remove(userId);
  };

  const getUserById = (userId: string): User | null => {
    return state.users.find(user => user.userId === userId) || null;
  };

  const setCurrentUser = (user: User | null) => {
    // For now, we'll store this in localStorage separately
    if (user) {
      localStorage.setItem('tripsplitter_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tripsplitter_current_user');
    }
  };

  // Group actions
  const addGroup = (groupData: Omit<Group, 'groupId'>) => {
    const group: Group = {
      ...groupData,
      groupId: generateId(),
      totalExpenses: 0,
      userBalance: 0,
    };
    dispatch({ type: 'ADD_GROUP', payload: group });
    groupStorage.add(group);
  };

  const updateGroup = (group: Group) => {
    dispatch({ type: 'UPDATE_GROUP', payload: group });
    groupStorage.add(group);
  };

  const removeGroup = (groupId: string) => {
    dispatch({ type: 'REMOVE_GROUP', payload: groupId });
    groupStorage.remove(groupId);
  };

  const getGroupById = (groupId: string): Group | null => {
    return state.groups.find(group => group.groupId === groupId) || null;
  };

  const getGroupBalances = (groupId: string): Balance[] => {
    const balances = calculateBalances(groupId);
    const group = getGroupById(groupId);

    if (!group) return [];

    return group.members.map(member => ({
      userId: member.userId,
      userName: member.displayName,
      amount: balances[member.userId] || 0,
    }));
  };

  const getGroupTotalExpenses = (groupId: string): number => {
    return getGroupTotalExpenses(groupId);
  };

  const getGroupTotalContributions = (groupId: string): number => {
    return getGroupTotalContributions(groupId);
  };

  // Expense actions
  const addExpense = (expenseData: Omit<Expense, 'expenseId'>) => {
    const expense: Expense = { ...expenseData, expenseId: generateId() };
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
    expenseStorage.add(expense);

    // Update group totals
    const group = getGroupById(expense.groupId);
    if (group) {
      const updatedGroup = {
        ...group,
        totalExpenses: getGroupTotalExpenses(expense.groupId),
      };
      updateGroup(updatedGroup);
    }
  };

  const updateExpense = (expense: Expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
    expenseStorage.add(expense);

    // Update group totals
    const group = getGroupById(expense.groupId);
    if (group) {
      const updatedGroup = {
        ...group,
        totalExpenses: getGroupTotalExpenses(expense.groupId),
      };
      updateGroup(updatedGroup);
    }
  };

  const removeExpense = (expenseId: string) => {
    const expense = state.expenses.find(e => e.expenseId === expenseId);
    dispatch({ type: 'REMOVE_EXPENSE', payload: expenseId });
    expenseStorage.remove(expenseId);

    // Update group totals if expense was found
    if (expense) {
      const group = getGroupById(expense.groupId);
      if (group) {
        const updatedGroup = {
          ...group,
          totalExpenses: getGroupTotalExpenses(expense.groupId),
        };
        updateGroup(updatedGroup);
      }
    }
  };

  const getExpensesByGroupId = (groupId: string): Expense[] => {
    return state.expenses.filter(expense => expense.groupId === groupId);
  };

  const getExpenseById = (expenseId: string): Expense | null => {
    return state.expenses.find(expense => expense.expenseId === expenseId) || null;
  };

  // Budget actions
  const addBudget = (budgetData: Omit<Budget, 'budgetId'>) => {
    const budget: Budget = { ...budgetData, budgetId: generateId() };
    dispatch({ type: 'ADD_BUDGET', payload: budget });
    budgetStorage.add(budget);
  };

  const updateBudget = (budget: Budget) => {
    dispatch({ type: 'UPDATE_BUDGET', payload: budget });
    budgetStorage.add(budget);
  };

  const removeBudget = (budgetId: string) => {
    dispatch({ type: 'REMOVE_BUDGET', payload: budgetId });
    budgetStorage.remove(budgetId);
  };

  const getBudgetsByGroupId = (groupId: string): Budget[] => {
    return state.budgets.filter(budget => budget.groupId === groupId);
  };

  // Contribution actions
  const addContribution = (contributionData: Omit<Contribution, 'contributionId'>) => {
    const contribution: Contribution = { ...contributionData, contributionId: generateId() };
    dispatch({ type: 'ADD_CONTRIBUTION', payload: contribution });
    contributionStorage.add(contribution);

    // Update group totals
    const group = getGroupById(contribution.groupId);
    if (group) {
      const updatedGroup = {
        ...group,
        totalExpenses: getGroupTotalContributions(contribution.groupId),
      };
      updateGroup(updatedGroup);
    }
  };

  const removeContribution = (contributionId: string) => {
    const contribution = state.contributions.find(c => c.contributionId === contributionId);
    dispatch({ type: 'REMOVE_CONTRIBUTION', payload: contributionId });
    contributionStorage.remove(contributionId);

    // Update group totals if contribution was found
    if (contribution) {
      const group = getGroupById(contribution.groupId);
      if (group) {
        const updatedGroup = {
          ...group,
          totalExpenses: getGroupTotalContributions(contribution.groupId),
        };
        updateGroup(updatedGroup);
      }
    }
  };

  const getContributionsByGroupId = (groupId: string): Contribution[] => {
    return state.contributions.filter(contribution => contribution.groupId === groupId);
  };

  const contextValue: DataContextType = {
    state,
    addUser,
    updateUser,
    removeUser,
    getUserById,
    setCurrentUser,
    addGroup,
    updateGroup,
    removeGroup,
    getGroupById,
    getGroupBalances,
    getGroupTotalExpenses,
    getGroupTotalContributions,
    addExpense,
    updateExpense,
    removeExpense,
    getExpensesByGroupId,
    getExpenseById,
    addBudget,
    updateBudget,
    removeBudget,
    getBudgetsByGroupId,
    addContribution,
    removeContribution,
    getContributionsByGroupId,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

// Hook to use the data context
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

