'use client';

import { useState } from 'react';

interface PaymentButtonProps {
  amount: number;
  recipientName: string;
  onPayment: () => void;
  variant?: 'baseWallet';
}

export function PaymentButton({ 
  amount, 
  recipientName, 
  onPayment,
  variant = 'baseWallet' 
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onPayment();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
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
          <span>Pay ${amount.toFixed(2)} to {recipientName}</span>
        </>
      )}
    </button>
  );
}
