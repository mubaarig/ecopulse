export interface Company {
  id: string;
  name: string;
  ticker: string;
  industry: string;
  logoUrl?: string;
}

export interface TrendingIdea {
  id: string;
  label: string;
  query: string;
  changePercentage?: string;
  context?: string;
}

export interface WatchlistPipeline {
  id: string;
  title: string;
  subtitle?: string;
  changePercentage?: string;
  companyCount?: number;
  status?: string;
  query?: string;
}

export interface CompanySearchMeta {
  filters: string[];
  suggestions: Company[];
  trendingIdeas: TrendingIdea[];
  watchlistPipelines: WatchlistPipeline[];
}

export interface ESGScore {
  total: number;
  environmental: number;
  social: number;
  governance: number;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

export interface CompanyDetails extends Company {
  esgScore: ESGScore;
  description: string;
  marketCap?: number;
  headquarters?: string;
}

export interface HistoricalDataPoint {
  date: string;
  score: number;
  environmental: number;
  social: number;
  governance: number;
}

export interface SupplyChainData {
  country: string;
  emission: number;
  riskLevel: 'low' | 'medium' | 'high';
  facilities: number;
}
