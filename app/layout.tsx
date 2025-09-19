import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'TripSplitter',
  description: 'Effortlessly manage shared trip expenses and settle up with friends.',
  openGraph: {
    title: 'TripSplitter',
    description: 'Effortlessly manage shared trip expenses and settle up with friends.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-bg">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
