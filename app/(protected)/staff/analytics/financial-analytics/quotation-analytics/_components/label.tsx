import { TooltipItem } from 'chart.js';

export const getLabels = (selectedGraph: string) => {
  let xLabel = '';
  let yLabel = '';
  let xTicksDisplay = true;
  let yTicksDisplay = true; 

  switch (selectedGraph) {
    case 'response-duration-dist':
      xLabel = 'Response Duration (Bins) In Days';
      yLabel = 'Number of Quotation';
      break;
    case 'response-reason-dist':
      xLabel = 'Response Reasoning (%)';
      yLabel = 'Response Type';
      xTicksDisplay = false; 
      yTicksDisplay = false; 
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
          title: (tooltipItems: TooltipItem<'bar' | 'pie'>[]) => {
            const graphType = tooltipItems[0].dataset.label;
            return `${graphType}`;
          },
          label: (tooltipItem: TooltipItem<'bar' | 'pie'>) => {
            const { dataset, raw } = tooltipItem;
            switch (dataset.label) {
              case 'Response Duration Distribution':
                return `Count: ${raw} Quotations`;
              case 'Response Reasoning Distribution':
                return `${raw} %`;
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
        ticks: {
          display: xTicksDisplay, 
        },
      },
      y: {
        title: {
          display: true,
          text: yLabel,
        },
        ticks: {
          display: yTicksDisplay, 
        },
      },
    },
  };  
};