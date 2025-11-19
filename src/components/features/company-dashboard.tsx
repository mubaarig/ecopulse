'use client';

import { CompanyDetails } from '@/types';
import { CompanyHeader } from './company-header';
import { ESGScoreCard } from './esg-score-card';
import { HistoricalChart } from './historical-chart';
import { SupplyChainMap } from './supply-chain-map';
import { PredictiveAnalysis } from './predictive-analysis';
import { ScoreBreakdown } from './score-breakdown';
import { ScenarioSimulator } from './scenario-simulator';

interface CompanyDashboardProps {
  company: CompanyDetails;
}

export function CompanyDashboard({ company }: CompanyDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Company Header */}
      <CompanyHeader company={company} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Scores & Breakdown */}
        <div className="lg:col-span-1 space-y-6">
          <ESGScoreCard score={company.esgScore} />
          <ScoreBreakdown score={company.esgScore} />
        </div>

        {/* Right Column - Charts & Visualizations */}
        <div className="lg:col-span-2 space-y-6">
          <HistoricalChart ticker={company.ticker} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <PredictiveAnalysis ticker={company.ticker} />
            <SupplyChainMap ticker={company.ticker} />
          </div>
          <ScenarioSimulator score={company.esgScore} />
        </div>
      </div>
    </div>
  );
}
