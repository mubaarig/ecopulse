import { mockData } from '@/lib/mock-data';
import { Company, CompanyDetails } from '@/types';

// This client will eventually be extended to use real APIs
class EcoPulseAPI {
  private useMockData = true;

  async searchCompanies(query: string): Promise<Company[]> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData.searchCompanies(query);
    }
    
    // TODO: Replace with real API call
    // return await realAPISearch(query);
    return [];
  }

  async getCompanyDetails(ticker: string): Promise<CompanyDetails | null> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockData.getCompanyDetails(ticker);
    }
    
    // TODO: Replace with real API call
    return null;
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