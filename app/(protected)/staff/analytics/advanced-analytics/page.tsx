'use client';

import { useState } from 'react';
import JobDurationPrediction from './_components/JobDuration';

export default function AdvancedAnalytics() {
  const [activeTab, setActiveTab] = useState<'duration' | 'price'>('duration');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 md:text-3xl">Advanced Analytics</h1>

      {/* Tabs Navigation */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('duration')}
          className={`flex-1 mx-2 px-4 py-2 rounded-md transition ${
            activeTab === 'duration'
              ? 'bg-primary text-white'
              : 'bg-secondary text-black hover:bg-primary hover:text-white'
          }`}
        >
          Job Duration Prediction
        </button>
        <button
          onClick={() => setActiveTab('price')}
          className={`flex-1 mx-2 px-4 py-2 rounded-md transition ${
            activeTab === 'price'
              ? 'bg-primary text-white'
              : 'bg-secondary text-black hover:bg-primary hover:text-white'
          }`}
        >
          Service Price Prediction
        </button>
      </div>

      {activeTab === 'duration' && <JobDurationPrediction />}
    </div>
  );
}
