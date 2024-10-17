import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../../../../../components/ui/dialog';
import { InfoCircledIcon } from '@radix-ui/react-icons';

const SmartInsightsDialog = ({ 
  selectedGraph,
 }: { 
  selectedGraph: string;
  onClose: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = () => setIsOpen(false);

  type GraphType = 'payment-type-dist' | 'payment-duration-dist';
  const graphMessages: Record<GraphType, string> = {
    'payment-type-dist': 'Payment Type Distribution \n \n Description: \n This visualisation shows how records in your data distribute between different members of Payment Methods across the past year. The data can be aggregated via specific time periods. We found a contrast between the counts for these different members, which represents an interesting insight. \n \n Recommendations: \n It is recommended to focus on optimising those channels with higher usage to ensure seamless user experience. ',
    'payment-duration-dist': 'Payment Duration Distribution \n \n Description: \n This visualisation shows how records in your data distribute between different members of Payment Duration across the past year. The data can be aggregated via specific months for different payment types. We found a contrast between the counts for these different members, which represents an interesting insight. \n \n Recommendations: \n It is recommended to focus on late payments where duration exceeds i.e. 10 Days. Also, it is recommended to send reminders to Customers if they have yet to pay after i.e. 7 Days. ',
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
