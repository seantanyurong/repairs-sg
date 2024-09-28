import Link from 'next/link';
import Image from 'next/image';

export default function AnalyticsDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/staff/analytics/job-analytics">
          <div className="p-4 border rounded-lg hover:shadow-md cursor-pointer">
            <h2 className="text-lg font-semibold">Job Analytics</h2>
            <Image 
              src="/images/job-analytics.svg" 
              alt="Job Analytics"
              width={500}
              height={300}
            />
            {/* <a href="https://storyset.com/job">Job illustrations by Storyset</a> */}
          </div>
        </Link>

        <Link href="/analytics/quotation-analytics">
          <div className="p-4 border rounded-lg hover:shadow-md cursor-pointer">
            <h2 className="text-lg font-semibold">Quotation Analytics</h2>
            <Image 
              src="/images/quotation-analytics.svg" 
              alt="Quotation Analytics" 
              width={500}
              height={300}
            />
            {/* <a href="https://storyset.com/people">People illustrations by Storyset</a> */}
          </div>
        </Link>

        <Link href="/analytics/invoice-analytics">
          <div className="p-4 border rounded-lg hover:shadow-md cursor-pointer">
            <h2 className="text-lg font-semibold">Invoice Analytics</h2>
            <Image 
              src="/images/invoice-analytics.svg" 
              alt="Invoice Analytics" 
              width={500}
              height={300}
            />
            {/* <a href="https://storyset.com/work">Work illustrations by Storyset</a> */}
          </div>
        </Link>

        <Link href="/analytics/customer-analytics">
          <div className="p-4 border rounded-lg hover:shadow-md cursor-pointer">
            <h2 className="text-lg font-semibold">Customer Analytics</h2>
            <Image 
              src="/images/customer-analytics.svg" 
              alt="Customer Analytics" 
              width={500}
              height={300}
            />
            {/* <a href="https://storyset.com/people">People illustrations by Storyset</a> */}
          </div>
        </Link>
      </div>
    </div>
  );
}