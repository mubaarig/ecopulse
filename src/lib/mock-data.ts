import { faker } from '@faker-js/faker';
import { Company, CompanyDetails, ESGScore } from '@/types';

// Generate realistic company names and tickers
const COMPANY_DATA = [
  { name: 'Apple Inc.', ticker: 'AAPL', industry: 'Technology' },
  { name: 'Microsoft Corporation', ticker: 'MSFT', industry: 'Technology' },
  { name: 'Tesla Inc.', ticker: 'TSLA', industry: 'Automotive' },
  { name: 'Patagonia', ticker: 'Private', industry: 'Apparel' },
  { name: 'Unilever PLC', ticker: 'UL', industry: 'Consumer Goods' },
  { name: 'NextEra Energy', ticker: 'NEE', industry: 'Utilities' },
  { name: 'Salesforce Inc.', ticker: 'CRM', industry: 'Technology' },
  { name: 'Chipotle Mexican Grill', ticker: 'CMG', industry: 'Restaurants' },
];

// Generate realistic ESG scores with trends
function generateESGScore(companyName: string): ESGScore {
  const baseScore = faker.number.int({ min: 20, max: 95 });
  
  return {
    total: baseScore,
    environmental: faker.number.int({ min: 15, max: 90 }),
    social: faker.number.int({ min: 15, max: 90 }),
    governance: faker.number.int({ min: 15, max: 90 }),
    lastUpdated: faker.date.recent({ days: 30 }).toISOString(),
    trend: faker.helpers.arrayElement(['up', 'down', 'stable']) as 'up' | 'down' | 'stable',
  };
}

// Generate historical data for charts
function generateHistoricalData(months: number = 12) {
  const data = [];
  let currentScore = faker.number.int({ min: 40, max: 80 });
  
  for (let i = months; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    // Simulate realistic score fluctuations
    currentScore += faker.number.int({ min: -5, max: 5 });
    currentScore = Math.max(20, Math.min(95, currentScore)); // Keep within bounds
    
    data.push({
      date: date.toISOString().split('T')[0],
      score: currentScore,
      environmental: Math.max(10, currentScore + faker.number.int({ min: -15, max: 15 })),
      social: Math.max(10, currentScore + faker.number.int({ min: -15, max: 15 })),
      governance: Math.max(10, currentScore + faker.number.int({ min: -15, max: 15 })),
    });
  }
  
  return data;
}

// Generate supply chain data
function generateSupplyChainData() {
  const countries = ['United States', 'China', 'Vietnam', 'Mexico', 'Germany', 'India', 'Brazil'];
  
  return countries.map(country => ({
    country,
    emission: faker.number.int({ min: 1000, max: 50000 }),
    riskLevel: faker.helpers.arrayElement(['low', 'medium', 'high']),
    facilities: faker.number.int({ min: 1, max: 15 }),
  }));
}

// Main mock data generator
export const mockData = {
  // Get all companies for search
  getCompanies(): Company[] {
    return COMPANY_DATA.map(company => ({
      id: faker.string.uuid(),
      name: company.name,
      ticker: company.ticker,
      industry: company.industry,
      logoUrl: `https://logo.clearbit.com/${company.name.split(' ')[0].toLowerCase()}.com`,
    }));
  },

  // Get detailed company data
  getCompanyDetails(ticker: string): CompanyDetails | null {
    const company = COMPANY_DATA.find(c => c.ticker === ticker);
    if (!company) return null;

    return {
      id: faker.string.uuid(),
      name: company.name,
      ticker: company.ticker,
      industry: company.industry,
      logoUrl: `https://logo.clearbit.com/${company.name.split(' ')[0].toLowerCase()}.com`,
      esgScore: generateESGScore(company.name),
      description: faker.company.catchPhrase(),
      marketCap: faker.number.int({ min: 1000000000, max: 3000000000000 }),
      headquarters: `${faker.location.city()}, ${faker.location.country()}`,
    };
  },

  // Get historical ESG data
  getHistoricalData(ticker: string) {
    return generateHistoricalData();
  },

  // Get supply chain data
  getSupplyChainData(ticker: string) {
    return generateSupplyChainData();
  },

  // Search companies by query
  searchCompanies(query: string): Company[] {
    const companies = this.getCompanies();
    const lowerQuery = query.toLowerCase();
    
    return companies.filter(company => 
      company.name.toLowerCase().includes(lowerQuery) ||
      company.ticker.toLowerCase().includes(lowerQuery) ||
      company.industry.toLowerCase().includes(lowerQuery)
    );
  },
};