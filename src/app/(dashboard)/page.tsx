import { Button } from '@/components/ui/button';

import {
  ArrowUpRight,
  BarChart3,
  Factory,
  Globe,
  Leaf,
  LineChart,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const keyMetrics = [
  {
    label: 'Avg ESG Score',
    value: '78.4',
    description: 'Across 185 tracked companies',
    delta: '+2.1 vs last quarter',
    icon: Leaf,
  },
  {
    label: 'Carbon Intensity',
    value: '64.2 tCO₂e',
    description: 'Per $1M revenue, trailing 12 months',
    delta: '-6.4% YoY',
    icon: Globe,
  },
  {
    label: 'Supply Chain Coverage',
    value: '92%',
    description: 'Vendors with verified disclosures',
    delta: '+8.0 since Jan',
    icon: Factory,
  },
  {
    label: 'Engagements Tracked',
    value: '1,245',
    description: 'Policy, news, and statement events',
    delta: '+124 past 30 days',
    icon: BarChart3,
  },
];

const esgBreakdown = [
  {
    title: 'Environmental',
    score: 82,
    change: '+4.2 vs last month',
    summary: 'Renewable adoption and emissions cuts accelerated across energy, tech, and consumer sectors.',
  },
  {
    title: 'Social',
    score: 76,
    change: '+1.8 vs last month',
    summary: 'Improved labor policies offset mixed supplier audits; several diversity initiatives announced.',
  },
  {
    title: 'Governance',
    score: 74,
    change: '-0.7 vs last month',
    summary: 'Board refresh momentum slowed as shareholder resolutions increase in Q2 filings.',
  },
];

const supplyChainRisks = [
  {
    region: 'Southeast Asia',
    severity: 'High',
    update: 'Typhoon-related port closures now affecting semiconductor upstream suppliers.',
    impact: 'Expected lead time extension: 12–18 days',
  },
  {
    region: 'Latin America',
    severity: 'Medium',
    update: 'Water stress alerts flagged for lithium mining operations serving EV battery producers.',
    impact: 'Projected production dip: 6.5%',
  },
  {
    region: 'Northern Europe',
    severity: 'Low',
    update: 'Energy transition incentives reduce exposure to natural gas volatility.',
    impact: 'Stability outlook improved for Q3 sourcing.',
  },
];

const sustainabilitySignals = [
  {
    title: 'Microsoft deepens carbon removal partnerships',
    category: 'Positive',
    timestamp: '2h ago',
    summary: 'New long-term contracts signed with two direct air capture providers to meet 2030 goals.',
  },
  {
    title: 'EU investigates textile supply chain disclosures',
    category: 'Neutral',
    timestamp: '6h ago',
    summary: 'Preliminary review requests evidence of traceability reforms from fast-fashion leaders.',
  },
  {
    title: 'Coastal manufacturing hub faces flood risk',
    category: 'Watchlist',
    timestamp: 'Yesterday',
    summary: 'Satellite imagery highlights elevated sea-level anomalies impacting logistics routes.',
  },
];

const opportunityHighlights = [
  {
    title: 'Transition finance momentum',
    value: '$4.8B',
    detail: 'Green bond issuance tracked across five priority portfolios during the last quarter.',
  },
  {
    title: 'Avoided emissions potential',
    value: '9.2 MtCO₂e',
    detail: 'Projected by scaling electrification projects within transportation verticals.',
  },
  {
    title: 'Engagement success rate',
    value: '63%',
    detail: 'Shareholder proposals that led to measurable policy updates in FY24.',
  },
];

export default function DashboardPage() {
  return (
    <main className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-500 to-blue-600 p-10 text-white shadow-lg">
        <div className="absolute inset-0 opacity-20 blur-3xl" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium tracking-wide backdrop-blur">
              <Sparkles className="h-4 w-4" />
              AI-assisted insights refreshed every 15 minutes
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Navigate sustainability performance with confidence.
            </h1>
            <p className="max-w-2xl text-lg text-white/80">
              EcoPulse synthesizes ESG disclosures, satellite data, and news sentiment so you can surface risks, spot
              opportunities, and guide capital toward resilient portfolios.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="gap-2 bg-white text-gray-900 hover:bg-white/90">
                Launch live dashboard
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                View methodology
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-white/80">
              <div>
                <span className="font-semibold text-white">820+</span> companies tracked weekly
              </div>
              <div>
                <span className="font-semibold text-white">140</span> countries monitored for policy signals
              </div>
              <div>
                <span className="font-semibold text-white">12k</span> supply chain entities mapped
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <h2 className="text-lg font-medium text-white">ESG trajectory forecast</h2>
            <p className="mt-3 text-sm text-white/80">
              Composite signal blend indicating sustained upward momentum driven by renewable expansion and policy
              incentives.
            </p>
            <div className="mt-6 flex h-40 items-end gap-2">
              {[32, 40, 44, 52, 58, 61, 67, 72, 75, 78, 82, 86].map((value, index) => (
                <div
                  key={value}
                  className="flex-1 rounded-full bg-gradient-to-t from-white/40 to-white/90"
                  style={{ height: `${value}%` }}
                  aria-hidden
                />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm text-white/80">
              <span>Now</span>
              <span>+12 mo outlook</span>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="key-metrics" className="space-y-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="key-metrics" className="text-xl font-semibold text-gray-900">
              Portfolio health snapshot
            </h2>
            <p className="text-sm text-gray-600">
              Blended ESG and supply chain indicators calculated from trailing 12 month disclosures.
            </p>
          </div>
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
            Verified data partners
          </span>
        </header>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {keyMetrics.map(({ icon: Icon, label, value, description, delta }) => (
            <article
              key={label}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-200/40 blur-2xl transition group-hover:opacity-80" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{label}</p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900">{value}</p>
                </div>
                <span className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="relative mt-3 text-sm text-gray-600">{description}</p>
              <p
                className={`relative mt-4 inline-flex items-center gap-1 text-xs font-semibold ${
                  delta.startsWith('-') ? 'text-red-500' : 'text-emerald-600'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                {delta}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="esg-breakdown" className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <h2 id="esg-breakdown" className="text-xl font-semibold text-gray-900">
                ESG dimension momentum
              </h2>
              <p className="text-sm text-gray-600">
                Weighted scores reflect sector benchmarks and recent disclosures.
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-gray-200">
              Download report
            </Button>
          </header>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {esgBreakdown.map(({ title, score, change, summary }) => (
              <article key={title} className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                  <span className="text-2xl font-semibold text-gray-900">{score}</span>
                </div>
                <p className="mt-2 text-xs font-medium text-emerald-600">{change}</p>
                <p className="mt-3 text-sm text-gray-600">{summary}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm text-emerald-900">
            <p className="flex items-center gap-2 font-medium">
              <LineChart className="h-4 w-4 text-emerald-600" />
              Signal insight
            </p>
            <p className="mt-2">
              Forecast models indicate environmental leadership continues to drive the composite score while governance
              pressures may persist through proxy season.
            </p>
          </div>
        </div>
        <div className="flex h-full flex-col justify-between gap-6">
          <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Engagement pipeline</h3>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Updated 5m ago</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Prioritized outreach themes across stewardship and public policy teams.
            </p>
            <ul className="mt-5 space-y-4 text-sm text-gray-700">
              <li className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">Scope 3 roadmap alignment</p>
                  <p className="text-xs text-gray-500">12 companies</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                  In progress
                </span>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">Human rights assessments</p>
                  <p className="text-xs text-gray-500">9 companies</p>
                </div>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-600">
                  Scheduled
                </span>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">Executive remuneration review</p>
                  <p className="text-xs text-gray-500">6 companies</p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                  Completed
                </span>
              </li>
            </ul>
          </article>
          <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-10 w-10 text-emerald-600" />
              <div>
                <h3 className="text-lg font-semibold text-emerald-900">Watchlist automation</h3>
                <p className="text-sm text-emerald-800">
                  Configure AI alerts for sector volatility, regulatory change, and climate risk scenarios in one view.
                </p>
              </div>
            </div>
            <Button className="mt-6 w-full bg-emerald-700 hover:bg-emerald-800">
              Create new alert
            </Button>
          </article>
        </div>
      </section>

      <section aria-labelledby="supply-chain-watch" className="space-y-5">
        <header className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="supply-chain-watch" className="text-xl font-semibold text-gray-900">
              Supply chain watchlist
            </h2>
            <p className="text-sm text-gray-600">
              Geospatial and sentiment signals blended with vendor exposure to flag areas requiring mitigation.
            </p>
          </div>
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            <Factory className="h-4 w-4" />
            Auto-refresh every 30 minutes
          </span>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {supplyChainRisks.map(({ region, severity, update, impact }) => (
            <article key={region} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Region</p>
                  <h3 className="text-lg font-semibold text-gray-900">{region}</h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    severity === 'High'
                      ? 'bg-red-100 text-red-600'
                      : severity === 'Medium'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-emerald-100 text-emerald-600'
                  }`}
                >
                  {severity} risk
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-600">{update}</p>
              <p className="mt-4 text-sm font-semibold text-gray-900">{impact}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="signals" className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <h2 id="signals" className="text-xl font-semibold text-gray-900">
                Recent sustainability signals
              </h2>
              <p className="text-sm text-gray-600">Curated events impacting portfolio exposure and risk posture.</p>
            </div>
            <Button variant="outline" size="sm" className="border-gray-200">
              View all signals
            </Button>
          </header>
          <div className="mt-6 space-y-4">
            {sustainabilitySignals.map(({ title, category, timestamp, summary }) => (
              <article
                key={title}
                className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        category === 'Positive'
                          ? 'bg-emerald-100 text-emerald-600'
                          : category === 'Watchlist'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{summary}</p>
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{timestamp}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Opportunity highlights</h3>
          <p className="mt-2 text-sm text-gray-600">
            Emerging catalysts for climate-aligned portfolios ranked by estimated impact.
          </p>
          <ul className="mt-6 space-y-4">
            {opportunityHighlights.map(({ title, value, detail }) => (
              <li key={title} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium text-gray-500">{title}</p>
                  <span className="text-xl font-semibold text-gray-900">{value}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{detail}</p>
              </li>
            ))}
          </ul>
          <Button className="mt-6 w-full bg-emerald-600 text-white hover:bg-emerald-700">
            Export opportunity brief
          </Button>
        </div>
      </section>
    </main>
  );
}
