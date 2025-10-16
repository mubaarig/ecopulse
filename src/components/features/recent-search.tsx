'use client';

import { Building2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { mockData } from '@/lib/mock-data';

const recentCompanies = mockData.getCompanies().slice(0, 4);
const recentSnapshots = [
  { score: 83, trend: 'up' as const },
  { score: 78, trend: 'stable' as const },
  { score: 71, trend: 'down' as const },
  { score: 86, trend: 'up' as const },
];

export function RecentSearches() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recently Analyzed Companies
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recentCompanies.map((company, index) => {
          const snapshot = recentSnapshots[index] ?? recentSnapshots[recentSnapshots.length - 1];
          const { trend, score } = snapshot;

          return (
            <button
              key={company.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                  <Building2 className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {company.industry}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">
                  {score}
                </span>
                <div className={`p-1 rounded ${
                  trend === 'up' ? 'bg-green-100 text-green-600' :
                  trend === 'down' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {trend === 'up' && <ArrowUp className="h-3 w-3" />}
                  {trend === 'down' && <ArrowDown className="h-3 w-3" />}
                  {trend === 'stable' && <Minus className="h-3 w-3" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
