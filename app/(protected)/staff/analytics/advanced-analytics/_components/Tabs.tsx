'use client';

import { useState } from 'react';
import JobDurationPrediction from './JobDuration';
import JobSchedulingOptimisation from './JobScheduling';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState<'duration' | 'schedule'>('duration');

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
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 mx-2 px-4 py-2 rounded-md transition ${
            activeTab === 'schedule'
              ? 'bg-primary text-white'
              : 'bg-secondary text-black hover:bg-primary hover:text-white'
          }`}
        >
          Job Scheduling Optimisation
        </button>
      </div>

      {activeTab === 'duration' && <JobDurationPrediction />}
      {activeTab === 'schedule' && <JobSchedulingOptimisation />}
    </div>
  );
}