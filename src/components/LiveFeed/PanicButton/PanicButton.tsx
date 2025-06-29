import React, { useState } from 'react';
import { useLiveFeed } from '../../../contexts/LiveFeedContext';
import Card from '../../Card';
import { FaExclamationTriangle } from 'react-icons/fa';

const PanicButton: React.FC = () => {
  const { createPanicAlert } = useLiveFeed();
  const [showForm, setShowForm] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create a random anonymous ID for the panic alert
      const anonymousId = Math.floor(1000 + Math.random() * 9000).toString();
      
      await createPanicAlert({
        courseCode,
        location,
        anonymousId,
        userId: 'current-user' // This would come from auth context in a real app
      });
      
      // Reset form and show success message
      setCourseCode('');
      setLocation('');
      setDescription(''); // We still clear this field even though we don't send it
      setSubmitted(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
      }, 5000);
    } catch (error) {
      console.error('Error creating panic alert:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-red-500 border-2">
      {!showForm ? (
        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center mx-auto"
          >
            <FaExclamationTriangle className="mr-2" />
            HIT THE PANIC BUTTON
          </button>
          <p className="mt-2 text-sm text-gray-400">
            Need urgent academic help? Hit the panic button and connect with fellow students.
          </p>
        </div>
      ) : submitted ? (
        <div className="text-center py-4">
          <div className="text-green-400 font-bold mb-2">
            Panic alert sent successfully!
          </div>
          <p className="text-sm text-gray-300">
            Your anonymous alert has been sent. Other students will be able to help you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg mb-4">Send a Panic Alert</h3>
          
          <div className="mb-3">
            <label htmlFor="courseCode" className="block text-sm font-medium mb-1">
              Course Code*
            </label>
            <input
              id="courseCode"
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
              placeholder="e.g. CS101"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location (optional)
            </label>
            <input
              id="location"
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
              placeholder="e.g. Main Library, 2nd Floor"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              What do you need help with? (optional)
            </label>
            <textarea
              id="description"
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
              placeholder="Briefly describe what you're struggling with..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !courseCode}
              className={`px-4 py-2 rounded font-medium ${
                isSubmitting || !courseCode
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Panic Alert'}
            </button>
          </div>
        </form>
      )}
    </Card>
  );
};

export default PanicButton;
