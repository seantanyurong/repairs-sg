'use client';

import { useState } from 'react';
import JobDurationPrediction from './JobDuration';
import ServicePricePrediction from './ServicePrice';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState<'duration' | 'price'>('duration');

  return (
    <div>
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
      {activeTab === 'price' && <ServicePricePrediction />}
    </div>
  );
}