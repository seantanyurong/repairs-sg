'use client';

import { useState } from 'react';
import GraphDisplay from './_components/graph'; 

export default function JobAnalytics() {
  const [selectedGraph, setSelectedGraph] = useState('job-type-dist');  // Default to Graph1
  const [timePeriod, setTimePeriod] = useState('one-month');            // Default Time Period
  const [summaryType, setSummaryType] = useState('total');              // Default Summary Type
  const [forecastPeriod, setForecastPeriod] = useState('month');        // Default Forecast Period
  const [selectedJob, setSelectedJob] = useState('electrician');        // Default Job Type 

  const graphs = [
    { id: 'job-type-dist', title: 'Job Type Distribution' },
    { id: 'job-duration-dist', title: 'Job Duration Distribution' },
    { id: 'job-delay-dist', title: 'Job Delay Distribution' },
    { id: 'job-revenue-dist', title: 'Job Revenue Distribution' },
    { id: 'job-revenue-forecast', title: 'Job Revenue Forecasting' },
    { id: 'job-demand-forecast', title: 'Job Demand Forecasting' },
  ];

  const timePeriods = [
    { id: 'one-month', label: 'Last 1 Month' },
    { id: 'three-month', label: 'Last 3 Months' },
    { id: 'six-month', label: 'Last 6 Months' },
    { id: 'twelve-month', label: 'Last 12 Months' },
  ];

  const summaryTypes = [
    { id: 'total', label: 'Total' },
    { id: 'average', label: 'Average' },
  ];

  const forecastPeriods = [
    { id: 'month', label: 'Month-on-Month' },
    { id: 'quarter', label: 'Quarter-on-Quarter' },
  ];

  const jobTypes = [
    { id: 'electrician', label: 'Electrician' },
    { id: 'ventilation', label: 'Ventilation' },
    { id: 'plumber', label: 'Plumber' },
    { id: 'handyman', label: 'Handyman' },
    { id: 'aircon', label: 'Aircon' },
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
              if (['job-type-dist', 'job-duration-dist', 'job-delay-dist', 'job-revenue-dist'].includes(selectedGraph)) {
                setTimePeriod('one-month');
                setSummaryType('total'); 
              }
              if (['job-revenue-forecast', 'job-demand-forecast'].includes(selectedGraph)) {
                setForecastPeriod('month');
                setSelectedJob('electrician'); 
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
            summaryType={summaryType} 
            forecastPeriod={forecastPeriod} 
            selectedJob={selectedJob} 
          />
        </div>

        {/* Dropdowns for Time Period and Summary Type */}
        {['job-type-dist', 'job-duration-dist', 'job-delay-dist', 'job-revenue-dist'].includes(selectedGraph) && (
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
            {['job-type-dist', 'job-revenue-dist'].includes(selectedGraph) && (
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
            )}
          </div>
        )}

        {/* Dropdowns for Forecast Period and Job Type */}
        {['job-revenue-forecast', 'job-demand-forecast'].includes(selectedGraph) && (
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
            
            {/* Job Type Dropdown */}
            <div>
              <label htmlFor="job-type" className="mr-2">Job Type:</label>
              <select
                id="job-type"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="p-2 border rounded-md"
              >
                {jobTypes.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.label}
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
