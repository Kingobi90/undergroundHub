"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaThumbsUp, FaThumbsDown, FaComment, FaShare, FaEllipsisH, FaFilter, FaCalendarAlt, FaSyncAlt } from 'react-icons/fa';
import Card from './Card';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

export interface ThreadPost {
  id: string;
  type: 'Secret' | 'Spotted' | 'Campus Tea' | 'Rant';
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  comments: ThreadComment[];
  author?: string;
}

export interface ThreadComment {
  id: string;
  content: string;
  timestamp: string;
  upvotes: number;
  author?: string;
}

interface ThreadSectionProps {
  threads: ThreadPost[];
}

const ThreadSection: React.FC<ThreadSectionProps> = ({ threads }) => {
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'Secret' | 'Spotted' | 'Campus Tea' | 'Rant'>('Secret');
  
  // Infinite scroll and filtering states
  const [allThreads, setAllThreads] = useState<ThreadPost[]>(threads);
  const [displayedThreads, setDisplayedThreads] = useState<ThreadPost[]>(threads.slice(0, 5));
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpToDate, setIsUpToDate] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    types: ('Secret' | 'Spotted' | 'Campus Tea' | 'Rant')[];
    timeRange: 'all' | 'today' | 'week' | 'month';
  }>({ types: ['Secret', 'Spotted', 'Campus Tea', 'Rant'], timeRange: 'all' });
  
  const [newComment, setNewComment] = useState('');
  
  // Refs for infinite scroll
  const observerRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver({
    target: observerRef,
    rootMargin: '100px',
  });
  
  // Toggle modals
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  // Load more posts when scrolling
  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      loadMorePosts();
    }
  }, [isIntersecting]);

  const loadMorePosts = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API fetch delay
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = displayedThreads.length;
      const endIndex = startIndex + 5;
      
      // Filter threads based on active filters
      const filteredThreads = filterThreads(allThreads);
      
      // Check if there are more posts to load
      if (startIndex >= filteredThreads.length) {
        setHasMore(false);
        setIsUpToDate(true);
      } else {
        const newThreads = filteredThreads.slice(0, endIndex);
        setDisplayedThreads(newThreads);
        setPage(nextPage);
      }
      
      setIsLoading(false);
    }, 500);
  }, [page, allThreads, displayedThreads.length, activeFilters]);

  // Filter threads based on active filters
  const filterThreads = useCallback((threads: ThreadPost[]) => {
    return threads.filter(thread => {
      // Filter by type
      if (!activeFilters.types.includes(thread.type)) {
        return false;
      }
      
      // Filter by time range
      if (activeFilters.timeRange !== 'all') {
        const now = new Date();
        const threadDate = getDateFromTimestamp(thread.timestamp);
        
        if (activeFilters.timeRange === 'today') {
          return isToday(threadDate);
        } else if (activeFilters.timeRange === 'week') {
          return isThisWeek(threadDate);
        } else if (activeFilters.timeRange === 'month') {
          return isThisMonth(threadDate);
        }
      }
      
      return true;
    });
  }, [activeFilters]);

  // Helper functions for date filtering
  const getDateFromTimestamp = (timestamp: string): Date => {
    // This is a simplified implementation
    // In a real app, you'd parse the actual timestamp format
    const now = new Date();
    
    if (timestamp.includes('Just now')) {
      return now;
    } else if (timestamp.includes('hours')) {
      const hours = parseInt(timestamp.split(' ')[0]);
      return new Date(now.getTime() - hours * 60 * 60 * 1000);
    } else if (timestamp.includes('day')) {
      const days = parseInt(timestamp.split(' ')[0]);
      return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }
    
    return now;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isThisWeek = (date: Date): boolean => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    return date >= weekStart;
  };

  const isThisMonth = (date: Date): boolean => {
    const today = new Date();
    return date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Apply filters and refresh the feed
  const applyFilters = (types: ('Secret' | 'Spotted' | 'Campus Tea' | 'Rant')[], timeRange: 'all' | 'today' | 'week' | 'month') => {
    setActiveFilters({ types, timeRange });
    setPage(1);
    setHasMore(true);
    setIsUpToDate(false);
    
    const filteredThreads = filterThreads(allThreads);
    setDisplayedThreads(filteredThreads.slice(0, 5));
    toggleFilterModal();
  };

  // Refresh the feed
  const refreshFeed = () => {
    setIsRefreshing(true);
    
    // Simulate API refresh
    setTimeout(() => {
      setPage(1);
      setHasMore(true);
      setIsUpToDate(false);
      
      // In a real app, you'd fetch new data from the API
      // For now, we'll just reset to the initial threads
      const filteredThreads = filterThreads(allThreads);
      setDisplayedThreads(filteredThreads.slice(0, 5));
      
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPost.trim()) return;
    
    const newThread: ThreadPost = {
      id: `thread-${Date.now()}`,
      type: postType,
      content: newPost,
      timestamp: 'Just now',
      upvotes: 0,
      downvotes: 0,
      comments: [],
    };
    
    setAllThreads([newThread, ...allThreads]);
    setDisplayedThreads([newThread, ...displayedThreads]);
    setNewPost('');
    toggleModal();
  };
  
  const handleVote = (threadId: string, isUpvote: boolean) => {
    const updateThreads = (threads: ThreadPost[]): ThreadPost[] => {
      return threads.map(thread => {
        if (thread.id === threadId) {
          if (isUpvote) {
            return { ...thread, upvotes: thread.upvotes + 1 };
          } else {
            return { ...thread, downvotes: thread.downvotes + 1 };
          }
        }
        return thread;
      });
    };
    
    setAllThreads(updateThreads(allThreads));
    setDisplayedThreads(updateThreads(displayedThreads));
  };
  
  const toggleComments = (threadId: string) => {
    setExpandedThread(expandedThread === threadId ? null : threadId);
  };
  
  const handleAddComment = (threadId: string) => {
    if (!newComment.trim()) return;
    
    const newCommentObj: ThreadComment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      timestamp: 'Just now',
      upvotes: 0,
    };
    
    const updateThreads = (threads: ThreadPost[]): ThreadPost[] => {
      return threads.map(thread => {
        if (thread.id === threadId) {
          return { 
            ...thread, 
            comments: [...thread.comments, newCommentObj] 
          };
        }
        return thread;
      });
    };
    
    setAllThreads(updateThreads(allThreads));
    setDisplayedThreads(updateThreads(displayedThreads));
    setNewComment('');
  };

  return (
    <Card className="overflow-hidden relative">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-accent">
            Campus Uncensored
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={refreshFeed}
              className={`p-2 rounded-full hover:bg-accent hover:bg-opacity-20 ${isRefreshing ? 'animate-spin' : ''}`}
              disabled={isRefreshing}
              aria-label="Refresh feed"
            >
              <FaSyncAlt className="text-accent" />
            </button>
            <button 
              onClick={toggleFilterModal}
              className="p-2 rounded-full hover:bg-accent hover:bg-opacity-20"
              aria-label="Filter posts"
            >
              <FaFilter className="text-accent" />
            </button>
          </div>
        </div>
        
        {/* Filter chips */}
        {(activeFilters.types.length < 4 || activeFilters.timeRange !== 'all') && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.types.length < 4 && (
              <div className="text-xs bg-accent bg-opacity-20 text-accent py-1 px-3 rounded-full">
                Filtered by: {activeFilters.types.join(', ')}
              </div>
            )}
            {activeFilters.timeRange !== 'all' && (
              <div className="text-xs bg-accent bg-opacity-20 text-accent py-1 px-3 rounded-full flex items-center gap-1">
                <FaCalendarAlt size={10} />
                {activeFilters.timeRange.charAt(0).toUpperCase() + activeFilters.timeRange.slice(1)}
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 mb-16">
          {displayedThreads.map(thread => (
            <div key={thread.id} className="border border-gray-800 rounded-lg p-3 bg-primary-bg">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-accent font-medium px-2 py-1 bg-accent bg-opacity-20 rounded-full">
                  {thread.type}
                </span>
                <span className="text-xs text-text-secondary">{thread.timestamp}</span>
              </div>
              
              <p className="text-text-primary mb-3 text-sm md:text-base">{thread.content}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleVote(thread.id, true)}
                    className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent"
                  >
                    <FaThumbsUp /> <span>{thread.upvotes}</span>
                  </button>
                  <button 
                    onClick={() => handleVote(thread.id, false)}
                    className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent"
                  >
                    <FaThumbsDown /> <span>{thread.downvotes}</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(thread.id)}
                    className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent"
                  >
                    <FaComment /> <span>{thread.comments.length}</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="text-xs text-text-secondary hover:text-accent">
                    <FaShare />
                  </button>
                  <button className="text-xs text-text-secondary hover:text-accent">
                    <FaEllipsisH />
                  </button>
                </div>
              </div>
              
              {/* Comments section */}
              {expandedThread === thread.id && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  {thread.comments.map(comment => (
                    <div key={comment.id} className="py-2 border-b border-gray-800 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-medium text-accent">Anonymous</span>
                        <span className="text-xs text-text-secondary">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-text-primary my-1">{comment.content}</p>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent">
                          <FaThumbsUp /> <span>{comment.upvotes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add comment form */}
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 bg-primary-bg border border-gray-800 rounded px-3 py-1 text-sm focus:outline-none focus:border-accent"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button 
                      onClick={() => handleAddComment(thread.id)}
                      className="btn btn-primary text-xs py-1 px-3"
                      disabled={!newComment.trim()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Observer element for infinite scroll */}
          <div ref={observerRef} className="h-4"></div>
          
          {/* You're up to date message */}
          {isUpToDate && !isLoading && (
            <div className="text-center py-6 border-t border-gray-800 mt-4">
              <p className="text-text-secondary text-sm">You're all caught up! 🎉</p>
              <p className="text-text-secondary text-xs mt-1">Check back later for new posts</p>
            </div>
          )}
        </div>
      </div>
      
      {/* CTA Button at bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <button 
          onClick={toggleModal}
          className="btn btn-primary text-sm px-8 py-2"
        >
          sup
        </button>
      </div>
      
      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary-bg border border-accent rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-accent mb-4">Filter Posts</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Post Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Secret', 'Spotted', 'Campus Tea', 'Rant'] as const).map(type => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={activeFilters.types.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...activeFilters.types, type]
                          : activeFilters.types.filter(t => t !== type);
                        setActiveFilters({...activeFilters, types: newTypes});
                      }}
                      className="form-checkbox text-accent"
                    />
                    <span className="text-text-primary text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Time Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['all', 'today', 'week', 'month'] as const).map(range => (
                  <label key={range} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio"
                      checked={activeFilters.timeRange === range}
                      onChange={() => setActiveFilters({...activeFilters, timeRange: range})}
                      className="form-radio text-accent"
                    />
                    <span className="text-text-primary text-sm capitalize">{range}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={toggleFilterModal}
                className="px-4 py-2 text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
              <button 
                onClick={() => applyFilters(activeFilters.types, activeFilters.timeRange)}
                className="btn btn-primary"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary-bg border border-accent rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-accent mb-4">Share with Campus Uncensored</h3>
            
            <form onSubmit={handleSubmitPost}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Type
                </label>
                <select 
                  className="w-full bg-primary-bg border border-gray-800 rounded px-3 py-2 focus:outline-none focus:border-accent"
                  value={postType}
                  onChange={(e) => setPostType(e.target.value as any)}
                >
                  <option value="Secret">Secret</option>
                  <option value="Spotted">Spotted</option>
                  <option value="Campus Tea">Campus Tea</option>
                  <option value="Rant">Rant</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Your Post
                </label>
                <textarea 
                  className="w-full bg-primary-bg border border-gray-800 rounded px-3 py-2 h-32 focus:outline-none focus:border-accent"
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={!newPost.trim()}
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ThreadSection;
