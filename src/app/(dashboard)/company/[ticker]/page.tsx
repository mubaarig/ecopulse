import { notFound } from 'next/navigation';
import { CompanyDashboard } from '@/components/features/company-dashboard';
import { apiClient } from '@/lib/api/client';

interface PageProps {
  params: {
    ticker: string;
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const company = await apiClient.getCompanyDetails(params.ticker);

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <CompanyDashboard company={company} />
    </div>
  );
}
