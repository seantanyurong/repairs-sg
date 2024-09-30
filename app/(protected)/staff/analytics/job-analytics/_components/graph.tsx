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
  TooltipItem, 
  Legend 
} from 'chart.js';

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

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        title: (tooltipItems: TooltipItem<'line' | 'bar'>[]) => {
          const graphType = tooltipItems[0].dataset.label;
          return `${graphType}`;
        },
        label: (tooltipItem: TooltipItem<'line' | 'bar'>) => {
          const { dataset, raw } = tooltipItem;
          switch (dataset.label) {
            case 'Job Type Distribution':
              return `Count: ${raw} Jobs`;
            case 'Average Job Duration Distribution':
              return `Duration: ${raw} Minutes`;
            case 'Average Job Delay Distribution':
              return `Duration: ${raw} Minutes`;
            case 'Job Revenue Distribution':
              return `Revenue: $${raw}`;
            case 'Job Revenue Forecast':
              return `Revenue: $${raw}`;
            case 'Job Demand Forecast':
              return `Count: ${raw} Jobs`;
            default:
              return `Value: ${raw}`;
          }
        },
      },
    },
  },
};

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