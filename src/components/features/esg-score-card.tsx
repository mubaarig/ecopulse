'use client';

import { ESGScore } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ESGScoreCardProps {
  score: ESGScore;
}

export function ESGScoreCard({ score }: ESGScoreCardProps) {
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
      <h2 className="text-lg font-semibold text-gray-900 mb-4">ESG Score</h2>
      
      <div className="space-y-4">
        {/* Total Score */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">{score.total}</div>
          <div className="flex items-center justify-center space-x-2">
            {getTrendIcon(score.trend)}
            <span className="text-sm text-gray-600">Overall Score</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{score.environmental}</div>
            <div className="text-xs text-gray-600">Environmental</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{score.social}</div>
            <div className="text-xs text-gray-600">Social</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{score.governance}</div>
            <div className="text-xs text-gray-600">Governance</div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(score.lastUpdated).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}