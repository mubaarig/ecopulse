'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { CompanySearch } from '@/components/features/company-search';

const NAV_LINKS = [
  { label: 'Dashboard', href: '/' },
  { label: 'Methodology', href: '/#methodology' },
];

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isCompanyPage = pathname.includes('/company/');

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/85 backdrop-blur">
      <link rel="icon" href="/icon?<generated>" type="image/<generated>" sizes="<generated>" />
      <div className="flex h-16 items-center px-8">
        <div className="flex items-center space-x-4">
          {isCompanyPage && (
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}

          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/ecopulse-logo.png"
              width={100} // Set to 0 as it will be controlled by CSS
              height={50} // Set to 0 as it will be controlled by CSS
              sizes="100vw" // Recommended for responsive images
              style={{ width: '100%', height: 'auto' }}
              alt="Logo"
            />
          </Link>
        </div>

        {!isCompanyPage && (
          <div className="flex flex-1 items-center justify-center px-8">
            <CompanySearch />
          </div>
        )}

        <nav className="flex items-center space-x-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-1 text-gray-600 transition-colors hover:text-emerald-600"
            >
              <span className="text-emerald-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                •
              </span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
