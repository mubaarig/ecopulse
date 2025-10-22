import { notFound } from 'next/navigation';
import { CompanyDashboard } from '@/components/features/company-dashboard';
import { apiClient } from '@/lib/api/client';

interface CompanyPageProps {
  params: Promise<{
    ticker: string;
  }>;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { ticker } = await params;
  const company = await apiClient.getCompanyDetails(ticker);

  if (!company) {
    notFound();
  }

  return <CompanyDashboard company={company} />;
}
