'use client';

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { CompanySearch } from '@/components/features/company-search';

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isCompanyPage = pathname.includes('/company/');

  return (
    <header className="border-b-cyan-700 bg-gradient-to-r  bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex h-20 items-center px-8">
        {/* Back Button & Logo */}
        <div className="flex items-center space-x-4">
          {isCompanyPage && (
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <div className="flex items-center space-x-2 mt-2">
            <Image
              src="/ecopulse.png"
              alt="EcoPulse logo"
              width={100}
              height={50}
              priority
            />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            </span>
          </div>
        </div>
        
        {/* Search Bar - Only show on dashboard */}
        {!isCompanyPage && (
          <div className="flex flex-1 items-center justify-center px-8">
            <CompanySearch />
          </div>
        )}

        <nav className="flex items-center space-x-6 text-sm font-medium">
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            Dashboard
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            Methodology
          </button>
        </nav>
      </div>
    </header>
  );
}
