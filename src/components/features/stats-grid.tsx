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

type TrendTone = 'positive' | 'neutral' | 'negative';

type StrategicHighlight = {
  title: string;
  value: string;
  description: string;
  delta: string;
  icon: LucideIcon;
  tone: TrendTone;
};

type ReductionItem = {
  label: string;
  value: string;
  tone: TrendTone;
};

const strategicHighlights: StrategicHighlight[] = [
  {
    title: 'ESG Leaders (AA+)',
    value: '28',
    description: 'Companies outperforming sector peers on composite ESG score.',
    delta: '+3 vs last quarter',
    icon: Leaf,
    tone: 'positive' as const,
  },
  {
    title: 'Transition Momentum',
    value: '63%',
    description: 'Portfolios aligned with 1.5°C scenario glide path through 2030.',
    delta: '+4.8% MoM',
    icon: Sun,
    tone: 'positive' as const,
  },
  {
    title: 'Supply Chain Exposure',
    value: '14%',
    description: 'Vendors rated high risk across emissions, labor, or resilience.',
    delta: '-1.2% MoM',
    icon: Factory,
    tone: 'positive' as const,
  },
  {
    title: 'Controversy Alerts',
    value: '7',
    description: 'Active cases requiring stewardship team follow-up this week.',
    delta: '+2 vs last week',
    icon: ShieldCheck,
    tone: 'negative' as const,
  },
];

const coreMetrics = [
  {
    icon: TrendingUp,
    label: 'ESG Performance',
    value: '85.2',
    change: '+2.1%',
    description: 'Average score across tracked companies',
  },
  {
    icon: Globe,
    label: 'Carbon Impact',
    value: '12.4M',
    change: '-5.3%',
    description: 'Tons of CO2 tracked in supply chains',
  },
  {
    icon: Shield,
    label: 'Governance Score',
    value: '78.9',
    change: '+1.2%',
    description: 'Average board diversity & transparency',
  },
  {
    icon: Users,
    label: 'Social Impact',
    value: '82.1',
    change: '+3.4%',
    description: 'Labor practices & community engagement',
  },
];

const reductionBreakdown: ReductionItem[] = [
  { label: 'Scope 1', value: '-8.4%', tone: 'positive' as const },
  { label: 'Scope 2', value: '-5.9%', tone: 'positive' as const },
  { label: 'Scope 3', value: '-1.7%', tone: 'neutral' as const },
];

const stewardshipFocus = [
  {
    label: 'Deforestation-free sourcing commitments',
    owners: 'Consumer Staples',
    status: 'On track',
  },
  {
    label: 'Cyber governance disclosures',
    owners: 'Financials',
    status: 'Monitoring',
  },
  {
    label: 'Workforce equity reporting cadence',
    owners: 'Technology',
    status: 'Escalate',
  },
];

export function StatsGrid() {
  return (
    <section
      aria-labelledby="stats-grid"
      className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="stats-grid" className="text-2xl font-semibold text-gray-900">
            Integrated sustainability overview
          </h2>
          <p className="text-sm text-gray-600">
            Synthesizes headline momentum with underlying ESG performance and stewardship
            priorities.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          <BarChart3 className="h-4 w-4" />
          Auto-refreshed 15 min ago
        </span>
      </header>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {strategicHighlights.map(({ title, value, description, delta, icon: Icon, tone }) => {
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
              <h3 className="text-base font-semibold text-gray-900">Core ESG metrics</h3>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Tracked weekly
              </span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {coreMetrics.map(({ icon: Icon, label, value, change, description }) => {
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
                <h3 className="text-base font-semibold text-gray-900">
                  Emissions reduction velocity
                </h3>
                <p className="text-sm text-gray-600">
                  Twelve-month deltas across reported scopes benchmarked against science-based
                  targets.
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {reductionBreakdown.map(({ label, value, tone }) => {
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
              Accelerated Scope 1 and Scope 2 progress keeps the portfolio ahead of the 2027
              reduction glide path.
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-600" />
              <div>
                <h3 className="text-base font-semibold text-gray-900">Stewardship focus</h3>
                <p className="text-sm text-gray-600">
                  Engagement themes prioritized this quarter with sector ownership responsibility.
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {stewardshipFocus.map(({ label, owners, status }) => (
                <li key={label} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">{label}</p>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{owners}</p>
                </li>
              ))}
            </ul>
          </article>
        </aside>
      </div>
    </section>
  );
}
