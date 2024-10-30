import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../../../../../../../components/ui/dialog';

interface ReviewData {
  labels: number[];
  data: string[];
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState(5); // Default to 5-star reviews
  const [reviews, setReviews] = useState<ReviewData>({ labels: [], data: [] });
  const [lowestRatingWithReview, setLowestRatingWithReview] = useState<number | null>(null);

  const tabs = [
    { id: 5, label: '5 Stars' },
    { id: 4, label: '4 Stars' },
    { id: 3, label: '3 Stars' },
    { id: 2, label: '2 Stars' },
    { id: 1, label: '1 Star' },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/analytics/customer/customer-rating-review.json'); 
        const data = await response.json();
        setReviews(data);
        findLowestRatingWithReview(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen]);

  const findLowestRatingWithReview = (data: ReviewData) => {
    let lowestRating = null;
    
    for (let i = 0; i < data.labels.length; i++) {
      const rating = data.labels[i];
      const reviewCount = data.data[i].length;

      if (reviewCount > 0 && (lowestRating === null || rating < lowestRating)) {
        lowestRating = rating;
      }
    }

    setLowestRatingWithReview(lowestRating);
  };

  const reviewList = reviews.labels ? 
    reviews.data.filter((_, index) => reviews.labels[index] === selectedTab) 
    : [];

  const lowestRatingReviews = reviews.labels && lowestRatingWithReview !== null ? 
  reviews.data.filter((review, index) => 
    reviews.labels[index] === lowestRatingWithReview && 
    review !== "This customer left a review without a comment"
  ) : [];

  const graphMessages = "Recommendations: It is recommended to focus on Review Rating with " + lowestRatingWithReview + " Stars, to directly address their concerns i.e. [" + lowestRatingReviews[0] + "].";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-secondary">
        <DialogHeader>
          <DialogTitle>Customer Reviews</DialogTitle>
          <DialogDescription>
            <div style={{ maxHeight: '75px', overflowY: 'auto' }}>
              <p>{graphMessages}</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-around my-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded ${
                selectedTab === tab.id ? 'bg-primary text-white' : 'bg-secondary text-black hover:bg-primary hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Display Reviews */}
        <div className="p-4 bg-gray-100 rounded-md max-h-60 overflow-y-auto">
          {reviewList.length > 0 ? (
            reviewList.map((review, index) => (
              <div key={index} className="mb-4">
                <p style={{ fontSize: '14px' }}>{review}</p>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '14px' }}>No Reviews Available For This Rating.</p>
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

export default ReviewModal;
