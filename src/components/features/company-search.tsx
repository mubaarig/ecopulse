'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Building2, Globe, Loader2, Search, Sparkles, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from '@/navigation';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import type { Company, CompanySearchMeta } from '@/types';

function getInitials(name: string) {
  if (!name) {
    return '';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function CompanySearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const t = useTranslations('companySearch');
  const formatFilterLabel = useCallback(
    (option: string) => (option.toLowerCase() === 'all' ? t('filters.all') : option),
    [t],
  );

  const router = useRouter();
  const inputContainerRef = useRef<HTMLDivElement | null>(null);

  // Preload discovery metadata (filters, suggestions, watchlists) for richer defaults
  const {
    data: searchMeta,
    isLoading: isMetaLoading,
    error: metaError,
  } = useQuery<CompanySearchMeta>({
    queryKey: ['company-search-meta'],
    queryFn: () => apiClient.getCompanySearchMeta(),
    staleTime: 10 * 60 * 1000,
  });

  const trimmedQuery = useMemo(() => query.trim(), [query]);
  const searchEnabled = trimmedQuery.length > 0;

  // Keep filters aligned with backend-provided facets; always include an "All" catch-all
  const filterOptions = useMemo(() => {
    const filters = searchMeta?.filters ?? [];
    if (!filters.length) {
      return ['All'];
    }

    const hasAll = filters.some((filter) => filter.toLowerCase() === 'all');
    return hasAll ? filters : ['All', ...filters];
  }, [searchMeta]);

  // Ensure the current filter stays valid when new metadata arrives
  useEffect(() => {
    if (!filterOptions.length) {
      return;
    }

    setActiveFilter((current) =>
      filterOptions.includes(current) ? current : (filterOptions[0] ?? 'All'),
    );
  }, [filterOptions]);

  const defaultSuggestions = useMemo(
    () => (searchMeta?.suggestions ?? []).slice(0, 8),
    [searchMeta],
  );
  const trendingIdeas = searchMeta?.trendingIdeas ?? [];
  const watchlistPipelines = searchMeta?.watchlistPipelines ?? [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const {
    data: companies = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['company-search', debouncedQuery],
    queryFn: () => apiClient.searchCompanies(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!searchEnabled) {
      setIsDropdownOpen(false);
    }
  }, [searchEnabled]);

  useEffect(() => {
    if (!isDropdownOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (inputContainerRef.current && !inputContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen]);

  const dropdownResults = useMemo(() => {
    if (!searchEnabled) {
      return [];
    }

    return companies.slice(0, 8);
  }, [companies, searchEnabled]);

  // Derive the shortlist for the main card list, falling back to discovery suggestions when idle
  const filteredCompanies = useMemo(() => {
    if (searchEnabled) {
      if (!companies.length) {
        return [];
      }

      const shortlist = companies.slice(0, 8);

      if (activeFilter === 'All') {
        return shortlist;
      }

      const normalizedFilter = activeFilter.toLowerCase();
      const filtered = shortlist.filter((company) => {
        const haystack =
          `${company.name ?? ''} ${company.ticker ?? ''} ${company.industry ?? ''}`.toLowerCase();
        return haystack.includes(normalizedFilter);
      });

      return filtered.length > 0 ? filtered : shortlist;
    }

    if (!defaultSuggestions.length) {
      return [];
    }

    const shortlist = defaultSuggestions.slice(0, 8);

    if (activeFilter === 'All') {
      return shortlist;
    }

    const normalizedFilter = activeFilter.toLowerCase();
    const filtered = shortlist.filter((company) => {
      const haystack =
        `${company.name ?? ''} ${company.ticker ?? ''} ${company.industry ?? ''}`.toLowerCase();
      return haystack.includes(normalizedFilter);
    });

    return filtered.length > 0 ? filtered : shortlist;
  }, [companies, searchEnabled, activeFilter, defaultSuggestions]);

  const isEmptyState = searchEnabled && !isFetching && !isLoading && companies.length === 0;

  // Craft concise status copy depending on search state and metadata availability
  const feedbackMessage = useMemo(() => {
    if (error) {
      return t('feedback.companiesError');
    }

    if (metaError) {
      return t('feedback.metaError');
    }

    if (!searchEnabled) {
      if (isMetaLoading) {
        return t('feedback.loadingMeta');
      }

      if (defaultSuggestions.length) {
        return t('feedback.selectSuggestion');
      }

      return t('feedback.searchPrompt');
    }

    if (isFetching || isLoading) {
      return t('feedback.searching', { query: trimmedQuery });
    }

    if (isEmptyState) {
      return t('feedback.empty', { query: trimmedQuery });
    }

    const count = filteredCompanies.length;

    if (activeFilter === 'All') {
      return t('feedback.results', { count });
    }

    return t('feedback.resultsFiltered', {
      count,
      filter: formatFilterLabel(activeFilter),
    });
  }, [
    t,
    error,
    metaError,
    searchEnabled,
    isMetaLoading,
    defaultSuggestions.length,
    isFetching,
    isLoading,
    trimmedQuery,
    isEmptyState,
    filteredCompanies.length,
    activeFilter,
    formatFilterLabel,
  ]);

  const suggestionsStatusText = useMemo(() => {
    if (searchEnabled && isFetching) {
      return t('suggested.status.searching');
    }

    if (!searchEnabled && isMetaLoading) {
      return t('suggested.status.loadingMeta');
    }

    const count = filteredCompanies.length;

    if (activeFilter === 'All') {
      return t('suggested.status.results', { count });
    }

    return t('suggested.status.resultsFiltered', {
      count,
      filter: formatFilterLabel(activeFilter),
    });
  }, [
    t,
    searchEnabled,
    isFetching,
    isMetaLoading,
    filteredCompanies.length,
    activeFilter,
    formatFilterLabel,
  ]);

  const lastUpdatedLabel = t.rich('lastUpdated', {
    strong: (chunks) => <strong className="font-semibold text-gray-900">{chunks}</strong>,
    time: t('lastUpdatedTime'),
  });

  const handleSelectCompany = (company: Company) => {
    setQuery('');
    setDebouncedQuery('');
    setIsDropdownOpen(false);
    setActiveFilter(filterOptions[0] ?? 'All');
    router.push(`/company/${company.ticker}`);
    toast.success(t('toast.loading', { company: company.name }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const firstSuggestion = dropdownResults[0] ?? filteredCompanies[0];

    if (firstSuggestion) {
      handleSelectCompany(firstSuggestion);
    } else if (trimmedQuery) {
      toast.error(t('toast.empty', { query: trimmedQuery }));
    }
  };

  return (
    <section
      aria-labelledby="company-search"
      className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            {t('badgeLabel')}
          </div>
          <h2 id="company-search" className="text-2xl font-semibold text-gray-900">
            {t('title')}
          </h2>
          <p className="text-sm text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <span>{lastUpdatedLabel}</span>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center"
      >
        <div className="relative flex-1" ref={inputContainerRef}>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsDropdownOpen(Boolean(event.target.value.trim()));
            }}
            onFocus={() => {
              if (trimmedQuery) {
                setIsDropdownOpen(true);
              }
            }}
            placeholder={t('placeholder')}
            className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-12 text-base text-gray-900 shadow-sm transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            aria-label={t('ariaLabel')}
          />
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            {isFetching || isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
            ) : !trimmedQuery ? (
              <kbd className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-400 shadow-sm">
                ⌘K
              </kbd>
            ) : null}
          </div>

          {isDropdownOpen && trimmedQuery && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-80 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl">
              {isFetching ? (
                <div className="flex flex-col items-center gap-2 px-4 py-6 text-sm text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                  {t('dropdown.searching')}
                </div>
              ) : dropdownResults.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {dropdownResults.map((company) => (
                    <li key={company.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectCompany(company)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 text-sm font-semibold text-emerald-700">
                            {getInitials(company.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {company.name}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {company.ticker} &bull; {company.industry || '—'}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-emerald-600" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  {t('dropdown.empty', { query: debouncedQuery })}
                </div>
              )}
            </div>
          )}
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
              {t('buttons.submitting')}
            </>
          ) : (
            <>
              {t('buttons.submit')}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {feedbackMessage && (
        <div className="mt-2 text-xs font-medium text-gray-500">{feedbackMessage}</div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {filterOptions.map((option) => {
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
              {formatFilterLabel(option)}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t('suggested.title')}
            </h3>
            <span className="text-xs font-medium text-gray-500">{suggestionsStatusText}</span>
          </div>
          <ul className="space-y-3">
            {filteredCompanies.map((company) => (
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
                  {t('suggested.openProfile')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </li>
            ))}
            {searchEnabled && isFetching && (
              <li className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-6 text-center text-sm text-emerald-700">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('suggested.loading')}
                </div>
              </li>
            )}
            {isEmptyState && (
              <li className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                {t('suggested.empty')}
              </li>
            )}
          </ul>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Globe className="h-10 w-10 rounded-full bg-emerald-50 p-2 text-emerald-600" />
              <div>
                <h3 className="text-base font-semibold text-gray-900">{t('trending.title')}</h3>
                <p className="text-sm text-gray-600">{t('trending.description')}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {trendingIdeas.length > 0 ? (
                trendingIdeas.map((idea) => (
                  <button
                    key={idea.id}
                    type="button"
                    onClick={() => {
                      setQuery(idea.query);
                      setDebouncedQuery(idea.query);
                      setActiveFilter(filterOptions[0] ?? 'All');
                      setIsDropdownOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <span>{idea.label}</span>
                    {idea.changePercentage && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          idea.changePercentage.trim().startsWith('-')
                            ? 'bg-red-100 text-red-600'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {idea.changePercentage}
                      </span>
                    )}
                    {idea.context && !idea.changePercentage && (
                      <span className="text-[10px] font-medium text-emerald-700">
                        {idea.context}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-xs text-gray-500">{t('trending.empty')}</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Building2 className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-600" />
              <div>
                <h3 className="text-base font-semibold text-gray-900">{t('watchlist.title')}</h3>
                <p className="text-sm text-gray-600">{t('watchlist.description')}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {watchlistPipelines.length > 0 ? (
                watchlistPipelines.map((pipeline) => {
                  const changeIsNegative = pipeline.changePercentage?.trim().startsWith('-');
                  const statusKey =
                    pipeline.status?.toLowerCase() === 'action required'
                      ? 'actionRequired'
                      : undefined;
                  const statusLabel = statusKey
                    ? t(`watchlist.status.${statusKey}`)
                    : pipeline.status;

                  return (
                    <button
                      key={pipeline.id}
                      type="button"
                      onClick={() => {
                        const pipelineQuery = pipeline.query?.trim();
                        if (!pipelineQuery) {
                          return;
                        }
                        setQuery(pipelineQuery);
                        setDebouncedQuery(pipelineQuery);
                        const nextFilter =
                          filterOptions.find(
                            (option) => option.toLowerCase() === pipelineQuery.toLowerCase(),
                          ) ??
                          filterOptions[0] ??
                          'All';
                        setActiveFilter(nextFilter);
                        setIsDropdownOpen(true);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left font-medium text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{pipeline.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                          {pipeline.subtitle && <span>{pipeline.subtitle}</span>}
                          {pipeline.companyCount && (
                            <span className="font-medium text-gray-600">
                              {t('watchlist.companyCount', { count: pipeline.companyCount })}
                            </span>
                          )}
                          {pipeline.status && (
                            <span
                              className={`rounded-full px-2 py-0.5 font-semibold ${
                                pipeline.status === 'Action required'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {statusLabel}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {pipeline.changePercentage && (
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              changeIsNegative
                                ? 'bg-red-100 text-red-600'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {pipeline.changePercentage}
                          </span>
                        )}
                        <ArrowRight className="h-4 w-4 text-emerald-600" />
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-gray-500">{t('watchlist.empty')}</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-1 h-4 w-4 text-emerald-600" />
              <div>
                <p className="font-semibold">{t('tips.title')}</p>
                <p className="mt-1">
                  {t('tips.exampleLabel')}{' '}
                  <span className="font-medium text-emerald-800">{t('tips.example')}</span>
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
