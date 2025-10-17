export interface Company {
  id: string;
  name: string;
  ticker: string;
  industry: string;
  logoUrl?: string;
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
