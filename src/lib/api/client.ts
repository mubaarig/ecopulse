import { mockData, generateMockESGScore } from '@/lib/mock-data';
import { Company, CompanyDetails } from '@/types';

type FMPCompanySearch = {
  symbol: string;
  name: string;
  industry?: string;
};

const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
class EcoPulseAPI {
  private useMockData = !FMP_API_KEY; // Use mock data if no API key

  async searchCompanies(query: string): Promise<Company[]> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData.searchCompanies(query);
    }

    try {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=10&exchange=NASDAQ&apikey=${FMP_API_KEY}`
      );
      const data = (await response.json()) as FMPCompanySearch[];

      return data.map((item) => ({
        id: item.symbol,
        name: item.name,
        ticker: item.symbol,
        industry: item.industry || 'N/A',
        logoUrl: `https://financialmodelingprep.com/image-stock/${item.symbol}.png`,
      }));
    } catch (error) {
      console.error('Error searching companies:', error);
      return [];
    }
  }
  async getCompanyDetails(ticker: string): Promise<CompanyDetails | null> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockData.getCompanyDetails(ticker);
    }

    try {
      const [profileResponse, quoteResponse] = await Promise.all([
        fetch(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${FMP_API_KEY}`),
        fetch(`https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${FMP_API_KEY}`),
      ]);

      const [profileData, quoteData] = await Promise.all([
        profileResponse.json(),
        quoteResponse.json(),
      ]);

      if (!profileData[0] || !quoteData[0]) {
        return null;
      }

      const profile = profileData[0];
      const quote = quoteData[0];

      // Generate ESG scores (since FMP doesn't provide them, we'll use mock for now)
      const esgScore = generateMockESGScore(profile.companyName ?? ticker);

      return {
        id: ticker,
        name: profile.companyName,
        ticker: ticker,
        industry: profile.industry,
        logoUrl: profile.image,
        esgScore,
        description: profile.description,
        marketCap: quote.marketCap,
        headquarters: `${profile.city}, ${profile.country}`,
      };
    } catch (error) {
      console.error('Error fetching company details:', error);
      return null;
    }
  }
  async getHistoricalData(ticker: string) {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockData.getHistoricalData(ticker);
    }
    
    return [];
  }

  async getSupplyChainData(ticker: string) {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockData.getSupplyChainData(ticker);
    }
    
    return [];
  }
}

export const apiClient = new EcoPulseAPI();
