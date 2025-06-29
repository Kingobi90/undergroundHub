import React from 'react';
import { PanicAlert } from '../../../types/liveFeed';
import PanicAlertCard from './PanicAlertCard';

interface Props {
  alerts: PanicAlert[];
}

const PanicAlertsList: React.FC<Props> = ({ alerts }) => {
  return (
    <div className="space-y-2">
      {alerts.map(alert => (
        <PanicAlertCard key={alert.id} alert={alert} />
      ))}
      {alerts.length > 2 && (
        <div className="text-center py-2">
          <button className="text-yellow-400 font-medium">VIEW ALL ALERTS</button>
        </div>
      )}
    </div>
  );
};

export default PanicAlertsList;
