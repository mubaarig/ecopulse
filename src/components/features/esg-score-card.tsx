'use client';

import { ESGScore } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ESGScoreCardProps {
  score: ESGScore;
}

export function ESGScoreCard({ score }: ESGScoreCardProps) {
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

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">ESG Score</h2>
      
      <div className="space-y-4">
        {/* Main Score */}
        <div className={`text-center p-6 rounded-lg border-2 ${getScoreBg(score.total)}`}>
          <div className="flex items-center justify-center space-x-3">
            {getTrendIcon(score.trend)}
            <span className={`text-5xl font-bold ${getScoreColor(score.total)}`}>
              {score.total}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Overall Score</p>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xl font-bold text-blue-600">{score.environmental}</div>
            <div className="text-xs text-blue-700 font-medium">Environmental</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xl font-bold text-purple-600">{score.social}</div>
            <div className="text-xs text-purple-700 font-medium">Social</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-xl font-bold text-amber-600">{score.governance}</div>
            <div className="text-xs text-amber-700 font-medium">Governance</div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center">
          Updated {new Date(score.lastUpdated).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}