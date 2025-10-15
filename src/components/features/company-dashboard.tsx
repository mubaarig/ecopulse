"use client";

import { CompanyDetails } from "@/types";
import { ESGScoreCard } from "./esg-score-card";
import { HistoricalChart } from "./historical-chart";
import { SupplyChainMap } from "./supply-chain-map";
import { PredictiveAnalysis } from "./predictive-analysis";

interface CompanyDashboardProps {
  company: CompanyDetails;
}

export function CompanyDashboard({ company }: CompanyDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - ESG Scores and Predictive Analysis */}
      <div className="lg:col-span-1 space-y-6">
        <ESGScoreCard score={company.esgScore} />
        <PredictiveAnalysis company={company} />
      </div>

      {/* Right column - Charts and Map */}
      <div className="lg:col-span-2 space-y-6">
        <HistoricalChart ticker={company.ticker} />
        <SupplyChainMap ticker={company.ticker} />
      </div>
    </div>
  );
}
