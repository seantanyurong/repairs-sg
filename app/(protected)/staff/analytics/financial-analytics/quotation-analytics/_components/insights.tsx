import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../../../../../../../components/ui/dialog';
import { InfoCircledIcon } from '@radix-ui/react-icons';

const SmartInsightsDialog = ({ 
  selectedGraph,
 }: { 
  selectedGraph: string;
  onClose: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);

  type GraphType = 'response-duration-dist' | 'response-reason-dist';
  const graphMessages: Record<GraphType, string> = {
    'response-duration-dist': 'Response Duration Distribution \n \n Description: \n This visualisation shows how records in your data distribute between different bins of time period. We found a contrast between the counts for these different bins, which represents an interesting insight. \n \n Recommendations: \n It is recommended to focus on those quotation responses which took more than i.e. 10 Days as these generally have a lower successful conversion rate. Also, it is recommended to send reminders to Customers respond to sent Quotation if they have yet to respond after i.e. 7 Days. ',
    'response-reason-dist': 'Response Reasoning Distribution \n \n Description: \n This pie chart shows the distribution of data across different members of Response Reasoning (For Rejection). It is a good representation of importance of greatest factor in your data. The slices of the pie chart represent sections of records by response reasoning and the size of the slice represent the aggregated value for each section. \n \n Recommendations: \n It is recommended to focus on the largest proportion which is the greatest contributing factor to quotation rejection. Also, it is recommended to mitigate this factor to improve quotation conversion to sales rate. \n \n Legend: \n Better Quotation Elsewhere: Other Company Offers Better Quotation. \n Budget Limitation: Reasonable Pricing But Budget Constraints. \n Pricing Concerns: Too Expensive. \n Scheduling Conflicts: Unavailable Timeslots. \n Slow Responsiveness: Of Repair.sg.',
  };
  const message = graphMessages[selectedGraph as GraphType];

  return (
    <>
      <button
        className="bg-primary p-3 rounded-full hover:bg-grey-400 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <InfoCircledIcon className="w-6 h-6 text-white" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-secondary">
          <DialogHeader>
            <DialogTitle>Smart Insights</DialogTitle>
            <DialogDescription className="text-justify">
              {message.split('\n').map((line, index) => (
                <span key={index}>
                  {index === 0 ? <strong>{line}</strong> : line}
                  <br />
                </span>
              )) || 'No insights available for this graph.'}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex">
            <button
              className="ml-auto bg-primary text-secondary px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              onClick={closeDialog}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SmartInsightsDialog;
