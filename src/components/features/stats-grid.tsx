'use client';

import { TrendingUp, Globe, Shield, Users } from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    label: 'ESG Performance',
    value: '85.2',
    change: '+2.1%',
    description: 'Average score across tracked companies',
  },
  {
    icon: Globe,
    label: 'Carbon Impact',
    value: '12.4M',
    change: '-5.3%',
    description: 'Tons of CO2 tracked in supply chains',
  },
  {
    icon: Shield,
    label: 'Governance Score',
    value: '78.9',
    change: '+1.2%',
    description: 'Average board diversity & transparency',
  },
  {
    icon: Users,
    label: 'Social Impact',
    value: '82.1',
    change: '+3.4%',
    description: 'Labor practices & community engagement',
  },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <stat.icon className="h-6 w-6 text-blue-600" />
            </div>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              stat.change.startsWith('+') 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {stat.change}
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stat.value}
          </h3>
          <p className="text-sm font-medium text-gray-600 mb-2">
            {stat.label}
          </p>
          <p className="text-xs text-gray-500">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}