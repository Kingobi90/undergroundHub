"use client";

import React, { useState, useRef } from 'react';
import Card from '../../Card';
import { FaVideo, FaCamera, FaNewspaper, FaMicrophone, FaTimes } from 'react-icons/fa';
import { useLiveFeed } from '@/contexts/LiveFeedContext';
import { FeedItemType } from '@/types/liveFeed';

interface PostCreatorProps {
  onPostCreated?: () => void;
}

const PostCreator: React.FC<PostCreatorProps> = ({ onPostCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [postType, setPostType] = useState<'text' | 'video' | 'photo' | 'campus-tea' | 'whisper'>('text');
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handlePostTypeSelect = (type: 'text' | 'video' | 'photo' | 'campus-tea' | 'whisper') => {
    setPostType(type);
    setShowModal(true);
  };
  
  const { addFeedItem } = useLiveFeed();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const clearSelectedFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setMediaFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postContent.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate a random 4-digit anonymous ID
      const anonymousId = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Determine media type based on postType
      let mediaType: 'image' | 'video' | 'audio' | undefined;
      let mediaUrl: string | undefined;
      
      if (mediaFile && previewUrl) {
        if (postType === 'video') mediaType = 'video';
        if (postType === 'photo') mediaType = 'image';
        if (postType === 'whisper') mediaType = 'audio';
        
        // In a real app, you would upload the file to a server and get a URL back
        // For now, we'll use the local preview URL
        mediaUrl = previewUrl;
      }
      
      // Map postType to FeedItemType
      let feedType: FeedItemType = 'news';
      if (postType === 'whisper') feedType = 'whisper';
      if (postType === 'campus-tea') feedType = 'campus-uncensored';
      
      // Create the post using context
      addFeedItem({
        content: postContent,
        anonymousId,
        type: feedType,
        category: postType === 'campus-tea' ? 'campus-news' : 'general',
        mediaType,
        mediaUrl
      });
      
      // Reset form and close modal
      setPostContent('');
      clearSelectedFile();
      setShowModal(false);
      
      // Notify parent component
      if (onPostCreated) onPostCreated();
      
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Card className="mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-accent-30 flex items-center justify-center text-white font-bold">
            UG
          </div>
          <button 
            onClick={() => handlePostTypeSelect('text')}
            className="flex-grow bg-primary-bg hover:bg-accent-30 text-text-secondary rounded-full py-2.5 px-4 text-left"
          >
            Start a post
          </button>
        </div>
        
        <div className="flex justify-between mt-3">
          <button 
            onClick={() => handlePostTypeSelect('video')}
            className="flex items-center gap-2 py-1 px-2 rounded hover:bg-accent-30"
          >
            <FaVideo className="text-green-500" />
            <span className="text-text-secondary text-sm">Video</span>
          </button>
          <button 
            onClick={() => handlePostTypeSelect('photo')}
            className="flex items-center gap-2 py-1 px-2 rounded hover:bg-accent-30"
          >
            <FaCamera className="text-blue-500" />
            <span className="text-text-secondary text-sm">Photo</span>
          </button>
          <button 
            onClick={() => handlePostTypeSelect('campus-tea')}
            className="flex items-center gap-2 py-1 px-2 rounded hover:bg-accent-30"
          >
            <FaNewspaper className="text-orange-500" />
            <span className="text-text-secondary text-sm">Campus Tea</span>
          </button>
          <button 
            onClick={() => handlePostTypeSelect('whisper')}
            className="flex items-center gap-2 py-1 px-2 rounded hover:bg-accent-30"
          >
            <FaMicrophone className="text-purple-500" />
            <span className="text-text-secondary text-sm">Whisper</span>
          </button>
        </div>
      </Card>
      
      {/* Post Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary-bg rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b border-accent-30">
              <h3 className="text-lg font-bold text-white">
                {postType === 'video' && 'Share a Video'}
                {postType === 'photo' && 'Share a Photo'}
                {postType === 'campus-tea' && 'Spill the Campus Tea'}
                {postType === 'whisper' && 'Record a Whisper'}
                {postType === 'text' && 'Create a Post'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-text-secondary hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-accent-30 flex items-center justify-center text-white font-bold">
                  UG
                </div>
                <div>
                  <h4 className="font-bold text-white">Campus User</h4>
                  <p className="text-xs text-text-secondary">
                    {postType === 'whisper' ? 'Anonymous' : 'Public'}
                  </p>
                </div>
              </div>
              
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={`What's on your mind?`}
                className="w-full bg-primary-bg text-text-primary p-3 rounded-md min-h-[120px] focus:outline-none focus:ring-1 focus:ring-accent"
                autoFocus
              />
              
              {/* Media upload section */}
              {(postType === 'video' || postType === 'photo') && (
                <div className="mt-4 p-4 border border-dashed border-accent-30 rounded-md text-center">
                  <p className="text-text-secondary">
                    {postType === 'video' ? 'Upload Video' : 'Upload Photo'}
                  </p>
                  
                  {previewUrl ? (
                    <div className="relative mt-2">
                      {postType === 'photo' ? (
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="max-h-48 mx-auto rounded"
                        />
                      ) : (
                        <video 
                          src={previewUrl} 
                          controls 
                          className="max-h-48 w-full rounded"
                        />
                      )}
                      
                      <button
                        type="button"
                        onClick={clearSelectedFile}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept={postType === 'video' ? 'video/*' : 'image/*'}
                        onChange={handleFileSelect}
                        className="hidden" 
                        id="media-upload"
                      />
                      <label 
                        htmlFor="media-upload"
                        className="mt-2 bg-accent-30 hover:bg-accent text-white py-2 px-4 rounded inline-block cursor-pointer"
                      >
                        Select File
                      </label>
                    </>
                  )}
                </div>
              )}
              
              {/* Whisper recording interface */}
              {postType === 'whisper' && (
                <div className="mt-4 p-4 border border-dashed border-accent-30 rounded-md text-center">
                  <p className="text-text-secondary">Record or Upload Audio Whisper</p>
                  
                  {previewUrl ? (
                    <div className="relative mt-2">
                      <audio 
                        src={previewUrl} 
                        controls 
                        className="w-full"
                      />
                      
                      <button
                        type="button"
                        onClick={clearSelectedFile}
                        className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Remove Audio
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 mt-2">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="audio/*"
                        onChange={handleFileSelect}
                        className="hidden" 
                        id="audio-upload"
                      />
                      <label 
                        htmlFor="audio-upload"
                        className="bg-accent-30 hover:bg-accent text-white py-2 px-4 rounded inline-block cursor-pointer"
                      >
                        Upload Audio
                      </label>
                      
                      <button 
                        type="button"
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                      >
                        Record Audio
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="bg-primary-bg text-text-secondary py-2 px-4 rounded mr-2 hover:bg-accent-30"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!postContent.trim() || isSubmitting}
                  className={`bg-accent text-white py-2 px-4 rounded ${
                    !postContent.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-dark'
                  }`}
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCreator;
