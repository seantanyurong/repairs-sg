'use client';

import { useState } from 'react';
import GraphDisplay from './_components/graph'; 

export default function JobAnalytics() {
  const [selectedGraph, setSelectedGraph] = useState('graph1'); // Default to graph1
  const [timePeriod, setTimePeriod] = useState('1Month');       // Default time period
  const [summaryType, setSummaryType] = useState('Total');      // Default summary type

  const graphs = [
    { id: 'graph1', title: 'Job Type Distribution' },
    { id: 'graph2', title: 'Job Duration Distribution' },
    { id: 'graph3', title: 'Job Revenue Distribution' },
    { id: 'graph4', title: 'Job Delay Distribution' },
    { id: 'graph5', title: 'Job Duration Forecasting' },
    { id: 'graph6', title: 'Job Demand Forecasting' },
  ];

  const timePeriods = [
    { id: '1Month', label: 'Last 1 Month' },
    { id: '3Months', label: 'Last 3 Months' },
    { id: '6Months', label: 'Last 6 Months' },
    { id: '12Months', label: 'Last 12 Months' },
  ];

  const summaryTypes = [
    { id: 'Total', label: 'Total' },
    { id: 'Average', label: 'Average' },
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-4 md:text-3xl">Job Analytics</h1>

      {/* Navbar for Graph Selection */}
      <nav className="flex flex-wrap mb-6">
        {graphs.map((graph) => (
          <button
            key={graph.id}
            onClick={() => {
              console.log('Graph Selected:', graph.id);
              setSelectedGraph(graph.id);
              if (graph.id === 'graph1') {
                setTimePeriod('1Month');
                setSummaryType('Total') 
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
          {/* Display Selected Graph */}
          <GraphDisplay selectedGraph={selectedGraph} timePeriod={timePeriod} summaryType={summaryType} />
        </div>

        {/* Dropdowns for Time Period and Summary Type */}
        {selectedGraph === 'graph1' && (
          <div className="ml-0 md:ml-6 flex flex-col space-y-4">
            {/* Time Period Dropdown */}
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

            {/* Summary Type Dropdown */}
            <div>
              <label htmlFor="summary-type" className="mr-2">Summary Type:</label>
              <select
                id="summary-type"
                value={summaryType}
                onChange={(e) => setSummaryType(e.target.value)}
                className="p-2 border rounded-md"
              >
                {summaryTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
