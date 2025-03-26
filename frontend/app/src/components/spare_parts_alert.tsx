import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { hostServer } from '../constants/variables';

export interface SparePart {
  id: number;
  name: string;
  description?: string;
  value: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  lifespan: number | null;
  stock: number;
}

export interface SparePartAlertProps {
  warningThreshold?: number;
  criticalThreshold?: number;
  checkInterval?: number;
  route: string;
}

const SparePartsAlert = ({
  warningThreshold = 30,
  criticalThreshold = 7,
  checkInterval = 3600000,
  route = ""
}: SparePartAlertProps) => {
  const [expiringParts, setExpiringParts] = useState<SparePart[]>([]);
  const [initialized, setInitialized] = useState(false);

  const showNotification = (part: SparePart) => {
    if (!part.lifespan) return;
    
    const daysLeft = part.lifespan;
    const severity = daysLeft <= criticalThreshold ? 'error' : 'warning';
    const toastId = `part-alert-${part.id}`;

    // Check if toast already exists
    if (!toast.isActive(toastId)) {
      toast[severity](
        `Spare part "${part.name}" has ${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining lifespan. Stock: ${part.stock}`,
        {
          toastId,
          autoClose: 3000,
          position: 'top-right',
          onClose: () => {
            // Remove from state when dismissed
            setExpiringParts(prev => prev.filter(p => p.id !== part.id));
          }
        }
      );
    }
  };

  const checkExpiringParts = async () => {
    try {
      const response = await axios.get<SparePart[]>(
        `${hostServer}/${route}/expiringSoon?threshold=${warningThreshold}`
      );
      
      // Only show notifications for new expiring parts
      const newParts = response.data.filter(
        part => !expiringParts.some(p => p.id === part.id)
      );

      newParts.forEach(showNotification);
      setExpiringParts(response.data);
    } catch (error) {
      console.error('Error checking expiring parts:', error);
      toast.error('Failed to check expiring spare parts', {
        autoClose: 3000,
      });
    } finally {
      if (!initialized) setInitialized(true);
    }
  };

  useEffect(() => {
    if (!initialized) return;

    const intervalId = setInterval(checkExpiringParts, checkInterval);
    return () => clearInterval(intervalId);
  }, [checkInterval]);

  useEffect(() => {
    // Initial check after component mounts
    const timer = setTimeout(() => {
      checkExpiringParts();
    }, 1000); // Short delay to ensure ToastContainer is ready

    return () => {
      clearTimeout(timer);
      // Clean up all toasts when component unmounts
      toast.dismiss();
    };
  }, []);

  return (
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
  );
};

export default SparePartsAlert;