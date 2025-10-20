import { CompanySearch } from '@/components/features/company-search';
import { StatsGrid } from '@/components/features/stats-grid';
import { RecentSearches } from '@/components/features/recent-search';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-5 ml-5 mt-5 space-x-5">
        <div className="flex items-center space-x-4">
          {/* <Image src="/ecopulse-logo.png" alt="EcoPulse logo" /> */}
          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/ecopulse-logo.png"
              // width={100} height={50} priority
              width={0} // Set to 0 as it will be controlled by CSS
              height={0} // Set to 0 as it will be controlled by CSS
              sizes="100vw" // Recommended for responsive images
              style={{ width: '100%', height: 'auto' }}
              alt="Logo"
            />
          </Link>
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"></span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Sustainable Investment Intelligence</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Analyze ESG performance, predict future trends, and map supply chain impacts of public
          companies.
        </p>
      </div>

      {/* Main Search */}
      <CompanySearch />

      {/* Stats Preview */}
      <StatsGrid />
      {/* <StatsGrid2/> */}

      {/* Recent Searches */}
      <RecentSearches />
      <hr />

      {/* <RecentSearches2 /> */}
    </div>
  );
}
