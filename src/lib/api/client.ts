import { mockData, generateMockESGScore } from '@/lib/mock-data';
import type { Company, CompanyDetails, HistoricalDataPoint, SupplyChainData } from '@/types';

const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

type FMPCompanySearch = {
  symbol: string;
  name: string;
  type?: string;
  exchangeShortName?: string;
};

type FMPProfile = {
  companyName?: string;
  symbol?: string;
  description?: string;
  industry?: string;
  image?: string;
  city?: string;
  country?: string;
};

type FMPQuote = {
  marketCap?: number;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class EcoPulseAPI {
  private readonly useMockData = !FMP_API_KEY;

  private async withFallback<T>(
    action: () => Promise<T>,
    fallback: () => T | Promise<T>,
    artificialDelayMs = 0,
  ): Promise<T> {
    try {
      if (artificialDelayMs > 0) {
        await delay(artificialDelayMs);
      }
      const result = await action();
      if (result === null || result === undefined) {
        return fallback();
      }
      if (Array.isArray(result) && result.length === 0) {
        return fallback();
      }
      return result;
    } catch (error) {
      console.error('[EcoPulseAPI] falling back to mock data:', error);
      return fallback();
    }
  }

  async searchCompanies(query: string): Promise<Company[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    if (this.useMockData) {
      await delay(250);
      return mockData.searchCompanies(trimmed);
    }

    return this.withFallback(
      async () => {
        const response = await fetch(
          `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(trimmed)}&limit=10&exchange=NASDAQ&apikey=${FMP_API_KEY}`,
        );
        if (!response.ok) {
          throw new Error(`FMP search failed with status ${response.status}`);
        }
        const data = (await response.json()) as FMPCompanySearch[];
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('FMP search returned no results');
        }

        return data.map<Company>((item) => ({
          id: item.symbol,
          name: item.name,
          ticker: item.symbol,
          industry: item.type ?? 'N/A',
          logoUrl: `https://financialmodelingprep.com/image-stock/${item.symbol}.png`,
        }));
      },
      () => mockData.searchCompanies(trimmed),
      150,
    );
  }

  async getCompanyDetails(ticker: string): Promise<CompanyDetails | null> {
    if (!ticker) {
      return null;
    }

    if (this.useMockData) {
      await delay(350);
      return mockData.getCompanyDetails(ticker);
    }

    return this.withFallback(
      async () => {
        const [profileResponse, quoteResponse] = await Promise.all([
          fetch(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${FMP_API_KEY}`),
          fetch(`https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${FMP_API_KEY}`),
        ]);

        if (!profileResponse.ok || !quoteResponse.ok) {
          throw new Error(
            `FMP profile or quote failed: ${profileResponse.status}/${quoteResponse.status}`,
          );
        }

        const profilePayload = (await profileResponse.json()) as FMPProfile[];
        const quotePayload = (await quoteResponse.json()) as FMPQuote[];

        const profile = profilePayload?.[0];
        const quote = quotePayload?.[0];

        if (!profile) {
          throw new Error('Missing profile data');
        }

        return {
          id: ticker,
          name: profile.companyName ?? ticker,
          ticker,
          industry: profile.industry ?? 'N/A',
          logoUrl: profile.image ?? `https://financialmodelingprep.com/image-stock/${ticker}.png`,
          esgScore: generateMockESGScore(profile.companyName ?? ticker),
          description: profile.description ?? 'No description available.',
          marketCap: quote?.marketCap,
          headquarters:
            profile.city && profile.country ? `${profile.city}, ${profile.country}` : undefined,
        };
      },
      async () => {
        await delay(350);
        return mockData.getCompanyDetails(ticker);
      },
      200,
    );
  }

  async getHistoricalData(ticker: string): Promise<HistoricalDataPoint[]> {
    if (!ticker) {
      return [];
    }

    if (this.useMockData) {
      await delay(200);
      return mockData.getHistoricalData(ticker);
    }

    return this.withFallback(
      async () => {
        // FMP does not expose ESG history, so we synthesise data while still attempting a reach-out
        await delay(150);
        return mockData.getHistoricalData(ticker);
      },
      () => mockData.getHistoricalData(ticker),
      150,
    );
  }

  async getSupplyChainData(ticker: string): Promise<SupplyChainData[]> {
    if (!ticker) {
      return [];
    }

    if (this.useMockData) {
      await delay(300);
      return mockData.getSupplyChainData(ticker);
    }

    return this.withFallback(
      async () => {
        // No upstream supply chain endpoint available yet – always fall back
        return mockData.getSupplyChainData(ticker);
      },
      () => mockData.getSupplyChainData(ticker),
      200,
    );
  }
}

export const apiClient = new EcoPulseAPI();
