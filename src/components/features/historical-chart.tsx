'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface HistoricalChartProps {
  ticker: string;
}

export function HistoricalChart({ ticker }: HistoricalChartProps) {
  const { data: historicalData, isLoading } = useQuery({
    queryKey: ['historical-data', ticker],
    queryFn: () => apiClient.getHistoricalData(ticker),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Historical ESG Performance</h2>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Historical ESG Performance</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8884d8" name="Overall Score" />
            <Line type="monotone" dataKey="environmental" stroke="#82ca9d" name="Environmental" />
            <Line type="monotone" dataKey="social" stroke="#ffc658" name="Social" />
            <Line type="monotone" dataKey="governance" stroke="#ff8042" name="Governance" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}