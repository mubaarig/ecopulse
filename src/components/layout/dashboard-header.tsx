import { Search } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex h-16 items-center px-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg" />
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            EcoPulse
          </span>
        </div>
        
        <div className="flex flex-1 items-center justify-center px-8">
          <div className="w-full max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                placeholder="Search companies, tickers, or products..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            Dashboard
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            Methodology
          </button>
        </nav>
      </div>
    </header>
  );
}