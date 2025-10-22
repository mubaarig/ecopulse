'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { TrendingUp, TrendingDown, AlertTriangle, Brain } from 'lucide-react';

import { apiClient } from '@/lib/api/client';

type TrendDirection = 'up' | 'down' | 'stable';
type RiskFactorKey = 'governanceDecline' | 'lowScore' | 'highVolatility';

interface PredictiveAnalysisProps {
  ticker: string;
}

interface Prediction {
  nextScore: number;
  confidence: number;
  trend: TrendDirection;
  riskFactors: RiskFactorKey[];
}

export function PredictiveAnalysis({ ticker }: PredictiveAnalysisProps) {
  const t = useTranslations('company.analysis');

  const { data: historicalData, isLoading } = useQuery({
    queryKey: ['historical-data', ticker],
    queryFn: () => apiClient.getHistoricalData(ticker),
  });

  const prediction = useMemo<Prediction | null>(() => {
    if (!historicalData || historicalData.length < 6) {
      return null;
    }

    const recentScores = historicalData.slice(-6).map((entry) => entry.score);
    const trendDelta = recentScores[recentScores.length - 1] - recentScores[0];
    const averageScore =
      recentScores.reduce((total, value) => total + value, 0) / recentScores.length;

    const dampenedPrediction = averageScore + trendDelta * 0.3;
    const boundedScore = Math.round(Math.max(0, Math.min(100, dampenedPrediction)));
    const confidence = Math.round(Math.max(60, 95 - Math.abs(trendDelta) * 2));

    const riskFactors: RiskFactorKey[] = [];
    if (trendDelta < -5) {
      riskFactors.push('governanceDecline');
    }
    if (recentScores[recentScores.length - 1] < 40) {
      riskFactors.push('lowScore');
    }
    if (Math.abs(trendDelta) > 10) {
      riskFactors.push('highVolatility');
    }

    const trend: TrendDirection = trendDelta > 2 ? 'up' : trendDelta < -2 ? 'down' : 'stable';

    return {
      nextScore: boundedScore,
      confidence,
      trend,
      riskFactors,
    };
  }, [historicalData]);

  if (isLoading || !prediction) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('loadingTitle')}</h2>
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center space-x-2">
        <Brain className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">{t('title')}</h2>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-4 text-center">
          <div className="mb-2 flex items-center justify-center space-x-3">
            {prediction.trend === 'up' && <TrendingUp className="h-5 w-5 text-green-600" />}
            {prediction.trend === 'down' && <TrendingDown className="h-5 w-5 text-red-600" />}
            <span className="text-2xl font-bold text-gray-900">{prediction.nextScore}</span>
          </div>
          <p className="text-sm text-gray-600">{t('score')}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('confidence')}</span>
            <span className="font-medium text-gray-900">{prediction.confidence}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
        </div>

        {prediction.riskFactors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-900">{t('riskFactors')}</span>
            </div>
            <ul className="space-y-1">
              {prediction.riskFactors.map((factor) => (
                <li key={factor} className="flex items-start space-x-2 text-xs text-amber-700">
                  <span>•</span>
                  <span>{t(`riskItems.${factor}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-gray-200 pt-2 text-center text-xs text-gray-500">
          {t('poweredBy')}
        </div>
      </div>
    </div>
  );
}
