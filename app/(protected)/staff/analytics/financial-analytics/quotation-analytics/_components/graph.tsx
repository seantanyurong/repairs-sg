'use client';

import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { getLabels } from './label';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

interface GraphDisplayProps {
  selectedGraph: string;
  timePeriod: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];    
    borderWidth: number;
  }[];
}

const GraphDisplay: React.FC<GraphDisplayProps> = ({ 
  selectedGraph, 
  timePeriod, 
}) => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: [],  
        borderColor: [],
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

      if (selectedGraph === 'response-duration-dist') {
        label = 'Response Duration Distribution';
        dataUrl = `/analytics/financial/quotation/${selectedGraph}-${timePeriod}-month.json`;
      } else if (selectedGraph === 'response-reason-dist') {
        label = 'Response Reasoning Distribution';
        dataUrl = `/analytics/financial/quotation/${selectedGraph}-${timePeriod}-month.json`;
      } 

      try {
        console.log('Fetching data from:', dataUrl);
        const response = await fetch(dataUrl);
        console.log('Response is:', response);
        const json = await response.json();
        console.log('Fetched Data:', json);

        // Prepare background colors
        let backgroundColors = json.labels.map(() => 'rgba(255, 206, 86, 0.6)');
        let borderColors = json.labels.map(() => 'rgba(255, 206, 86, 1)');
        const uniqueColors: string[] = [
          'rgba(255, 99, 132, 0.6)', 
          'rgba(54, 162, 235, 0.6)', 
          'rgba(255, 206, 86, 0.6)', 
          'rgba(75, 192, 192, 0.6)', 
          'rgba(153, 102, 255, 0.6)',
        ];
        if (selectedGraph === 'response-reason-dist') {
          backgroundColors = json.labels.map((_: string[], index: number) => 
            uniqueColors[index % uniqueColors.length] 
          );
          borderColors = backgroundColors.map((color: string) => color.replace('0.6', '1'))
        }
        
        setChartData({
            labels: json.labels, 
            datasets: [
              {
                label: label, 
                data: json.data, 
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
              },
            ],
          });
      } catch (error) {
        console.error('Error fetching data:', error);
      }      
    };

    if (['response-duration-dist', 'response-reason-dist'].includes(selectedGraph)) {
      fetchData();
    }
  }, [selectedGraph, timePeriod]);

  if (['response-duration-dist'].includes(selectedGraph)) {
    return (
      <div className="w-full h-96">
        <Bar data={chartData} options={options} />
      </div>
    );
  }

  if (['response-reason-dist'].includes(selectedGraph)) {
    return (
      <div className="w-full h-[32rem]">
        <Pie data={chartData} options={options} />
      </div>
    );
  }

  // Placeholder for other graphs or unselected graphs
  return <div>Select a graph to view.</div>;
};

export default GraphDisplay;