export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function calculateBalances(expenses: any[], members: any[]): any[] {
  const balances: { [userId: string]: number } = {};
  
  // Initialize balances
  members.forEach(member => {
    balances[member.userId] = 0;
  });
  
  // Calculate balances from expenses
  expenses.forEach(expense => {
    // Person who paid gets credited
    balances[expense.paidById] += expense.amount;
    
    // Each person allocated gets debited
    expense.allocations.forEach((allocation: any) => {
      balances[allocation.userId] -= allocation.amount;
    });
  });
  
  return members.map(member => ({
    userId: member.userId,
    userName: member.displayName,
    amount: balances[member.userId],
  }));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
