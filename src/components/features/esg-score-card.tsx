'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

import { ESGScore } from '@/types';

interface ESGScoreCardProps {
  score: ESGScore;
}

const getScoreColor = (value: number) => {
  if (value >= 80) return 'text-green-600';
  if (value >= 60) return 'text-yellow-600';
  if (value >= 40) return 'text-orange-600';
  return 'text-red-600';
};

const getScoreBg = (value: number) => {
  if (value >= 80) return 'bg-green-50 border-green-200';
  if (value >= 60) return 'bg-yellow-50 border-yellow-200';
  if (value >= 40) return 'bg-orange-50 border-orange-200';
  return 'bg-red-50 border-red-200';
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-5 w-5 text-green-600" />;
    case 'down':
      return <TrendingDown className="h-5 w-5 text-red-600" />;
    default:
      return <Minus className="h-5 w-5 text-gray-600" />;
  }
};

export function ESGScoreCard({ score }: ESGScoreCardProps) {
  const t = useTranslations('company');
  const locale = useLocale();
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
      }),
    [locale],
  );

  const formattedTotal = numberFormatter.format(score.total);
  const formattedEnvironmental = numberFormatter.format(score.environmental);
  const formattedSocial = numberFormatter.format(score.social);
  const formattedGovernance = numberFormatter.format(score.governance);
  const formattedDate = dateFormatter.format(new Date(score.lastUpdated));

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('esgScore')}</h2>

      <div className="space-y-4">
        <div className={`rounded-lg border-2 p-6 text-center ${getScoreBg(score.total)}`}>
          <div className="flex items-center justify-center space-x-3">
            {getTrendIcon(score.trend)}
            <span className={`text-5xl font-bold ${getScoreColor(score.total)}`}>
              {formattedTotal}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{t('overallScore')}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{formattedEnvironmental}</div>
            <div className="text-xs font-medium text-blue-700">{t('environmental')}</div>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-center">
            <div className="text-xl font-bold text-purple-600">{formattedSocial}</div>
            <div className="text-xs font-medium text-purple-700">{t('social')}</div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center">
            <div className="text-xl font-bold text-amber-600">{formattedGovernance}</div>
            <div className="text-xs font-medium text-amber-700">{t('governance')}</div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          {t('lastUpdated', { lastUpdated: formattedDate })}
        </div>
      </div>
    </div>
  );
}
