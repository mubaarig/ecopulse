'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Leaf, Users, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

import { ESGScore } from '@/types';

type CategoryKey = 'environmental' | 'social' | 'governance';
type FactorKey =
  | 'carbonEmissions'
  | 'waterUsage'
  | 'wasteManagement'
  | 'employeeDiversity'
  | 'communityImpact'
  | 'laborPractices'
  | 'boardDiversity'
  | 'executivePay'
  | 'shareholderRights';

interface ScoreBreakdownProps {
  score: ESGScore;
}

interface MetricConfig {
  icon: React.ComponentType<{ className?: string }>;
  categoryKey: CategoryKey;
  score: number;
  color: string;
  bgColor: string;
  borderColor: string;
  factors: Array<{ key: FactorKey; isGood: boolean }>;
}

export function ScoreBreakdown({ score }: ScoreBreakdownProps) {
  const t = useTranslations('scoreBreakdown');

  const metrics = useMemo<MetricConfig[]>(
    () => [
      {
        icon: Leaf,
        categoryKey: 'environmental',
        score: score.environmental,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        factors: [
          { key: 'carbonEmissions', isGood: score.environmental > 70 },
          { key: 'waterUsage', isGood: score.environmental > 60 },
          { key: 'wasteManagement', isGood: score.environmental > 65 },
        ],
      },
      {
        icon: Users,
        categoryKey: 'social',
        score: score.social,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        factors: [
          { key: 'employeeDiversity', isGood: score.social > 75 },
          { key: 'communityImpact', isGood: score.social > 65 },
          { key: 'laborPractices', isGood: score.social > 70 },
        ],
      },
      {
        icon: Shield,
        categoryKey: 'governance',
        score: score.governance,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        factors: [
          { key: 'boardDiversity', isGood: score.governance > 65 },
          { key: 'executivePay', isGood: score.governance > 60 },
          { key: 'shareholderRights', isGood: score.governance > 70 },
        ],
      },
    ],
    [score.environmental, score.social, score.governance],
  );

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('title')}</h2>

      <div className="space-y-4">
        {metrics.map((metric) => {
          const CategoryIcon = metric.icon;
          const categoryLabel = t(`category.${metric.categoryKey}`);

          return (
            <div
              key={metric.categoryKey}
              className={`rounded-lg border ${metric.borderColor} ${metric.bgColor} p-4`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CategoryIcon className={`h-4 w-4 ${metric.color}`} />
                  <span className="font-medium text-gray-900">{categoryLabel}</span>
                </div>
                <span className={`text-lg font-bold ${metric.color}`}>{metric.score}</span>
              </div>

              <div className="space-y-2">
                {metric.factors.map((factor) => {
                  const factorLabel = t(`factors.${factor.key}`);

                  return (
                    <div
                      key={factor.key}
                      className="flex items-center justify-between text-sm text-gray-600"
                    >
                      <span>{factorLabel}</span>
                      {factor.isGood ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
