'use client';

import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: ReactNode;
}

export function AppShell({ 
  children, 
  title = 'TripSplitter',
  showBack = false,
  onBack,
  actions 
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-4 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {showBack && (
                <button
                  onClick={onBack}
                  className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h1 className="text-xl font-semibold text-textPrimary">{title}</h1>
            </div>
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-md mx-auto">
        {children}
      </main>
    </div>
  );
}
