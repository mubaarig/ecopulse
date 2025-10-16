'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Globe,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import type { Company } from '@/types';

const SUGGESTED_COMPANIES: Company[] = [
  {
    id: 'msft',
    name: 'Microsoft Corp.',
    ticker: 'MSFT',
    industry: 'Technology',
  },
  {
    id: 'tsla',
    name: 'Tesla, Inc.',
    ticker: 'TSLA',
    industry: 'Automotive',
  },
  {
    id: 'enph',
    name: 'Enphase Energy',
    ticker: 'ENPH',
    industry: 'Energy',
  },
  {
    id: 'ulvr',
    name: 'Unilever PLC',
    ticker: 'UL',
    industry: 'Consumer Staples',
  },
  {
    id: 'ntrs',
    name: 'Northern Trust',
    ticker: 'NTRS',
    industry: 'Financials',
  },
  {
    id: 'ibm',
    name: 'IBM',
    ticker: 'IBM',
    industry: 'Technology',
  },
];

const TRENDING_IDEAS = [
  'Low-carbon logistics leaders',
  'Net-zero commitments 2040',
  'Clean energy storage partnerships',
  'Human rights audit results',
];

const WATCHLIST_PIPELINES = [
  'Climate transition leaders',
  'High-risk supply chain nodes',
  'Pending shareholder engagements',
];

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

export function CompanySearch() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const trimmedQuery = query.trim();
  const searchEnabled = trimmedQuery.length > 0;

  const router = useRouter();

  const { data: companies = [], isFetching } = useQuery<Company[]>({
    queryKey: ['company-search', trimmedQuery],
    queryFn: () => apiClient.searchCompanies(trimmedQuery),
    enabled: searchEnabled,
    staleTime: 5 * 60 * 1000,
  });

  const filterOptions = useMemo(() => {
    const industries = new Set<string>();
    SUGGESTED_COMPANIES.forEach(company => industries.add(company.industry));
    companies.forEach(company => {
      if (company.industry) {
        industries.add(company.industry);
      }
    });
    return ['All', ...Array.from(industries).sort()];
  }, [companies]);

  useEffect(() => {
    if (activeFilter !== 'All' && !filterOptions.includes(activeFilter)) {
      setActiveFilter('All');
    }
  }, [filterOptions, activeFilter]);

  const filteredCompanies = useMemo(() => {
    const base = searchEnabled ? companies : SUGGESTED_COMPANIES;
    const candidates =
      activeFilter === 'All'
        ? base
        : base.filter(company => company.industry === activeFilter);
    const limit = searchEnabled ? 6 : 4;
    return candidates.slice(0, limit);
  }, [companies, searchEnabled, activeFilter]);

  const isEmptyState = searchEnabled && !isFetching && filteredCompanies.length === 0;

  const handleSelectCompany = (company: Company) => {
    if (!company || !company.ticker || company.ticker === 'Private') {
      return;
    }
    setQuery('');
    setActiveFilter('All');
    router.push(`/company/${company.ticker}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedQuery) {
      return;
    }
    if (companies.length > 0) {
      handleSelectCompany(companies[0]);
    }
  };

  return (
    <section aria-labelledby="company-search" className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            AI discovery
          </div>
          <h2 id="company-search" className="text-2xl font-semibold text-gray-900">
            Company and supply chain intelligence search
          </h2>
          <p className="text-sm text-gray-600">
            Surface ESG performance, disclosures, controversies, and risk signals across public companies in seconds.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <span>
            Updated <strong className="font-semibold text-gray-900">12 minutes ago</strong>
          </span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search by company, ticker, product, or ESG theme..."
            className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-base text-gray-900 shadow-sm transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            aria-label="Search companies and supply chain entities"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-14 min-w-[160px] gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
          disabled={isFetching}
        >
          {searchEnabled && isFetching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              Run search
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {filterOptions.map(option => {
          const isActive = option === activeFilter;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setActiveFilter(option)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                isActive
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-200 hover:text-emerald-700'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Suggested matches</h3>
            <span className="text-xs font-medium text-gray-500">
              {searchEnabled && isFetching
                ? 'Searching...'
                : `Showing ${filteredCompanies.length} ${filteredCompanies.length === 1 ? 'result' : 'results'}`}
            </span>
          </div>
          <ul className="space-y-3">
            {filteredCompanies.map(company => (
              <li
                key={company.id}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-base font-semibold text-emerald-700">
                    {getInitials(company.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{company.name}</p>
                    <p className="text-xs text-gray-500">
                      {company.ticker} &bull; {company.industry}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => handleSelectCompany(company)}
                  disabled={!company.ticker || company.ticker === 'Private'}
                >
                  Open profile
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </li>
            ))}
            {searchEnabled && isFetching && (
              <li className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-6 text-center text-sm text-emerald-700">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching companies...
                </div>
              </li>
            )}
            {isEmptyState && (
              <li className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                No companies found yet. Try adjusting your filters or explore a trending idea.
              </li>
            )}
          </ul>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Globe className="h-10 w-10 rounded-full bg-emerald-50 p-2 text-emerald-600" />
              <div>
                <h3 className="text-base font-semibold text-gray-900">Trending themes</h3>
                <p className="text-sm text-gray-600">Jump into what other analysts are exploring this week.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {TRENDING_IDEAS.map(idea => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => {
                    setQuery(idea);
                    setActiveFilter('All');
                  }}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Building2 className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-600" />
              <div>
                <h3 className="text-base font-semibold text-gray-900">Watchlist pipelines</h3>
                <p className="text-sm text-gray-600">Load saved cohorts to monitor progress and engagement outcomes.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {WATCHLIST_PIPELINES.map(pipeline => (
                <button
                  key={pipeline}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left font-medium text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  {pipeline}
                  <ArrowRight className="h-4 w-4 text-emerald-600" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-1 h-4 w-4 text-emerald-600" />
              <div>
                <p className="font-semibold">Try natural language prompts</p>
                <p className="mt-1">
                  Example:{' '}
                  <span className="font-medium text-emerald-800">
                    &ldquo;Scope 3 laggards in automotive suppliers with new CDP filings&rdquo;
                  </span>
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
