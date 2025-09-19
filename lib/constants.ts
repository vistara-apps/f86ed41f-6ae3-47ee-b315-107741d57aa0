export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Accommodation',
  'Activities',
  'Shopping',
  'Other',
] as const;

export const SAMPLE_GROUPS = [
  {
    groupId: '1',
    groupName: 'Tokyo Adventure',
    tripDestination: 'Tokyo, Japan',
    startDate: '2024-03-15',
    endDate: '2024-03-22',
    members: [
      { userId: '1', displayName: 'You', avatarUrl: '/avatars/you.png' },
      { userId: '2', displayName: 'Alice', avatarUrl: '/avatars/alice.png' },
      { userId: '3', displayName: 'Bob', avatarUrl: '/avatars/bob.png' },
    ],
    totalExpenses: 2840.50,
    userBalance: -125.30,
  },
  {
    groupId: '2',
    groupName: 'Bali Getaway',
    tripDestination: 'Bali, Indonesia',
    startDate: '2024-04-10',
    endDate: '2024-04-17',
    members: [
      { userId: '1', displayName: 'You', avatarUrl: '/avatars/you.png' },
      { userId: '4', displayName: 'Charlie', avatarUrl: '/avatars/charlie.png' },
    ],
    totalExpenses: 1650.00,
    userBalance: 85.50,
  },
];

export const SAMPLE_EXPENSES = [
  {
    expenseId: '1',
    groupId: '1',
    description: 'Dinner at Sushi Restaurant',
    amount: 180.00,
    paidById: '2',
    paidByName: 'Alice',
    expenseDate: '2024-03-16',
    allocationType: 'equal' as const,
    allocations: [
      { userId: '1', userName: 'You', amount: 60.00 },
      { userId: '2', userName: 'Alice', amount: 60.00 },
      { userId: '3', userName: 'Bob', amount: 60.00 },
    ],
    category: 'Food & Dining',
  },
  {
    expenseId: '2',
    groupId: '1',
    description: 'Taxi to Airport',
    amount: 45.00,
    paidById: '1',
    paidByName: 'You',
    expenseDate: '2024-03-22',
    allocationType: 'equal' as const,
    allocations: [
      { userId: '1', userName: 'You', amount: 15.00 },
      { userId: '2', userName: 'Alice', amount: 15.00 },
      { userId: '3', userName: 'Bob', amount: 15.00 },
    ],
    category: 'Transportation',
  },
];
