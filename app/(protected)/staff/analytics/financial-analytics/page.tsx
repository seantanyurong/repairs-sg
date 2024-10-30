import Link from 'next/link';
import Image from 'next/image';

export default function FinancialAnalyticsDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Financial Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/staff/analytics/financial-analytics/quotation-analytics">
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md cursor-pointer">
            <h2 className="text-lg font-semibold">Quotation Analytics</h2>
            <Image 
              src="/images/quotation-analytics.svg" 
              alt="Quotation Analytics"
              width={250}
              height={150}
            />
            {/* <a href="https://storyset.com/people">People illustrations by Storyset</a> */}
          </div>
        </Link>

        <Link href="/staff/analytics/financial-analytics/invoice-analytics">
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md cursor-pointer">
            <h2 className="text-lg font-semibold">Invoice Analytics</h2>
            <Image 
              src="/images/invoice-analytics.svg" 
              alt="Invoice Analytics" 
              width={250}
              height={150}
            />
            {/* <a href="https://storyset.com/work">Work illustrations by Storyset</a> */}
          </div>
        </Link>
      </div>
    </div>
  );
}