import { notFound } from "next/navigation";
import { CompanyDashboard } from "@/components/features/company-dashboard";
import { apiClient } from "@/lib/api/client";

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
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Building2 className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
          <p className="text-gray-600">
            {company.ticker} • {company.industry}
          </p>
        </div>
      </div>

      <CompanyDashboard company={company} />
    </div>
  );
}
