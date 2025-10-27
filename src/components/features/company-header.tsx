'use client';

import { CompanyDetails } from '@/types';
import { Building2, MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface CompanyHeaderProps {
  company: CompanyDetails;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  const t = useTranslations('company');
  const trendKey = ['up', 'down', 'stable'].includes(company.esgScore.trend)
    ? (company.esgScore.trend as 'up' | 'down' | 'stable')
    : 'stable';

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                {company.ticker}
              </span>
            </div>

            <p className="text-gray-600">{company.description}</p>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {company.headquarters && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{company.headquarters}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Building2 className="h-4 w-4" />
                <span>{company.industry}</span>
              </div>
              {company.marketCap && (
                <div className="flex items-center space-x-1">
                  <span>{t('marketCap', { value: `$${formatNumber(company.marketCap)}` })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ESG Trend Indicator */}
        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
          {getTrendIcon(trendKey)}
          <span
            className={`text-sm font-medium ${
              trendKey === 'up'
                ? 'text-green-700'
                : trendKey === 'down'
                  ? 'text-red-700'
                  : 'text-gray-700'
            }`}
          >
            {t(`trend.${trendKey}`)}
          </span>
        </div>
      </div>
    </div>
  );
}
