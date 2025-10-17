import { AlertTriangle, Clock, Compass, History, Sparkles, Target, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';

const recentSearches = [
  {
    id: 'search-1',
    query: 'Renewable build-out across APAC suppliers',
    timestamp: '5 minutes ago',
    analyst: 'Avery M.',
    tags: ['Energy transition', 'Scope 2'],
    results: '32 matches',
    icon: Sparkles,
    tone: 'positive' as const,
    insight: 'Policy incentives accelerating 2026 capacity commitments.',
  },
  {
    id: 'search-2',
    query: 'Forced labor exposure in textile manufacturing',
    timestamp: '22 minutes ago',
    analyst: 'Jordan R.',
    tags: ['Human rights', 'Supply chain'],
    results: '18 matches',
    icon: AlertTriangle,
    tone: 'alert' as const,
    insight: 'Two vendors flagged for enhanced due diligence follow-up.',
  },
  {
    id: 'search-3',
    query: 'Scope 3 disclosure leaders - automotive OEMs',
    timestamp: '1 hour ago',
    analyst: 'Priya S.',
    tags: ['Scope 3', 'Benchmarking'],
    results: '24 matches',
    icon: Target,
    tone: 'neutral' as const,
    insight: 'Five manufacturers released CDP-aligned updates this quarter.',
  },
  {
    id: 'search-4',
    query: 'Physical risk - coastal manufacturing hubs',
    timestamp: 'Yesterday, 4:18 PM',
    analyst: 'Miguel L.',
    tags: ['Climate risk', 'Resilience'],
    results: '41 matches',
    icon: Compass,
    tone: 'watch' as const,
    insight: 'Floodplain shifts affecting Tier 2 electronics suppliers.',
  },
];

const savedPrompts = [
  {
    label: 'Investable clean ammonia pipeline > 2028',
    updated: 'Saved 3 days ago',
  },
  {
    label: 'Cyber governance gaps vs peers',
    updated: 'Saved last week',
  },
  {
    label: 'Upcoming shareholder resolutions with climate linkage',
    updated: 'Saved 2 weeks ago',
  },
];

const collaborationUpdates = [
  {
    team: 'Stewardship',
    message: 'Requested engagement brief on mining suppliers with elevated emissions.',
    time: '7 minutes ago',
  },
  {
    team: 'Policy',
    message: 'Flagged EU CBAM expansion scenario for Q3 analysis.',
    time: '34 minutes ago',
  },
  {
    team: 'Risk',
    message: 'Shared scenario stress test results for APAC logistics nodes.',
    time: 'Yesterday',
  },
];

const toneStyles: Record<
  (typeof recentSearches)[number]['tone'],
  { text: string; background: string; label: string }
> = {
  positive: { text: 'text-emerald-700', background: 'bg-emerald-50', label: 'Positive trend' },
  neutral: { text: 'text-blue-700', background: 'bg-blue-50', label: 'On watch' },
  alert: { text: 'text-red-700', background: 'bg-red-50', label: 'Action needed' },
  watch: { text: 'text-amber-700', background: 'bg-amber-50', label: 'Monitoring' },
};

export function RecentSearches2() {
  return (
    <section
      aria-labelledby="recent-searches"
      className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <History className="h-3.5 w-3.5" />
            Recent activity
          </div>
          <h2 id="recent-searches" className="mt-2 text-2xl font-semibold text-gray-900">
            Latest searches from your workspace
          </h2>
          <p className="text-sm text-gray-600">
            Revisit the most recent ESG intelligence queries, discover insights surfaced by
            teammates, and fast-track collaboration.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-gray-200 text-sm font-semibold text-gray-700 hover:border-emerald-200"
        >
          View full history
        </Button>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          {recentSearches.map(
            ({ id, query, timestamp, analyst, tags, results, icon: Icon, tone, insight }) => {
              const toneStyle = toneStyles[tone];

              return (
                <article
                  key={id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-white"
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gray-100/60 blur-2xl group-hover:bg-emerald-100/60" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span
                        className={`${toneStyle.background} flex h-12 w-12 items-center justify-center rounded-full`}
                      >
                        <Icon className={`${toneStyle.text} h-5 w-5`} />
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{query}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {timestamp}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {analyst}
                          </span>
                          <span>{results}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${toneStyle.background} ${toneStyle.text}`}
                    >
                      {toneStyle.label}
                    </span>
                  </div>
                  <p className="relative mt-4 text-sm text-gray-600">{insight}</p>
                  <div className="relative mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            },
          )}
        </div>

        <aside className="space-y-6">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="h-10 w-10 rounded-full bg-emerald-50 p-2 text-emerald-600" />
              <div>
                <h3 className="text-base font-semibold text-gray-900">Saved prompts</h3>
                <p className="text-sm text-gray-600">
                  Launch proven natural language recipes curated by your team.
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {savedPrompts.map(({ label, updated }) => (
                <li
                  key={label}
                  className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500">{updated}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Run
                  </Button>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Users className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-600" />
              <div>
                <h3 className="text-base font-semibold text-gray-900">Collaboration queue</h3>
                <p className="text-sm text-gray-600">
                  Requests and updates from aligned teams flowing through EcoPulse.
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {collaborationUpdates.map(({ team, message, time }) => (
                <li
                  key={team + time}
                  className="space-y-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800">{team} team</p>
                    <span className="text-xs text-gray-500">{time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{message}</p>
                </li>
              ))}
            </ul>
          </article>
        </aside>
      </div>
    </section>
  );
}
