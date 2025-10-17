'use client';

import { ESGScore } from '@/types';
import { Leaf, Users, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface ScoreBreakdownProps {
  score: ESGScore;
}

export function ScoreBreakdown({ score }: ScoreBreakdownProps) {
  const metrics = [
    {
      icon: Leaf,
      category: 'Environmental',
      score: score.environmental,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      factors: [
        { name: 'Carbon Emissions', status: score.environmental > 70 ? 'good' : 'warning' },
        { name: 'Water Usage', status: score.environmental > 60 ? 'good' : 'warning' },
        { name: 'Waste Management', status: score.environmental > 65 ? 'good' : 'warning' },
      ],
    },
    {
      icon: Users,
      category: 'Social',
      score: score.social,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      factors: [
        { name: 'Employee Diversity', status: score.social > 75 ? 'good' : 'warning' },
        { name: 'Community Impact', status: score.social > 65 ? 'good' : 'warning' },
        { name: 'Labor Practices', status: score.social > 70 ? 'good' : 'warning' },
      ],
    },
    {
      icon: Shield,
      category: 'Governance',
      score: score.governance,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      factors: [
        { name: 'Board Diversity', status: score.governance > 65 ? 'good' : 'warning' },
        { name: 'Executive Pay', status: score.governance > 60 ? 'good' : 'warning' },
        { name: 'Shareholder Rights', status: score.governance > 70 ? 'good' : 'warning' },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h2>

      <div className="space-y-4">
        {metrics.map((metric) => (
          <div
            key={metric.category}
            className={`p-4 rounded-lg border ${metric.borderColor} ${metric.bgColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                <span className="font-medium text-gray-900">{metric.category}</span>
              </div>
              <span className={`text-lg font-bold ${metric.color}`}>{metric.score}</span>
            </div>

            <div className="space-y-2">
              {metric.factors.map((factor) => (
                <div key={factor.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{factor.name}</span>
                  {factor.status === 'good' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
