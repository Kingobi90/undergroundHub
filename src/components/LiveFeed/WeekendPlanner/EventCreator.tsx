import React, { useState } from 'react';
import { useLiveFeed } from '../../../contexts/LiveFeedContext';
import Card from '../../Card';
import { FaImage, FaTimes } from 'react-icons/fa';

interface Props {
  onClose: () => void;
}

const EventCreator: React.FC<Props> = ({ onClose }) => {
  const { createEvent } = useLiveFeed();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState<'party' | 'academic' | 'sports' | 'culture' | 'other'>('party');
  const [isOfficial, setIsOfficial] = useState(false);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine date and time
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    await createEvent({
      title,
      description,
      location,
      startDate: startDateTime,
      endDate: endDateTime,
      category,
      isOfficial,
      bannerImageUrl: bannerImage || undefined, // Convert null to undefined to match the expected type
      organizer: isOfficial ? 'Concordia University' : 'Student Event'
    });
    
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real implementation, this would upload to a server
    // For now, just create a local URL
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBannerImage(result);
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Event</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Event Title*
            </label>
            <input
              id="title"
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location*
            </label>
            <input
              id="location"
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                Start Date*
              </label>
              <input
                id="startDate"
                type="date"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium mb-1">
                Start Time*
              </label>
              <input
                id="startTime"
                type="time"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                End Date*
              </label>
              <input
                id="endDate"
                type="date"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium mb-1">
                End Time*
              </label>
              <input
                id="endTime"
                type="time"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {(['party', 'academic', 'sports', 'culture', 'other'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded ${
                    category === cat 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={isOfficial}
                onChange={(e) => setIsOfficial(e.target.checked)}
              />
              <span>This is an official campus event</span>
            </label>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Event Banner
            </label>
            
            {previewImage ? (
              <div className="relative mb-2">
                <img 
                  src={previewImage} 
                  alt="Event banner preview" 
                  className="w-full h-40 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setBannerImage(null);
                    setPreviewImage(null);
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="bannerImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label 
                  htmlFor="bannerImage"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <FaImage className="text-3xl mb-2 text-gray-500" />
                  <span className="text-gray-400">Click to upload banner image</span>
                </label>
              </div>
            )}
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
              Create Event
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EventCreator;
