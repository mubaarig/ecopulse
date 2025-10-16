'use client';

import { CompanyDetails } from '@/types';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface PredictiveAnalysisProps {
  company: CompanyDetails;
}

export function PredictiveAnalysis({ company }: PredictiveAnalysisProps) {
  // Mock predictive data
  const prediction = {
    nextScore: company.esgScore.total + 2, // Mock improvement
    confidence: 85,
    riskFactors: [
      'Carbon emissions regulation',
      'Supply chain transparency',
    ],
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Predictive Analysis</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Next Quarter Forecast</span>
          <span className="text-lg font-bold text-green-600">{prediction.nextScore}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Confidence</span>
          <span className="text-lg font-bold text-blue-600">{prediction.confidence}%</span>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
            Key Risk Factors
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {prediction.riskFactors.map((factor, index) => (
              <li key={index} className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}