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
import { getLabels } from './label';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

interface GraphDisplayProps {
  selectedGraph: string;
  forecastPeriod: string;
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
  forecastPeriod
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

      if (selectedGraph === 'customer-rating-dist') {
        label = 'Customer Satisfaction Rating Distribution';
        dataUrl = `/analytics/customer/${selectedGraph}.json`;
      } else if (selectedGraph === 'customer-acquisition-forecast') {
        label = 'Customer Acquisition Forecasting';
        dataUrl = `/analytics/customer/${selectedGraph}-${forecastPeriod}.json`;
      } else if (selectedGraph === 'customer-churn-forecast') {
        label = 'Customer Churn Forecasting';
        dataUrl = `/analytics/customer/${selectedGraph}-${forecastPeriod}.json`;
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

    if (['customer-rating-dist', 'customer-acquisition-forecast', 'customer-churn-forecast'].includes(selectedGraph)) {
      fetchData();
    }
  }, [selectedGraph, forecastPeriod]);

  if (['customer-rating-dist'].includes(selectedGraph)) {
    return (
      <div className="w-full h-96">
        <Bar data={chartData} options={options} />
      </div>
    );
  }

  if (['customer-acquisition-forecast', 'customer-churn-forecast'].includes(selectedGraph)) {
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