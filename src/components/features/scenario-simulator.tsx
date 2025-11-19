'use client';

import { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { SlidersHorizontal, Activity, AlertTriangle } from 'lucide-react';

import type { ESGScore } from '@/types';

type ScenarioKey = 'carbonPrice' | 'regulation' | 'supplyShock';

type SliderConfig = {
  key: ScenarioKey;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
};

// Domain-inspired levers the analyst can tweak to stress test outcomes.
const SLIDERS: SliderConfig[] = [
  {
    key: 'carbonPrice',
    min: 0,
    max: 200,
    step: 10,
    defaultValue: 75,
    unit: '$/t',
  },
  {
    key: 'regulation',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
    unit: '%',
  },
  {
    key: 'supplyShock',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 35,
    unit: '%',
  },
];

interface ScenarioSimulatorProps {
  score: ESGScore;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ScenarioSimulator({ score }: ScenarioSimulatorProps) {
  const t = useTranslations('company.scenario');
  const locale = useLocale();
  // Keep slider values in local state so the component remains self-contained.
  const [scenario, setScenario] = useState<Record<ScenarioKey, number>>(() => {
    return SLIDERS.reduce(
      (acc, slider) => {
        acc[slider.key] = slider.defaultValue;
        return acc;
      },
      {} as Record<ScenarioKey, number>,
    );
  });

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const deltaFormatter = (value: number) => {
    const rounded = Math.round(value * 10) / 10;
    const sign = rounded >= 0 ? '+' : '';
    return `${sign}${numberFormatter.format(rounded)}`;
  };

  // Translate slider positions into a coarse scenario delta per score pillar.
  const impact = useMemo(() => {
    const carbonShift = (scenario.carbonPrice - SLIDERS[0].defaultValue) * 0.12;
    const regulationShift = (scenario.regulation - SLIDERS[1].defaultValue) * 0.1;
    const supplyShift = (scenario.supplyShock - SLIDERS[2].defaultValue) * -0.15;

    const totalDelta = clamp(carbonShift + regulationShift + supplyShift, -12, 12);
    const environmentalDelta = clamp(carbonShift - supplyShift * 0.3, -10, 10);
    const socialDelta = clamp(regulationShift * 0.4 - supplyShift * 0.2, -8, 8);
    const governanceDelta = clamp(regulationShift * 0.6 + carbonShift * 0.2, -8, 8);

    const adjustedScores = {
      total: clamp(score.total + totalDelta, 0, 100),
      environmental: clamp(score.environmental + environmentalDelta, 0, 100),
      social: clamp(score.social + socialDelta, 0, 100),
      governance: clamp(score.governance + governanceDelta, 0, 100),
    };

    const unsortedDrivers: Array<{ key: ScenarioKey; value: number }> = [
      { key: 'carbonPrice', value: carbonShift },
      { key: 'regulation', value: regulationShift },
      { key: 'supplyShock', value: supplyShift },
    ];
    // Sort from strongest to weakest signal so we can call out the dominant driver in copy.
    const drivers = [...unsortedDrivers].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

    return {
      totalDelta,
      adjustedScores,
      segmentDeltas: {
        environmental: environmentalDelta,
        social: socialDelta,
        governance: governanceDelta,
      },
      primaryDriver: drivers[0],
    };
  }, [scenario, score]);

  // Simple helper keeps slider handlers concise.
  const handleChange = (key: ScenarioKey, value: number) => {
    setScenario((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const driverLabel = useMemo(() => {
    if (!impact.primaryDriver) {
      return '';
    }
    const direction = impact.primaryDriver.value >= 0 ? 'positive' : 'negative';
    return t(`drivers.${impact.primaryDriver.key}.${direction}`, {
      value: numberFormatter.format(Math.abs(Math.round(impact.primaryDriver.value))),
    });
  }, [impact.primaryDriver, numberFormatter, t]);

  const impactMetrics: Array<{ key: keyof ESGScore; label: string; delta: number }> = [
    {
      key: 'environmental',
      label: t('metrics.environmental'),
      delta: impact.segmentDeltas.environmental,
    },
    { key: 'social', label: t('metrics.social'), delta: impact.segmentDeltas.social },
    { key: 'governance', label: t('metrics.governance'), delta: impact.segmentDeltas.governance },
  ];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <SlidersHorizontal className="h-4 w-4" />
            {t('badge')}
          </div>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">{t('title')}</h2>
          <p className="text-sm text-gray-600">{t('subtitle')}</p>
        </div>
        <div
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${
            impact.totalDelta >= 0
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {t('overallDelta', { value: deltaFormatter(impact.totalDelta) })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          {SLIDERS.map((slider) => {
            const value = scenario[slider.key];
            return (
              <div key={slider.key} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {t(`sliders.${slider.key}.label`)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t(`sliders.${slider.key}.description`)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {value}
                    {slider.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={value}
                  onChange={(event) => handleChange(slider.key, Number(event.target.value))}
                  className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-emerald-500"
                />
                <div className="mt-2 flex justify-between text-xs text-gray-400">
                  <span>
                    {slider.min}
                    {slider.unit}
                  </span>
                  <span>
                    {slider.max}
                    {slider.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  {t('adjustedScore')}
                </p>
                <p className="text-3xl font-semibold text-gray-900">
                  {numberFormatter.format(impact.adjustedScores.total)}
                </p>
              </div>
              <div
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  impact.totalDelta >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}
              >
                {deltaFormatter(impact.totalDelta)}
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">{t('adjustedHint')}</p>
          </div>

          <div className="grid gap-3">
            {impactMetrics.map((metric) => (
              <div
                key={metric.key}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm shadow-sm"
              >
                <span className="font-medium text-gray-700">{metric.label}</span>
                <span
                  className={`font-semibold ${
                    metric.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {deltaFormatter(metric.delta)}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <Activity className="h-4 w-4 text-emerald-500" />
              {t('insights.title')}
            </div>
            <p className="mt-2">{driverLabel}</p>
            <ul className="mt-2 space-y-1 text-xs text-gray-500">
              <li>{t('insights.carbonPrice', { value: scenario.carbonPrice })}</li>
              <li>{t('insights.regulation', { value: scenario.regulation })}</li>
              <li>{t('insights.supply', { value: scenario.supplyShock })}</li>
            </ul>
          </div>

          {impact.totalDelta < -6 && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-white p-3 text-xs text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <span>{t('warning')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
