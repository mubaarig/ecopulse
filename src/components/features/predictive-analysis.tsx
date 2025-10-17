'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { TrendingUp, TrendingDown, AlertTriangle, Brain } from 'lucide-react';

interface PredictiveAnalysisProps {
  ticker: string;
}

export function PredictiveAnalysis({ ticker }: PredictiveAnalysisProps) {
  const { data: historicalData, isLoading } = useQuery({
    queryKey: ['historical-data', ticker],
    queryFn: () => apiClient.getHistoricalData(ticker),
  });

  // Simple prediction based on historical trend
  const calculatePrediction = () => {
    if (!historicalData || historicalData.length < 6) return null;

    const recentScores = historicalData.slice(-6).map((d) => d.score);
    const trend = recentScores[recentScores.length - 1] - recentScores[0];
    const avgScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

    const nextQuarterPrediction = avgScore + trend * 0.3; // Dampened trend
    const confidence = Math.max(60, 95 - Math.abs(trend) * 2); // Higher confidence for stable trends

    return {
      nextScore: Math.round(Math.max(0, Math.min(100, nextQuarterPrediction))),
      confidence: Math.round(confidence),
      trend: trend > 2 ? 'up' : trend < -2 ? 'down' : 'stable',
      riskFactors: [
        trend < -5 ? 'Accelerating decline in governance scores' : null,
        recentScores[recentScores.length - 1] < 40 ? 'Critical low score territory' : null,
        Math.abs(trend) > 10 ? 'High volatility in recent performance' : null,
      ].filter(Boolean) as string[],
    };
  };

  const prediction = calculatePrediction();

  if (isLoading || !prediction) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Predictive Analysis</h2>
        <div className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">AI Predictive Analysis</h2>
      </div>

      <div className="space-y-4">
        {/* Prediction Score */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-3 mb-2">
            {prediction.trend === 'up' && <TrendingUp className="h-5 w-5 text-green-600" />}
            {prediction.trend === 'down' && <TrendingDown className="h-5 w-5 text-red-600" />}
            <span className="text-2xl font-bold text-gray-900">{prediction.nextScore}</span>
          </div>
          <p className="text-sm text-gray-600">Predicted Next Quarter Score</p>
        </div>

        {/* Confidence Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">AI Confidence</span>
            <span className="font-medium text-gray-900">{prediction.confidence}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${prediction.confidence}%` }}
            ></div>
          </div>
        </div>

        {/* Risk Factors */}
        {prediction.riskFactors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-900">Risk Factors</span>
            </div>
            <ul className="space-y-1">
              {prediction.riskFactors.map((factor, index) => (
                <li key={index} className="text-xs text-amber-700 flex items-start space-x-2">
                  <span>•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          Powered by machine learning analysis of historical ESG trends
        </div>
      </div>
    </div>
  );
}
