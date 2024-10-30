import Link from 'next/link';
import Image from 'next/image';

export default function CustomerAnalyticsDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/staff/analytics/customer-analytics/customer-analytics">
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md cursor-pointer">
            <h2 className="text-lg font-semibold">Customer Analytics</h2>
            <Image 
              src="/images/customer-analytics.svg" 
              alt="Customer Analytics"
              width={250}
              height={150}
            />
            {/* <a href="https://storyset.com/people">People illustrations by Storyset</a> */}
          </div>
        </Link>

        <Link href="/staff/analytics/customer-analytics/customer-map">
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md cursor-pointer">
            <h2 className="text-lg font-semibold">Customer Map</h2>
            <Image 
              src="/images/customer-map.svg" 
              alt="Customer Map" 
              width={250}
              height={150}
            />
            {/* <a href="https://storyset.com/city">City illustrations by Storyset</a> */}
          </div>
        </Link>
      </div>
    </div>
  );
}