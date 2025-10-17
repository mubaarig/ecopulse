'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Globe, AlertTriangle } from 'lucide-react';
import { ThreeGlobe } from './3d-globe';

interface SupplyChainMapProps {
  ticker: string;
}

export function SupplyChainMap({ ticker }: SupplyChainMapProps) {
  const { data: supplyChainData, isLoading } = useQuery({
    queryKey: ['supply-chain', ticker],
    queryFn: () => apiClient.getSupplyChainData(ticker),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Supply Chain Overview</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const totalEmissions = supplyChainData?.reduce((sum, item) => sum + item.emission, 0) || 0;
  const highRiskCountries = supplyChainData?.filter(item => item.riskLevel === 'high').length || 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Globe className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-900">Supply Chain Overview</h2>
      </div>

      <div className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{supplyChainData?.length || 0}</div>
            <div className="text-xs text-gray-600">Countries</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {Math.round(totalEmissions / 1000)}K
            </div>
            <div className="text-xs text-gray-600">Tons CO₂</div>
          </div>
        </div>

        {/* Risk Indicator */}
        {highRiskCountries > 0 && (
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                {highRiskCountries} High-Risk Region{highRiskCountries !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-amber-700">
              Consider diversifying suppliers in high-risk regions to mitigate environmental impact.
            </p>
          </div>
        )}

        {/* 3D Globe Visualization */}
        {supplyChainData && supplyChainData.length > 0 && (
          <ThreeGlobe supplyChainData={supplyChainData} />
        )}

        {/* Country List */}
        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
          {supplyChainData?.map((country, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  country.riskLevel === 'high' ? 'bg-red-500' :
                  country.riskLevel === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-900">{country.country}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-900">{Math.round(country.emission / 1000)}K tons</div>
                <div className="text-xs text-gray-500">{country.facilities} facilities</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
