import { MiniKit } from '@coinbase/minikit';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentOptions {
  amount: number;
  recipientAddress: string;
  recipientName: string;
  description?: string;
}

/**
 * Process a payment using Base Wallet
 */
export async function processPayment(options: PaymentOptions): Promise<PaymentResult> {
  try {
    const { amount, recipientAddress, recipientName, description } = options;

    // Check if MiniKit is available
    if (!MiniKit.isInstalled()) {
      return {
        success: false,
        error: 'Base Wallet is not installed. Please install Base Wallet to make payments.',
      };
    }

    // Convert amount to wei (assuming USD for now - in production you'd need proper conversion)
    const amountInWei = BigInt(Math.floor(amount * 1e18)); // Simplified conversion

    // Create payment payload
    const payload = {
      type: 'payment',
      data: {
        amount: amountInWei.toString(),
        currency: 'USD',
        recipient: recipientAddress,
        description: description || `Payment to ${recipientName}`,
      },
    };

    // Send payment request to MiniKit
    const response = await MiniKit.sendTransaction(payload);

    if (response.success) {
      return {
        success: true,
        transactionId: response.transactionId,
      };
    } else {
      return {
        success: false,
        error: response.error || 'Payment failed',
      };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during payment processing',
    };
  }
}

/**
 * Get user's wallet address from MiniKit
 */
export async function getUserWalletAddress(): Promise<string | null> {
  try {
    if (!MiniKit.isInstalled()) {
      return null;
    }

    const walletInfo = await MiniKit.getWalletInfo();
    return walletInfo.address || null;
  } catch (error) {
    console.error('Error getting wallet address:', error);
    return null;
  }
}

/**
 * Check if user can make payments
 */
export function canMakePayments(): boolean {
  return MiniKit.isInstalled();
}

/**
 * Format amount for display
 */
export function formatPaymentAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Validate wallet address
 */
export function isValidWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Simulate payment for development/testing
 */
export async function simulatePayment(options: PaymentOptions): Promise<PaymentResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate success/failure randomly (90% success rate)
  const success = Math.random() > 0.1;

  if (success) {
    return {
      success: true,
      transactionId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } else {
    return {
      success: false,
      error: 'Simulated payment failure',
    };
  }
}

