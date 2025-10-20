import type { Metadata } from 'next';
import { Providers } from './providers';
import { ToastProvider } from '@/components/ui/toast-provider';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EcoPulse - AI-Powered Sustainable Investment Dashboard',
  description:
    'Visualize and analyze the environmental, social, and governance impact of public companies.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ToastProvider />
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
