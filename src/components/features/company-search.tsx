"use client";

import { useState } from "react";
import { Search, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Company } from "@/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function CompanySearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["company-search", query],
    queryFn: () => apiClient.searchCompanies(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const router = useRouter();

  const handleSelectCompany = (company: Company) => {
    setQuery("");
    setIsOpen(false);
    // TODO: Navigate to company detail page
    console.log("Selected company:", company);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search companies (try 'Apple', 'Tesla', 'Unilever')..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full h-14 pl-10 pr-4 text-lg rounded-xl border border-gray-200 bg-white shadow-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-2xl max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : companies.length > 0 ? (
            <div className="py-2">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleSelectCompany(company)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {company.name}
                      </h3>
                      {company.ticker !== "Private" && (
                        <span className="text-sm text-gray-500 flex-shrink-0">
                          {company.ticker}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {company.industry}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No companies found. Try different keywords.
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
