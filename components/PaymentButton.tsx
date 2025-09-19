'use client';

import { useState } from 'react';
import { processPayment, simulatePayment, canMakePayments, formatPaymentAmount } from '@/lib/payment';

interface PaymentButtonProps {
  amount: number;
  recipientName: string;
  recipientAddress?: string;
  onPayment: (result: { success: boolean; transactionId?: string; error?: string }) => void;
  variant?: 'baseWallet';
}

export function PaymentButton({
  amount,
  recipientName,
  recipientAddress,
  onPayment,
  variant = 'baseWallet'
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      let result;

      if (canMakePayments() && recipientAddress) {
        // Use real Base Wallet payment
        result = await processPayment({
          amount,
          recipientAddress,
          recipientName,
          description: `TripSplitter payment to ${recipientName}`,
        });
      } else {
        // Use simulated payment for development
        result = await simulatePayment({
          amount,
          recipientAddress: recipientAddress || '0x0000000000000000000000000000000000000000',
          recipientName,
          description: `TripSplitter payment to ${recipientName}`,
        });
      }

      if (result.success) {
        onPayment(result);
      } else {
        setError(result.error || 'Payment failed');
        onPayment(result);
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during payment';
      setError(errorMessage);
      onPayment({ success: false, error: errorMessage });
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethod = canMakePayments() ? 'Base Wallet' : 'Demo Payment';

  return (
    <div className="space-y-2">
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="btn-primary w-full flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span>Pay {formatPaymentAmount(amount)} to {recipientName}</span>
          </>
        )}
      </button>

      <div className="text-center">
        <span className="text-xs text-textSecondary">
          via {paymentMethod}
        </span>
      </div>

      {error && (
        <div className="text-center">
          <span className="text-xs text-red-500">{error}</span>
        </div>
      )}
    </div>
  );
}
