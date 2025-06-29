"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown, FaComment, FaShare, FaFilter } from 'react-icons/fa';
import { FeedItem, FeedItemType, FeedFilter } from '@/types/liveFeed';
import { useLiveFeed } from '@/contexts/LiveFeedContext';
import AudioPlayer from '../Whispers/AudioPlayer';

interface UnifiedFeedProps {
  initialItems?: FeedItem[];
}

const UnifiedFeed: React.FC<UnifiedFeedProps> = ({ initialItems = [] }) => {
  const { feedItems, loadMoreFeedItems } = useLiveFeed();
  const [items, setItems] = useState<FeedItem[]>(initialItems.length > 0 ? initialItems : feedItems);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FeedFilter>({
    types: ['whisper', 'campus-uncensored', 'mascot-reveal', 'news', 'event'],
    showAfterHours: true
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  const observerTarget = useRef(null);
  
  // Filter items based on current filter settings
  const filteredItems = items.filter(item => 
    filter.types.includes(item.type) && 
    (filter.showAfterHours || !item.isAfterHours) &&
    (!filter.categories || !item.category || filter.categories.includes(item.category)) &&
    (!filter.tags || !item.tags || item.tags.some(tag => filter.tags?.includes(tag)))
  );

  // Handle infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, items]);

  // Load more items when scrolling
  const loadMore = async () => {
    setLoading(true);
    try {
      const newItems = await loadMoreFeedItems();
      setItems(prev => [...prev, ...newItems]);
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle filter types
  const toggleFilterType = (type: FeedItemType) => {
    setFilter(prev => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter(t => t !== type) };
      } else {
        return { ...prev, types: [...prev.types, type] };
      }
    });
  };

  // Toggle after hours content
  const toggleAfterHours = () => {
    setFilter(prev => ({ ...prev, showAfterHours: !prev.showAfterHours }));
  };

  // Handle upvote/downvote
  const handleVote = (id: string, voteType: 'up' | 'down') => {
    setItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            upvotes: voteType === 'up' ? item.upvotes + 1 : item.upvotes,
            downvotes: voteType === 'down' ? item.downvotes + 1 : item.downvotes
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="unified-feed">
      {/* Filter bar */}
      <div className="sticky top-16 z-10 bg-primary-bg p-3 border-b border-accent-30 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Campus Feed</h2>
        <button 
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          className="btn btn-sm btn-outline flex items-center gap-2"
        >
          <FaFilter /> Filter
        </button>
      </div>

      {/* Filter menu */}
      {showFilterMenu && (
        <div className="filter-menu bg-secondary-bg border border-accent-30 rounded-md p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3 text-white">Filter Feed</h3>
          
          <div className="mb-4">
            <p className="text-sm text-text-secondary mb-2">Content Types</p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => toggleFilterType('whisper')}
                className={`px-3 py-1 rounded-full text-sm ${filter.types.includes('whisper') ? 'bg-accent text-white' : 'bg-accent-30 text-text-primary'}`}
              >
                Voice Confessions
              </button>
              <button 
                onClick={() => toggleFilterType('campus-uncensored')}
                className={`px-3 py-1 rounded-full text-sm ${filter.types.includes('campus-uncensored') ? 'bg-accent text-white' : 'bg-accent-30 text-text-primary'}`}
              >
                Campus Uncensored
              </button>
              <button 
                onClick={() => toggleFilterType('mascot-reveal')}
                className={`px-3 py-1 rounded-full text-sm ${filter.types.includes('mascot-reveal') ? 'bg-accent text-white' : 'bg-accent-30 text-text-primary'}`}
              >
                Stingers Mascot
              </button>
              <button 
                onClick={() => toggleFilterType('news')}
                className={`px-3 py-1 rounded-full text-sm ${filter.types.includes('news') ? 'bg-accent text-white' : 'bg-accent-30 text-text-primary'}`}
              >
                News
              </button>
              <button 
                onClick={() => toggleFilterType('event')}
                className={`px-3 py-1 rounded-full text-sm ${filter.types.includes('event') ? 'bg-accent text-white' : 'bg-accent-30 text-text-primary'}`}
              >
                Events
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="afterHours" 
              checked={filter.showAfterHours}
              onChange={toggleAfterHours}
              className="mr-2"
            />
            <label htmlFor="afterHours" className="text-sm text-text-primary">Show After Hours Content</label>
          </div>
        </div>
      )}

      {/* Feed items */}
      <div className="feed-items space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            No posts match your current filters
          </div>
        ) : (
          filteredItems.map(item => (
            <FeedItemCard 
              key={item.id} 
              item={item} 
              onVote={handleVote} 
            />
          ))
        )}
        
        {/* Loading indicator and observer target */}
        <div ref={observerTarget} className="py-4 text-center">
          {loading && <div className="loader">Loading...</div>}
        </div>
      </div>
    </div>
  );
};

