import { TooltipItem } from 'chart.js';

export const getLabels = (selectedGraph: string) => {
  let xLabel = '';
  let yLabel = '';
  let indexAxis: 'x' | 'y' = 'x';   // Default to vertical

  switch (selectedGraph) {
    case 'customer-rating-dist':
      xLabel = 'Rating';
      yLabel = 'Number of Customers';
      indexAxis = 'y';
      break;
    case 'customer-acquisition-forecast':
      xLabel = 'Time Period';
      yLabel = 'Number of Customers';
      break;
    case 'customer-churn-forecast':
      xLabel = 'Time Period';
      yLabel = 'Number of Customers';
      break;
    default:
      xLabel = 'X-Axis';
      yLabel = 'Y-Axis';
  }
  
  return {
    indexAxis,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: TooltipItem<'bar' | 'line'>[]) => {
            const graphType = tooltipItems[0].dataset.label;
            return `${graphType}`;
          },
          label: (tooltipItem: TooltipItem<'bar' | 'line'>) => {
            const { dataset, raw } = tooltipItem;
            switch (dataset.label) {
              case 'Customer Satisfaction Rating Distribution':
                return `Count: ${raw} Customers`;
              case 'Customer Acquisition Forecasting':
                return `Count: ${raw} Customers`;
            case 'Customer Churn Forecasting':
                return `Count: ${raw} Customers`;
              default:
                return `Value: ${raw}`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: indexAxis === 'y' ? yLabel : xLabel,
        },
      },
      y: {
        title: {
          display: true,
          text: indexAxis === 'y' ? xLabel : yLabel,
        },
      },
    },
  };  
};