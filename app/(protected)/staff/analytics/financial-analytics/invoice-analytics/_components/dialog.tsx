import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../../../../../components/ui/dialog';

const CustomDialog = ({ title, message }: { title: string, message: string }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-secondary">
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription className="text-justify">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <button
            className="ml-auto bg-primary text-secondary px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            onClick={closeDialog}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
