'use client';

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { CompanySearch } from '@/components/features/company-search';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/navigation';
import { locales, type Locale } from '../../../i18n/config';

const NAV_LINKS = [
  { labelKey: 'dashboard', href: '/' },
  { labelKey: 'methodology', href: '/#methodology' },
];

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const isCompanyPage = pathname.includes('/company/');
  const tHeader = useTranslations('header');
  const tCommon = useTranslations('common');
  const localeList = locales as readonly Locale[];
  const localeNames: Record<Locale, string> = {
    en: tCommon('localeName.en'),
    de: tCommon('localeName.de'),
  };
  const localeFlags: Record<Locale, string> = {
    en: '🇬🇧',
    de: '🇩🇪',
  };
  const currentLocale = localeList.includes(locale as Locale)
    ? (locale as Locale)
    : localeList[0];
  const handleLocaleChange = (targetLocale: Locale) => {
    if (targetLocale === currentLocale) {
      return;
    }
    router.push(pathname || '/', { locale: targetLocale });
  };

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
              <span className="text-sm font-medium">{tHeader('back')}</span>
            </button>
          )}

          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/ecopulse-logo.png"
              width={100} // Set to 0 as it will be controlled by CSS
              height={50} // Set to 0 as it will be controlled by CSS
              sizes="100vw" // Recommended for responsive images
              style={{ width: '100%', height: 'auto' }}
              alt={tCommon('logoAlt')}
            />
          </Link>
        </div>

        {!isCompanyPage && (
          <div className="flex flex-1 items-center justify-center px-8">
            <CompanySearch />
          </div>
        )}

        <div className="flex items-center space-x-4">
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
                <span>{tHeader(`nav.${link.labelKey}`)}</span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {localeList.map((code) => {
              const isActive = code === currentLocale;
              const flag = localeFlags[code] ?? '🌐';
              const label = localeNames[code] ?? code.toUpperCase();

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleLocaleChange(code)}
                  className={`inline-flex items-center justify-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase transition ${
                    isActive
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'border-emerald-100 bg-white text-gray-600 shadow-sm hover:border-emerald-300 hover:text-emerald-600'
                  }`}
                  title={tHeader('languageToggle', { locale: label })}
                  aria-label={tHeader('languageToggle', { locale: label })}
                  aria-pressed={isActive}
                >
                  <span aria-hidden="true">{flag}</span>
                  {code}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
