import { CompanySearch } from '@/components/features/company-search';
import { StatsGrid } from '@/components/features/stats-grid';
import { StatsGrid2 } from '@/components/features/stats-grid2';
import { RecentSearches } from '@/components/features/recent-search';
import { RecentSearches2 } from '@/components/features/recent-searches2';
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Sustainable Investment Intelligence
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Analyze ESG performance, predict future trends, and map supply chain impacts of public companies.
        </p>
      </div>

      {/* Main Search */}
      <CompanySearch/>

      {/* Stats Preview */}
      <StatsGrid />
      <hr/>
      {/* <StatsGrid2/> */}

      {/* Recent Searches */}
      <RecentSearches />
            <hr/>

      {/* <RecentSearches2 /> */}

    </div>
  );
}