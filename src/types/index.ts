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