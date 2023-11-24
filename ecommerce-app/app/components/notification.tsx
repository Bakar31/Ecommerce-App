import { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="notification">
      <div className="notification-content">{message}</div>
    </div>,
    document.body
  );
};

export default Notification;
