import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ErrorBoundary } from '@/components/error-boundary';
import { ToastProvider } from '@/components/ui/toast-provider';
import { Providers } from '../providers';
import { defaultLocale, locales, type Locale } from '../../../i18n/config';

export const metadata: Metadata = {
  title: 'EcoPulse - AI-Powered Sustainable Investment Dashboard',
  description:
    'Visualize and analyze the environmental, social, and governance impact of public companies.',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await paramsPromise;
  const localeParam = (params?.locale ?? defaultLocale) as Locale;

  if (!locales.includes(localeParam)) {
    notFound();
  }

  setRequestLocale(localeParam);

  const messages = await getMessages({ locale: localeParam });

  return (
    <ErrorBoundary>
      <NextIntlClientProvider locale={localeParam} messages={messages}>
        <Providers>
          <ToastProvider />
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {children}
          </div>
        </Providers>
      </NextIntlClientProvider>
    </ErrorBoundary>
  );
}
