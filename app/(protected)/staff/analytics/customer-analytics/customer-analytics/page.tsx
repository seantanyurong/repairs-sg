'use client';

import { useState } from 'react';
import GraphDisplay from './_components/graph';
import ReviewModal from './_components/modal';
import { InfoCircledIcon } from '@radix-ui/react-icons';

export default function CustomerAnalytics() {
  const [selectedGraph, setSelectedGraph] = useState('customer-rating-dist');   // Default to Graph1
  const [forecastPeriod, setForecastPeriod] = useState('month');                // Default Forecast Period
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); 

  const graphs = [
    { id: 'customer-rating-dist', title: 'Customer Satisfaction Rating Distribution' },
    { id: 'customer-acquisition-forecast', title: 'Customer Acquisition Forecasting' },
    { id: 'customer-churn-forecast', title: 'Customer Churn Forecasting' },
  ];

  const forecastPeriods = [
    { id: 'month', label: 'Month-on-Month' },
    { id: 'quarter', label: 'Quarter-on-Quarter' },
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-4 md:text-3xl">Customer Analytics</h1>

      {/* Navbar for Graph Selection */}
      <nav className="flex flex-wrap mb-6">
        {graphs.map((graph) => (
          <button
            key={graph.id}
            onClick={() => {
              console.log('Graph Selected:', graph.id);
              setSelectedGraph(graph.id);
              if (['customer-acquisition-forecast', 'customer-churn-forecast'].includes(selectedGraph)) {
                setForecastPeriod('month');
              }
            }}
            className={`flex-1 mx-2 px-4 py-2 rounded-md transition ${
              selectedGraph === graph.id
                ? 'bg-primary text-white'
                : 'bg-secondary text-black hover:bg-primary hover:text-white'
            }`}
          >
            {graph.title}
          </button>
        ))}
      </nav>

      <div className="flex flex-col md:flex-row items-start">
        <div className="flex-1 p-3">
          <GraphDisplay 
            selectedGraph={selectedGraph} 
            forecastPeriod={forecastPeriod} 
          />
        </div>

        {['customer-acquisition-forecast', 'customer-churn-forecast'].includes(selectedGraph) && (
          <div className="ml-0 md:ml-6 flex flex-col space-y-4">
            {/* Forecast Period Dropdown */}
            <div>
              <label htmlFor="forecast-period" className="mr-2">Forecast Period:</label>
              <select
                id="forecast-period"
                value={forecastPeriod}
                onChange={(e) => setForecastPeriod(e.target.value)}
                className="p-2 border rounded-md"
              >
                {forecastPeriods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Button to Open Review Modal */}
				{['customer-rating-dist'].includes(selectedGraph) && (
					<button
						className="bg-primary p-3 rounded-full hover:bg-grey-400 transition-colors mt-6"
						onClick={() => setIsReviewModalOpen(true)}
					>
						<InfoCircledIcon className="w-6 h-6 text-white" />
					</button>
				)}

				<ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      </div>
    </div>
  );
}
