import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../../../../../../../components/ui/dialog';

interface ChurnData {
  monthly: {
    total_active_month: number;
    current_churn_month: number;
    churn_rate_month: number;
  };
  quarterly: {
    total_active_quarter: number;
    current_churn_quarter: number;
    churn_rate_quarter: number;
  };
}

interface ChurnAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  forecastPeriod: 'month' | 'quarter';
}

const SmartInsights: React.FC<ChurnAnalysisModalProps> = ({ isOpen, onClose, forecastPeriod }) => {
  const [churnData, setChurnData] = useState<ChurnData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(forecastPeriod === 'month' ? 'Monthly' : 'Quarterly'); 

  useEffect(() => {
    const fetchChurnData = async () => {
      try {
        const response = await fetch('/analytics/customer/customer-churn-rate.json');
        const data: ChurnData = await response.json();
        setChurnData(data);
      } catch (error) {
        console.error('Error fetching churn data:', error);
      }
    };

    if (isOpen) {
      fetchChurnData();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedPeriod(forecastPeriod === 'month' ? 'Monthly' : 'Quarterly');
  }, [forecastPeriod]);

  const periodTabs = ['Monthly', 'Quarterly'];

  const graphMessages = `Churn Analysis for ${selectedPeriod}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-secondary">
        <DialogHeader>
          <DialogTitle>Churn Analysis</DialogTitle>
          <DialogDescription>
            <div style={{ maxHeight: '75px', overflowY: 'auto' }}>
              <p>{graphMessages}</p>
              <p className="mt-2">
                <strong>Churn Rate </strong>
                <br />
                = &nbsp; 
                <span style={{ fontSize: '1.2em', display: 'inline-flex', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.8em', marginRight: '4px' }}>
                    <strong>Customers Lost</strong>
                  </span>
                  <span style={{ fontSize: '0.8em' }}>/</span>
                  <span style={{ fontSize: '0.8em', marginLeft: '4px' }}>
                    <strong>Customers at Start of Time Period</strong>
                  </span>
                </span>
                &nbsp;× 100%
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-around my-4">
          {periodTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedPeriod(tab)}
              className={`px-4 py-2 rounded ${
                selectedPeriod === tab ? 'bg-primary text-white' : 'bg-secondary text-black hover:bg-primary hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Display Churn Data */}
        <div className="p-4 bg-gray-100 rounded-md max-h-60 overflow-y-auto">
          {churnData ? (
            <div>
              <p style={{ fontSize: '14px' }}>
                {selectedPeriod === 'Monthly' ? `Latest Month` : `Latest Quarter`}
              </p>
              <p style={{ fontSize: '14px' }}>
                {selectedPeriod === 'Monthly' ? `Customers at Start of Time Period: ${churnData.monthly.total_active_month}` : `Customers at Start of Time Period: ${churnData.quarterly.total_active_quarter}`}
              </p>
              <p style={{ fontSize: '14px' }}>
                {selectedPeriod === 'Monthly' ? `Customers Lost: ${churnData.monthly.current_churn_month}` : `Customers Lost: ${churnData.quarterly.current_churn_quarter}`}
              </p>
              <p style={{ fontSize: '14px' }}>
                {selectedPeriod === 'Monthly' ? `Churn Rate: ${churnData.monthly.churn_rate_month}%` : `Churn Rate: ${churnData.quarterly.churn_rate_quarter}%`}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: '14px' }}>No Churn Data Available.</p>
          )}
        </div>

        <div className="mt-4 flex">
          <button
            className="ml-auto bg-primary text-secondary px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartInsights;
