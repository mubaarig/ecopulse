'use client';

import {
  ArrowUpRight,
  BarChart3,
  Factory,
  Gauge,
  Globe,
  Leaf,
  Shield,
  ShieldCheck,
  Sun,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

type TrendTone = 'positive' | 'neutral' | 'negative';

type StrategicHighlightConfig = {
  key: 'esgLeaders' | 'transitionMomentum' | 'supplyChainExposure' | 'controversyAlerts';
  value: string;
  icon: LucideIcon;
  tone: TrendTone;
};

type CoreMetricConfig = {
  key: 'esgPerformance' | 'carbonImpact' | 'governanceScore' | 'socialImpact';
  icon: LucideIcon;
  value: string;
  change: string;
};

type ReductionItemConfig = {
  key: 'scope1' | 'scope2' | 'scope3';
  value: string;
  tone: TrendTone;
};

type StewardshipItemConfig = {
  key: 'deforestation' | 'cyberGovernance' | 'workforceEquity';
  status: 'onTrack' | 'monitoring' | 'escalate';
};

const strategicHighlightsConfig: StrategicHighlightConfig[] = [
  {
    value: '28',
    key: 'esgLeaders',
    icon: Leaf,
    tone: 'positive' as const,
  },
  {
    value: '63%',
    key: 'transitionMomentum',
    icon: Sun,
    tone: 'positive' as const,
  },
  {
    value: '14%',
    key: 'supplyChainExposure',
    icon: Factory,
    tone: 'positive' as const,
  },
  {
    value: '7',
    key: 'controversyAlerts',
    icon: ShieldCheck,
    tone: 'negative' as const,
  },
];

const coreMetricsConfig: CoreMetricConfig[] = [
  {
    icon: TrendingUp,
    key: 'esgPerformance',
    value: '85.2',
    change: '+2.1%',
  },
  {
    icon: Globe,
    key: 'carbonImpact',
    value: '12.4M',
    change: '-5.3%',
  },
  {
    icon: Shield,
    key: 'governanceScore',
    value: '78.9',
    change: '+1.2%',
  },
  {
    icon: Users,
    key: 'socialImpact',
    value: '82.1',
    change: '+3.4%',
  },
];

const reductionBreakdownConfig: ReductionItemConfig[] = [
  { key: 'scope1', value: '-8.4%', tone: 'positive' as const },
  { key: 'scope2', value: '-5.9%', tone: 'positive' as const },
  { key: 'scope3', value: '-1.7%', tone: 'neutral' as const },
];

const stewardshipFocusConfig: StewardshipItemConfig[] = [
  { key: 'deforestation', status: 'onTrack' },
  { key: 'cyberGovernance', status: 'monitoring' },
  { key: 'workforceEquity', status: 'escalate' },
];

export function StatsGrid() {
  const t = useTranslations('stats');
  const badgeTime = t('badgeTime');

  return (
    <section
      aria-labelledby="stats-grid"
      className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="stats-grid" className="text-2xl font-semibold text-gray-900">
            {t('sectionTitle')}
          </h2>
          <p className="text-sm text-gray-600">{t('sectionSubtitle')}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          <BarChart3 className="h-4 w-4" />
          {t('badge', { time: badgeTime })}
        </span>
      </header>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {strategicHighlightsConfig.map(({ key, value, icon: Icon, tone }) => {
              const title = t(`strategicHighlights.${key}.title`);
              const description = t(`strategicHighlights.${key}.description`);
              const delta = t(`strategicHighlights.${key}.delta`);
              const deltaClass =
                tone === 'negative'
                  ? 'text-rose-500'
                  : tone === 'neutral'
                    ? 'text-blue-500'
                    : 'text-emerald-600';

              return (
                <article
                  key={title}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-white"
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-100/40 blur-2xl transition-opacity group-hover:opacity-80" />
                  <div className="relative flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">{title}</p>
                      <p className="text-3xl font-semibold text-gray-900">{value}</p>
                    </div>
                    <span className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="relative mt-3 text-sm text-gray-600">{description}</p>
                  <p
                    className={`relative mt-4 inline-flex items-center gap-2 text-xs font-semibold ${deltaClass}`}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {delta}
                  </p>
                </article>
              );
            })}
          </div>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                {t('coreMetricsCard.title')}
              </h3>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t('coreMetricsCard.subtitle')}
              </span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {coreMetricsConfig.map(({ icon: Icon, key, value, change }) => {
                const label = t(`coreMetrics.${key}.label`);
                const description = t(`coreMetrics.${key}.description`);
                const isPositive = change.startsWith('+');
                const badgeClass = isPositive
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700';

                return (
                  <div
                    key={label}
                    className="flex h-full flex-col justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeClass}`}
                      >
                        {change}
                      </span>
                    </div>
                    <div className="mt-4 space-y-1.5">
                      <p className="text-2xl font-bold text-gray-900">{value}</p>
                      <p className="text-sm font-medium text-gray-600">{label}</p>
                      <p className="text-xs text-gray-500">{description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        <aside className="space-y-6">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Gauge className="h-10 w-10 rounded-full bg-emerald-50 p-2 text-emerald-600" />
              <div>
                <h3 className="text-base font-semibold text-gray-900">{t('emissions.title')}</h3>
                <p className="text-sm text-gray-600">{t('emissions.subtitle')}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {reductionBreakdownConfig.map(({ key, value, tone }) => {
                const label = t(`emissionsBreakdown.${key}`);
                const valueClass =
                  tone === 'positive'
                    ? 'text-emerald-600'
                    : tone === 'negative'
                      ? 'text-rose-500'
                      : 'text-blue-500';

                return (
                  <li
                    key={label}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-xs text-emerald-800">
              {t('emissions.summary')}
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-600" />
              <div>
                <h3 className="text-base font-semibold text-gray-900">{t('stewardship.title')}</h3>
                <p className="text-sm text-gray-600">{t('stewardship.subtitle')}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {stewardshipFocusConfig.map(({ key, status }) => {
                const label = t(`stewardship.items.${key}.label`);
                const owners = t(`stewardship.items.${key}.owners`);
                const statusLabel = t(`stewardship.status.${status}`);

                return (
                  <li key={key} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800">{label}</p>
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {statusLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{owners}</p>
                  </li>
                );
              })}
            </ul>
          </article>
        </aside>
      </div>
    </section>
  );
}
