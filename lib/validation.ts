// Validation utilities for forms and data

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export interface ValidationRule {
  field: string;
  rule: (value: any) => boolean;
  message: string;
}

// Common validation rules
export const validationRules = {
  required: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
  },

  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  minLength: (min: number) => (value: string): boolean => {
    return value.length >= min;
  },

  maxLength: (max: number) => (value: string): boolean => {
    return value.length <= max;
  },

  numeric: (value: any): boolean => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },

  positive: (value: number): boolean => {
    return value > 0;
  },

  walletAddress: (value: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(value);
  },

  farcasterHandle: (value: string): boolean => {
    return /^@[a-zA-Z0-9_]{1,15}$/.test(value);
  },

  date: (value: string): boolean => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  },

  futureDate: (value: string): boolean => {
    const date = new Date(value);
    const now = new Date();
    return date > now;
  },

  dateRange: (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start < end;
  },
};

// Validation helper functions
export function validateField(value: any, rules: ValidationRule[]): string | null {
  for (const { rule, message } of rules) {
    if (!rule(value)) {
      return message;
    }
  }
  return null;
}

export function validateForm(data: { [key: string]: any }, rules: { [key: string]: ValidationRule[] }): ValidationResult {
  const errors: { [key: string]: string } = {};
  let isValid = true;

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(data[field], fieldRules);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

// Specific validation schemas
export const tripValidationSchema = {
  groupName: [
    { rule: validationRules.required, message: 'Trip name is required' },
    { rule: validationRules.minLength(2), message: 'Trip name must be at least 2 characters' },
    { rule: validationRules.maxLength(50), message: 'Trip name must be less than 50 characters' },
  ],
  tripDestination: [
    { rule: validationRules.required, message: 'Destination is required' },
    { rule: validationRules.minLength(2), message: 'Destination must be at least 2 characters' },
    { rule: validationRules.maxLength(100), message: 'Destination must be less than 100 characters' },
  ],
  startDate: [
    { rule: validationRules.required, message: 'Start date is required' },
    { rule: validationRules.date, message: 'Invalid date format' },
  ],
  endDate: [
    { rule: validationRules.required, message: 'End date is required' },
    { rule: validationRules.date, message: 'Invalid date format' },
  ],
};

export const expenseValidationSchema = {
  description: [
    { rule: validationRules.required, message: 'Description is required' },
    { rule: validationRules.minLength(2), message: 'Description must be at least 2 characters' },
    { rule: validationRules.maxLength(100), message: 'Description must be less than 100 characters' },
  ],
  amount: [
    { rule: validationRules.required, message: 'Amount is required' },
    { rule: validationRules.numeric, message: 'Amount must be a valid number' },
    { rule: validationRules.positive, message: 'Amount must be positive' },
  ],
  paidById: [
    { rule: validationRules.required, message: 'Please select who paid' },
  ],
  expenseDate: [
    { rule: validationRules.required, message: 'Date is required' },
    { rule: validationRules.date, message: 'Invalid date format' },
  ],
};

export const userValidationSchema = {
  displayName: [
    { rule: validationRules.required, message: 'Name is required' },
    { rule: validationRules.minLength(1), message: 'Name cannot be empty' },
    { rule: validationRules.maxLength(50), message: 'Name must be less than 50 characters' },
  ],
  walletAddress: [
    { rule: (value: string) => !value || validationRules.walletAddress(value), message: 'Invalid wallet address format' },
  ],
  farcasterId: [
    { rule: (value: string) => !value || validationRules.farcasterHandle(value), message: 'Invalid Farcaster handle format' },
  ],
};

// Utility functions for common validations
export function validateTripDates(startDate: string, endDate: string): string | null {
  if (!validationRules.dateRange(startDate, endDate)) {
    return 'End date must be after start date';
  }
  return null;
}

export function validateExpenseAllocations(amount: number, allocations: { amount: number }[]): string | null {
  const total = allocations.reduce((sum, alloc) => sum + alloc.amount, 0);
  const difference = Math.abs(total - amount);

  if (difference > 0.01) { // Allow for small floating point errors
    return `Allocations must equal the total amount (difference: $${difference.toFixed(2)})`;
  }

  return null;
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function formatValidationErrors(errors: { [key: string]: string }): string {
  return Object.values(errors).join('. ');
}

