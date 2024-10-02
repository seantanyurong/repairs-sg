'use client';

import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { getLabels } from '../_components/label';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

interface GraphDisplayProps {
  selectedGraph: string;
  timePeriod: string;
  summaryType: string;
  forecastPeriod: string;
  selectedJob: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const GraphDisplay: React.FC<GraphDisplayProps> = ({ 
  selectedGraph, 
  timePeriod, 
  summaryType, 
  forecastPeriod, 
  selectedJob 
}) => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  });

  const options = getLabels(selectedGraph);

  useEffect(() => {
    console.log('Selected Graph:', selectedGraph);
    const fetchData = async () => {
      let dataUrl = '';
      let label = '';

      if (selectedGraph === 'job-type-dist') {
        label = 'Job Type Distribution';
        dataUrl = `/analytics/${selectedGraph}-${timePeriod}-${summaryType}.json`;
      } else if (selectedGraph === 'job-duration-dist') {
        label = 'Average Job Duration Distribution';
        dataUrl = `/analytics/${selectedGraph}-${timePeriod}.json`;
      } else if (selectedGraph === 'job-delay-dist') {
        label = 'Average Job Delay Distribution';
        dataUrl = `/analytics/${selectedGraph}-${timePeriod}.json`;
      } else if (selectedGraph === 'job-revenue-dist') {
        label = 'Job Revenue Distribution';
        dataUrl = `/analytics/${selectedGraph}-${timePeriod}-${summaryType}.json`;
      } else if (selectedGraph === 'job-revenue-forecast') {
        label = 'Job Revenue Forecast';
        dataUrl = `/analytics/${selectedGraph}-${selectedJob}-${forecastPeriod}.json`;
      } else if (selectedGraph === 'job-demand-forecast') {
        label = 'Job Demand Forecast';
        dataUrl = `/analytics/${selectedGraph}-${selectedJob}-${forecastPeriod}.json`;
      }

      try {
        console.log('Fetching data from:', dataUrl);
        const response = await fetch(dataUrl);
        console.log('Response is:', response);
        const json = await response.json();
        console.log('Fetched Data:', json);

        setChartData({
            labels: json.labels, 
            datasets: [
              {
                label: label, 
                data: json.data, 
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
              },
            ],
          });
      } catch (error) {
        console.error('Error fetching data:', error);
      }      
    };

    if (['job-type-dist', 'job-duration-dist', 'job-delay-dist', 'job-revenue-dist', 'job-revenue-forecast', 'job-demand-forecast'].includes(selectedGraph)) {
      fetchData();
    }
  }, [selectedGraph, timePeriod, summaryType, forecastPeriod, selectedJob]);

  if (['job-type-dist', 'job-duration-dist', 'job-delay-dist', 'job-revenue-dist'].includes(selectedGraph)) {
    return (
      <div className="w-full h-96">
        <Bar data={chartData} options={options} />
      </div>
    );
  }

  if (['job-revenue-forecast', 'job-demand-forecast'].includes(selectedGraph)) {
    return (
      <div className="w-full h-96">
        <Line data={chartData} options={options} /> 
      </div>
    );
  }

  // Placeholder for other graphs or unselected graphs
  return <div>Select a graph to view.</div>;
};

export default GraphDisplay;