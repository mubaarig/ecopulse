import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { CompanySearch } from '@/components/features/company-search';
import { RecentSearches } from '@/components/features/recent-search';
import { StatsGrid } from '@/components/features/stats-grid';
import { Link } from '@/navigation';
import { locales, type Locale } from '../../../i18n/config';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, common] = await Promise.all([getTranslations('dashboard'), getTranslations('common')]);
  const localeList = locales as readonly Locale[];
  const localeFlags: Record<Locale, string> = {
    en: '🇬🇧',
    de: '🇩🇪',
  };
  const localeNames: Record<Locale, string> = {
    en: common('localeName.en'),
    de: common('localeName.de'),
  };
  const currentLocale = localeList.includes(locale as Locale) ? (locale as Locale) : localeList[0];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-5 ml-5 mt-5 space-x-5">
        <div className="flex items-center space-x-4">
          {/* <Image src="/ecopulse-logo.png" alt="EcoPulse logo" /> */}
          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/ecopulse-logo.png"
              // width={100} height={50} priority
              width={0} // Set to 0 as it will be controlled by CSS
              height={0} // Set to 0 as it will be controlled by CSS
              sizes="100vw" // Recommended for responsive images
              style={{ width: '100%', height: 'auto' }}
              alt={common('logoAlt')}
            />
          </Link>
           <div className="flex justify-center gap-2">
          {localeList.map((code) => {
            const isActive = code === currentLocale;
            return (
              <Link
                key={code}
                href="/"
                locale={code}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase transition ${
                  isActive
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-emerald-100 bg-white text-gray-600 shadow-sm hover:border-emerald-300 hover:text-emerald-600'
                }`}
                aria-label={common('languageButtonLabel', {
                  locale: localeNames[code] ?? code.toUpperCase(),
                })}
              >
                <span aria-hidden="true" className="text-base">
                  {localeFlags[code] ?? '🌐'}
                </span>
                {code}
              </Link>
            );
          })}
        </div>
        </div>
       
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{t('heroTitle')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('heroSubtitle')}</p>
      </div>

      {/* Main Search */}
      <CompanySearch />

      {/* Stats Preview */}
      <StatsGrid />
      {/* <StatsGrid2/> */}

      {/* Recent Searches */}
      <RecentSearches />
      <hr />

      {/* <RecentSearches2 /> */}
    </div>
  );
}
