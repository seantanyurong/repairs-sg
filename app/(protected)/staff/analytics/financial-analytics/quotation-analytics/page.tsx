'use client';

import { useState } from 'react';
import GraphDisplay from './_components/graph'; 
import SmartInsightsDialog from './_components/insights';

export default function QuotationAnalytics() {
  const [selectedGraph, setSelectedGraph] = useState('response-duration-dist');   // Default to Graph1
  const [timePeriod, setTimePeriod] = useState('last-twelve');                    // Default Time Period
  const [isInsightsDialogOpen, setIsInsightsDialogOpen] = useState(true);

  const graphs = [
    { id: 'response-duration-dist', title: 'Response Duration Distribution' },
    { id: 'response-reason-dist', title: 'Response (Rejected) Reasoning Distribution' },
  ];

  const timePeriods = [
    { id: 'last-twelve', label: 'Last 12 Month' },
    { id: 'last-twentyfour', label: 'Last 13-24 Months' },
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-4 md:text-3xl">Quotation Analytics</h1>

      {/* Navbar for Graph Selection */}
      <nav className="flex flex-wrap mb-6">
        {graphs.map((graph) => (
          <button
            key={graph.id}
            onClick={() => {
              console.log('Graph Selected:', graph.id);
              setSelectedGraph(graph.id);
              if (['response-duration-dist', 'response-reason-dist'].includes(selectedGraph)) {
                setTimePeriod('last-twelve');
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
            timePeriod={timePeriod} 
          />
        </div>

        {/* Dropdowns for Time Period */}
        {['response-duration-dist', 'response-reason-dist'].includes(selectedGraph) && (
          <div className="ml-0 md:ml-6 flex flex-col space-y-4">
            <div>
              <label htmlFor="time-period" className="mr-2">Time Period:</label>
              <select
                id="time-period"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="p-2 border rounded-md"
              >
                {timePeriods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {isInsightsDialogOpen && 
        <SmartInsightsDialog 
          selectedGraph={selectedGraph} 
          onClose={() => setIsInsightsDialogOpen(false)}
        />
      }
    </div>
  );
}