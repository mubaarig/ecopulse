import { mockData } from '@/lib/mock-data';
import { Company, CompanyDetails } from '@/types';

const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

class EcoPulseAPI {
  private useMockData = !ALPHA_VANTAGE_API_KEY; // Use mock data if no API key

  async searchCompanies(query: string): Promise<Company[]> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData.searchCompanies(query);
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();

      if (data.bestMatches) {
        return data.bestMatches.map(item => ({
          id: item['1. symbol'],
          name: item['2. name'],
          ticker: item['1. symbol'],
          industry: item['3. type'] || 'N/A',
          logoUrl: `https://logo.clearbit.com/${new URL(item['2. name'].split(' ')[0]).hostname}`,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error searching companies:', error);
      return mockData.searchCompanies(query); // Fallback to mock data
    }
  }

  async getCompanyDetails(ticker: string): Promise<CompanyDetails | null> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockData.getCompanyDetails(ticker);
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();

      if (data.Name) {
        return {
          id: ticker,
          name: data.Name,
          ticker: ticker,
          industry: data.Industry || 'N/A',
          logoUrl: `https://logo.clearbit.com/${new URL(data.Name.split(' ')[0]).hostname}`,
          esgScore: mockData.getCompanyDetails(ticker)?.esgScore || {
            total: Math.floor(Math.random() * 30) + 60,
            environmental: Math.floor(Math.random() * 30) + 60,
            social: Math.floor(Math.random() * 30) + 60,
            governance: Math.floor(Math.random() * 30) + 60,
            lastUpdated: new Date().toISOString(),
            trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable',
          },
          description: data.Description || 'No description available.',
          marketCap: parseInt(data.MarketCapitalization) || undefined,
          headquarters: `${data.Address || ''}, ${data.Country || ''}`,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching company details:', error);
      return mockData.getCompanyDetails(ticker); // Fallback to mock data
    }
  }

  // ... keep other methods the same for now
}

export const apiClient = new EcoPulseAPI();