interface FeedItemCardProps {
  item: FeedItem;
  onVote: (id: string, voteType: 'up' | 'down') => void;
}

const FeedItemCard: React.FC<FeedItemCardProps> = ({ item, onVote }) => {
  const [showComments, setShowComments] = useState(false);
  
  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)}h ago`;
    } else {
      return `${Math.floor(minutes / 1440)}d ago`;
    }
  };

  // Get badge color based on content type
  const getBadgeColor = (type: FeedItemType) => {
    switch (type) {
      case 'whisper': return 'bg-purple-500';
      case 'campus-uncensored': return 'bg-red-500';
      case 'mascot-reveal': return 'bg-yellow-500';
      case 'news': return 'bg-blue-500';
      case 'event': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Get display name for content type
  const getTypeName = (type: FeedItemType) => {
    switch (type) {
      case 'whisper': return 'Voice Confession';
      case 'campus-uncensored': return 'Campus Uncensored';
      case 'mascot-reveal': return 'Stingers Mascot';
      case 'news': return 'Campus News';
      case 'event': return 'Event';
      default: return type;
    }
  };

  return (
    <div className="feed-item bg-secondary-bg border border-accent-30 rounded-lg overflow-hidden">
      {/* Card header */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-accent-30 flex items-center justify-center text-white font-bold">
              {item.anonymousId.substring(0, 2)}
            </div>
            <div className="ml-3">
              <div className="text-white font-medium">Anonymous #{item.anonymousId}</div>
              <div className="text-text-secondary text-sm">{formatTime(item.timestamp)}</div>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full text-white ${getBadgeColor(item.type)}`}>
            {getTypeName(item.type)}
          </span>
        </div>
        
        {/* Content */}
        <div className="mt-3 text-text-primary">
          <p>{item.content}</p>
        </div>
        
        {/* Media */}
        {item.mediaUrl && (
          <div className="mt-3">
            {item.mediaType === 'image' && (
              <img 
                src={item.mediaUrl} 
                alt="Post media" 
                className="w-full h-auto rounded-md max-h-96 object-cover"
              />
            )}
            {item.mediaType === 'video' && (
              <video 
                src={item.mediaUrl} 
                controls 
                className="w-full h-auto rounded-md max-h-96"
              />
            )}
            {item.mediaType === 'audio' && (
              <AudioPlayer audioUrl={item.mediaUrl} />
            )}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="mt-4 flex justify-between">
          <div className="flex space-x-4">
            <button 
              onClick={() => onVote(item.id, 'up')}
              className="flex items-center space-x-1 text-text-secondary hover:text-accent"
            >
              <FaThumbsUp /> <span>{item.upvotes}</span>
            </button>
            <button 
              onClick={() => onVote(item.id, 'down')}
              className="flex items-center space-x-1 text-text-secondary hover:text-accent"
            >
              <FaThumbsDown /> <span>{item.downvotes}</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-text-secondary hover:text-accent"
            >
              <FaComment /> <span>{item.comments.length}</span>
            </button>
          </div>
          <button className="text-text-secondary hover:text-accent">
            <FaShare />
          </button>
        </div>
      </div>
      
      {/* Comments section */}
      {showComments && (
        <div className="comments-section border-t border-accent-30 p-4">
          <h4 className="text-sm font-medium text-white mb-3">Comments</h4>
          
          {item.comments.length === 0 ? (
            <p className="text-text-secondary text-sm">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-3">
              {item.comments.map(comment => (
                <div key={comment.id} className="comment bg-primary-bg p-3 rounded-md">
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 rounded-full bg-accent-30 flex items-center justify-center text-white text-xs font-bold">
                      {comment.anonymousId.substring(0, 2)}
                    </div>
                    <div className="ml-2">
                      <span className="text-white text-sm">Anonymous #{comment.anonymousId}</span>
                      <span className="text-text-secondary text-xs ml-2">{formatTime(comment.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-text-primary text-sm mt-1">{comment.content}</p>
                  <div className="mt-2">
                    <button className="text-text-secondary hover:text-accent text-xs flex items-center">
                      <FaThumbsUp className="mr-1" /> <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Add comment form */}
          <div className="mt-4">
            <form className="flex">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="flex-1 bg-primary-bg border border-accent-30 rounded-l-md p-2 text-text-primary text-sm focus:outline-none focus:border-accent"
              />
              <button 
                type="submit"
                className="bg-accent text-white px-3 rounded-r-md"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedFeed;
