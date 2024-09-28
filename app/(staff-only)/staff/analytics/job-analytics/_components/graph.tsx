'use client';

import { useState, useEffect } from 'react';
import { Bar, /*Scatter, Line*/ } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GraphDisplayProps {
  selectedGraph: string;
  timePeriod: string;
  summaryType: string;
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
  },
};

const GraphDisplay: React.FC<GraphDisplayProps> = ({ selectedGraph, timePeriod, summaryType }) => {
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

      if (selectedGraph === 'graph1') {
        label = 'Job Type Distribution';
        switch (timePeriod) {
          case '1Month':
            if (summaryType === 'Total') {
              dataUrl = '/analytics/job-type-dist-one-month-total.json';
            } else {
              dataUrl = '/analytics/job-type-dist-one-month-average.json';
            }
            break;
          case '3Months':
            if (summaryType === 'Total') {
              dataUrl = '/analytics/job-type-dist-three-month-total.json';
            } else {
              dataUrl = '/analytics/job-type-dist-three-month-average.json';
            }
            break;
          case '6Months':
            if (summaryType === 'Total') {
              dataUrl = '/analytics/job-type-dist-six-month-total.json';
            } else {
              dataUrl = '/analytics/job-type-dist-six-month-average.json';
            }
            break;
          case '12Months':
            if (summaryType === 'Total') {
              dataUrl = '/analytics/job-type-dist-twelve-month-total.json';
            } else {
              dataUrl = '/analytics/job-type-dist-twelve-month-average.json';
            }
            break;
          default:
            dataUrl = '/analytics/job-type-dist-one-month-total.json';
        }
      } else if (selectedGraph === 'graph2') {
        dataUrl = '/analytics/job-duration-dist.json';
        label = 'Job Duration Distribution';
      } else if (selectedGraph === 'graph3') {
        dataUrl = '/analytics/job-duration-dist.json';
        label = 'Job Revenue Distribution';
      } else if (selectedGraph === 'graph4') {
        dataUrl = '/analytics/job-duration-dist.json';
        label = 'Job Delay Distribution';
      } else if (selectedGraph === 'graph5') {
        dataUrl = '/analytics/job-duration-forecast.json';
        label = 'Job Duration Forecast';
      } else if (selectedGraph === 'graph6') {
        dataUrl = '/analytics/job-demand-forecast.json';
        label = 'Job Demand Forecast';
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

    if (['graph1', 'graph2', 'graph3', 'graph4', 'graph5', 'graph6'].includes(selectedGraph)) {
      fetchData();
    }
  }, [selectedGraph, timePeriod, summaryType]);

  if (['graph1', 'graph2', 'graph3', 'graph4'].includes(selectedGraph)) {
    return (
      <div className="w-full h-96">
        <Bar data={chartData} options={options} />
      </div>
    );
  }

  // if (selectedGraph === 'graph5') {
  //   return (
  //     <div className="w-full h-96">
  //       <Scatter data={chartData} options={options} />
  //     </div>
  //   );
  // }

  // if (selectedGraph === 'graph6') {
  //   return (
  //     <div className="w-full h-96">
  //       <Line data={chartData} options={options} /> 
  //     </div>
  //   );
  // }

  // Placeholder for other graphs or unselected graphs
  return <div>Select a graph to view.</div>;
};

export default GraphDisplay;