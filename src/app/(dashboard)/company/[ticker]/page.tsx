import { notFound } from 'next/navigation';
import { CompanyDashboard } from '@/components/features/company-dashboard';
import { apiClient } from '@/lib/api/client';

type CompanyPageProps = {
  params: Promise<{ ticker: string }>;
};

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { ticker } = await params;
  const company = await apiClient.getCompanyDetails(ticker);

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <CompanyDashboard company={company} />
    </div>
  );
}
