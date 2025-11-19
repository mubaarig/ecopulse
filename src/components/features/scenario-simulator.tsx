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
   
  );
}
