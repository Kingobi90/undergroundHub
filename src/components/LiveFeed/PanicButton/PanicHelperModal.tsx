import React, { useState } from 'react';
import { PanicAlert } from '../../../types/liveFeed';

interface Props {
  alert: PanicAlert;
  onClose: () => void;
  onSubmit: () => void;
}

const PanicHelperModal: React.FC<Props> = ({ alert, onClose, onSubmit }) => {
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState<'chat' | 'audio' | 'in-person'>('chat');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the message to the user
    onSubmit();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Help User #{alert.anonymousId}</h2>
        
        <div className="mb-4">
          <p className="text-gray-300 mb-2">Course: {alert.courseCode}</p>
          <p className="text-gray-300 mb-4">Location: {alert.location || 'Not specified'}</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">How would you like to help?</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setContactMethod('chat')}
                className={`px-3 py-2 rounded flex-1 ${contactMethod === 'chat' ? 'bg-yellow-400 text-black' : 'bg-gray-700'}`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setContactMethod('audio')}
                className={`px-3 py-2 rounded flex-1 ${contactMethod === 'audio' ? 'bg-yellow-400 text-black' : 'bg-gray-700'}`}
              >
                Audio Call
              </button>
              <button
                type="button"
                onClick={() => setContactMethod('in-person')}
                className={`px-3 py-2 rounded flex-1 ${contactMethod === 'in-person' ? 'bg-yellow-400 text-black' : 'bg-gray-700'}`}
              >
                Meet Up
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message (optional)
            </label>
            <textarea
              id="message"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
              placeholder="I can help with this topic..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 text-black font-medium rounded"
            >
              Send Help
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PanicHelperModal;
