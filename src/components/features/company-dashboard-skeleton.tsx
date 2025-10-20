export function CompanyDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Company Header Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>

      {/* Main Dashboard Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Scores & Breakdown */}
        <div className="lg:col-span-1 space-y-6">
          {/* ESG Score Card Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Score Breakdown Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Charts & Visualizations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Historical Chart Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Predictive Analysis Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Supply Chain Map Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}