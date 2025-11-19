import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';

const CLIENT_MODULE_PATH = './client';
const originalFetch = global.fetch;

describe('EcoPulseAPI', () => {
  const originalApiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_FMP_API_KEY = originalApiKey;
    global.fetch = originalFetch;
    vi.restoreAllMocks();
    if (vi.isFakeTimers()) {
      vi.useRealTimers();
    }
  });

  it('serves mock data when no API key is configured', async () => {
    delete process.env.NEXT_PUBLIC_FMP_API_KEY;
    const { apiClient } = await import(CLIENT_MODULE_PATH);

    const companies = await apiClient.searchCompanies('Apple');
    expect(companies.length).toBeGreaterThan(0);
    expect(companies.some((company) => company.ticker === 'AAPL')).toBe(true);

    const details = await apiClient.getCompanyDetails('AAPL');
    expect(details?.ticker).toBe('AAPL');
    expect(details?.name).toBeTruthy();

    const history = await apiClient.getHistoricalData('AAPL');
    expect(history.length).toBeGreaterThan(0);
  });

  it('falls back to mock data when fetch fails even if API key exists', async () => {
    process.env.NEXT_PUBLIC_FMP_API_KEY = 'test-key';
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);

    const { apiClient } = await import(CLIENT_MODULE_PATH);

    const companies = await apiClient.searchCompanies('Apple');
    expect(fetchMock).toHaveBeenCalled();
    expect(companies.length).toBeGreaterThan(0);
    expect(companies.some((company) => company.ticker === 'AAPL')).toBe(true);

    const details = await apiClient.getCompanyDetails('AAPL');
    expect(fetchMock).toHaveBeenCalled();
    expect(details?.ticker).toBe('AAPL');
  });
});
