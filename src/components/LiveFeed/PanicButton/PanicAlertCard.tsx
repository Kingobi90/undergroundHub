import React from 'react';
import { PanicAlert } from '../../../types/liveFeed';
import Card from '../../Card';
import { useLiveFeed } from '../../../contexts/LiveFeedContext';

interface Props {
  alert: PanicAlert;
}

const PanicAlertCard: React.FC<Props> = ({ alert }) => {
  const { helpWithPanic } = useLiveFeed();
  
  const timeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
  };

  const handleHelp = () => {
    helpWithPanic(alert.id);
  };

  return (
    <Card className="border-red-500 border-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">
            User #{alert.anonymousId} hit the panic button for {alert.courseCode} ({timeAgo(alert.timestamp)})
          </p>
          <div className="mt-2 flex gap-2">
            <button 
              onClick={handleHelp}
              className="bg-yellow-400 text-black px-3 py-1 rounded font-medium"
            >
              HELP THEM
            </button>
            <span className="text-gray-400 self-center">
              {alert.helpersCount} {alert.helpersCount === 1 ? 'person' : 'people'} helping
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PanicAlertCard;
