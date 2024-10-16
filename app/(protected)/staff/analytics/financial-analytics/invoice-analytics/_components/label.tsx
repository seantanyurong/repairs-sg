import { TooltipItem } from 'chart.js';

export const getLabels = (selectedGraph: string) => {
  let xLabel = '';
  let yLabel = '';

  switch (selectedGraph) {
    case 'payment-type-dist':
      xLabel = 'Payment Types';
      yLabel = 'Number of Payments';
      break;
    case 'payment-duration-dist':
      xLabel = 'Payment Duration (<= Days Taken)';
      yLabel = 'Number of Payments';
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
          title: (tooltipItems: TooltipItem<'bar'>[]) => {
            const graphType = tooltipItems[0].dataset.label;
            return `${graphType}`;
          },
          label: (tooltipItem: TooltipItem<'bar'>) => {
            const { dataset, raw } = tooltipItem;
            switch (dataset.label) {
              case 'Payment Type Distribution':
                return `Count: ${raw} Payments`;
              case 'Payment Duration Distribution':
                return `Count: ${raw} Payments`;
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