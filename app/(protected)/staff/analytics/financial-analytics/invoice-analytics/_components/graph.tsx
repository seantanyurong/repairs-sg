'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
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
  timePeriod: string;
  summaryType: string;
  paymentType: string;
  selectedMonth: string;
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
  paymentType,
  selectedMonth,
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

      if (selectedGraph === 'payment-type-dist') {
        label = 'Payment Type Distribution';
        dataUrl = `/analytics/financial/invoice/${selectedGraph}-${timePeriod}-${summaryType}.json`;
      } else if (selectedGraph === 'payment-duration-dist') {
        label = 'Payment Duration Distribution';
        dataUrl = `/analytics/financial/invoice/${selectedGraph}-${paymentType}-${selectedMonth}.json`;
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

    if (['payment-type-dist', 'payment-duration-dist'].includes(selectedGraph)) {
      fetchData();
    }
  }, [selectedGraph, timePeriod, summaryType, paymentType, selectedMonth]);

  if (['payment-type-dist', 'payment-duration-dist'].includes(selectedGraph)) {
    return (
      <div className="w-full h-96">
        <Bar data={chartData} options={options} />
      </div>
    );
  }

  // Placeholder for other graphs or unselected graphs
  return <div>Select a graph to view.</div>;
};

export default GraphDisplay;