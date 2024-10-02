import { TooltipItem } from 'chart.js';

export const getLabels = (selectedGraph: string) => {
  let xLabel = '';
  let yLabel = '';

  switch (selectedGraph) {
    case 'job-type-dist':
      xLabel = 'Job Types';
      yLabel = 'Number of Jobs';
      break;
    case 'job-duration-dist':
      xLabel = 'Job Types';
      yLabel = 'Duration (Minutes)';
      break;
    case 'job-delay-dist':
      xLabel = 'Job Types';
      yLabel = 'Delay (Minutes)';
      break;
    case 'job-revenue-dist':
      xLabel = 'Job Types';
      yLabel = 'Revenue ($)';
      break;
    case 'job-revenue-forecast':
      xLabel = 'Time Period';
      yLabel = 'Revenue ($)';
      break;
    case 'job-demand-forecast':
      xLabel = 'Time Period';
      yLabel = 'Number of Jobs';
      break;
    default:
      xLabel = 'X-Axis';
      yLabel = 'Y-Axis';
  }
  
  return {
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
    scales: {
      x: {
        title: {
          display: true,
          text: xLabel,
        },
      },
      y: {
        title: {
          display: true,
          text: yLabel,
        },
      },
    },
  };  
};