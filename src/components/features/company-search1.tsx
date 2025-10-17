'use client';

import { useState, useEffect } from 'react';
import { Search, Building2, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Company } from '@/types';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function CompanySearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const {
    data: companies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['company-search', debouncedQuery],
    queryFn: () => apiClient.searchCompanies(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    toast.error('Failed to search companies');
  }

  const handleSelectCompany = (company: Company) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/company/${company.ticker}`);
    toast.success(`Loading ${company.name} data...`);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search companies (try 'Apple', 'Tesla', 'Microsoft')..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full h-14 pl-10 pr-4 text-lg rounded-xl border border-gray-200 bg-white shadow-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />

        {/* Search hint */}
        {query.length === 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-100 border border-gray-300 rounded-lg">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-2xl max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching companies...</p>
            </div>
          ) : companies.length > 0 ? (
            <div className="py-2">
              {companies.slice(0, 8).map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleSelectCompany(company)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </h3>
                      {company.ticker !== 'Private' && (
                        <span className="text-sm text-gray-500 flex-shrink-0 bg-gray-100 px-2 py-1 rounded">
                          {company.ticker}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{company.industry}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <Building2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p>No companies found. Try different keywords.</p>
              <p className="text-sm text-gray-400 mt-1">
                Try &ldquo;Apple&rdquo;, &ldquo;Tesla&rdquo;, or &ldquo;Microsoft&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
