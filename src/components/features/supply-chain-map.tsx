'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Supply Chain Emissions</h2>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Supply Chain Emissions</h2>
      <div className="h-80">
        {/* Placeholder for the map */}
        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
          <p className="text-gray-500">Supply chain map visualization will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}