'use client';

import { useState } from 'react';
import GraphDisplay from './_components/graph'; 
import CustomDialog from './_components/dialog';
import SmartInsightsDialog from './_components/insights';

export default function InvoiceAnalytics() {
  const currentDate = new Date();
  const previousMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
  const previousMonth = previousMonthDate.toLocaleDateString('en-SG', { timeZone: 'Asia/Singapore', month: 'long' });

  const [selectedGraph, setSelectedGraph] = useState('payment-type-dist');  // Default to Graph1
  const [timePeriod, setTimePeriod] = useState('one-month');                // Default Time Period
  const [summaryType, setSummaryType] = useState('total');                  // Default Summary Type
  const [paymentType, setPaymentType] = useState('paynow');                 // Default Time Period
  const [selectedMonth, setSelectedMonth] = useState(previousMonth);        // Default Summary Type
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [isInsightsDialogOpen, setIsInsightsDialogOpen] = useState(true);

  const graphs = [
    { id: 'payment-type-dist', title: 'Payment Type Distribution' },
    { id: 'payment-duration-dist', title: 'Payment Duration Distribution' },
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

  const paymentTypes = [
    { id: 'paynow', label: 'PayNow' },
    { id: 'bank', label: 'Bank Transfer' },
  ];

  const selectedMonths = [
    { id: 'January', label: 'January' },
    { id: 'February', label: 'February' },
    { id: 'March', label: 'March' },
    { id: 'April', label: 'April' },
    { id: 'May', label: 'May' },
    { id: 'June', label: 'June' },
    { id: 'July', label: 'July' },
    { id: 'August', label: 'August' },
    { id: 'September', label: 'September' },
    { id: 'October', label: 'October' },
    { id: 'November', label: 'November' },
    { id: 'December', label: 'December' },
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-4 md:text-3xl">Invoice Analytics</h1>

      {/* Navbar for Graph Selection */}
      <nav className="flex flex-wrap mb-6">
        {graphs.map((graph) => (
          <button
            key={graph.id}
            onClick={() => {
              console.log('Graph Selected:', graph.id);
              setSelectedGraph(graph.id);
              if (['payment-type-dist'].includes(selectedGraph)) {
                setTimePeriod('one-month');
                setSummaryType('total'); 
                setIsDialogOpen(true);
              }
              if (['payment-duration-dist'].includes(selectedGraph)) {
                setPaymentType('paynow');
                setSelectedMonth(previousMonth); 
                setIsDialogOpen(false);
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
            paymentType={paymentType}
            selectedMonth={selectedMonth}
          />
        </div>

        {/* Dropdowns for Time Period and Summary Type */}
        {['payment-type-dist'].includes(selectedGraph) && (
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

        {/* Dropdowns for Payment Type and Selected Month */}
        {['payment-duration-dist'].includes(selectedGraph) && (
          <div className="ml-0 md:ml-6 flex flex-col space-y-4">
            {/* Payment Type Dropdown */}
            <div>
              <label htmlFor="payment-type" className="mr-2">Payment Type:</label>
              <select
                id="payment-type"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="p-2 border rounded-md"
              >
                {paymentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Month Dropdown */}
            <div>
              <label htmlFor="selected-month" className="mr-2">Selected Month:</label>
              <select
                id="selected-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 border rounded-md"
              >
                {selectedMonths.map((month) => (
                  <option key={month.id} value={month.id}>
                    {month.label}
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

      {isDialogOpen && 
      <CustomDialog  
        title="Note" 
        message="Payment Duration Distribution Graphs are generated up to the previous month as the current month has not yet fully past. i.e. If current month is October '24, selecting September will generate September '24 data whereas selecting October will generate October '23 data." 
      />
      }
    </div>
  );
}