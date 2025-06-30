"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Card from '../../Card';
import { useLiveFeed } from '@/contexts/LiveFeedContext';
import { FaThumbsUp, FaThumbsDown, FaComment, FaShare } from 'react-icons/fa';
import { Comment } from '@/types/liveFeed';

const FeedContent: React.FC = () => {
  const { 
    feedItems, 
    loadMoreFeedItems, 
    upvoteFeedItem, 
    downvoteFeedItem, 
    addCommentToFeedItem 
  } = useLiveFeed();
  
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  
  // This ensures we only render time-based content on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Handle voting
  const handleUpvote = (id: string) => {
    upvoteFeedItem(id);
  };

  const handleDownvote = (id: string) => {
    downvoteFeedItem(id);
  };

  // Toggle comments visibility
  const toggleComments = (id: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCommentChange = (id: string, text: string) => {
    setCommentText(prev => ({
      ...prev,
      [id]: text
    }));
  };

  // Track which comment we're replying to
  const [replyingTo, setReplyingTo] = useState<Record<string, string>>({});

  const submitComment = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (commentText[id]?.trim()) {
      // Generate a random 4-digit anonymous ID
      const anonymousId = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Get the parent ID (either a post ID or a comment ID)
      const parentId = replyingTo[id] || id;
      
      addCommentToFeedItem(id, commentText[id], anonymousId, parentId);
      
      // Clear input and reset replyingTo
      setCommentText(prev => ({
        ...prev,
        [id]: ''
      }));
      setReplyingTo(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const handleReplyClick = (postId: string, commentId: string) => {
    setReplyingTo(prev => ({
      ...prev,
      [postId]: commentId
    }));
    // Focus the comment input
    document.getElementById(`comment-input-${postId}`)?.focus();
  };

  const handleShare = (id: string) => {
    // In a real app, this would open a share dialog
    console.log(`Share post ${id}`);
  };

  // Infinite scroll implementation
  const loadMore = useCallback(async () => {
    if (!loading) {
      setLoading(true);
      try {
        await loadMoreFeedItems();
      } catch (error) {
        console.error('Error loading more feed items:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [loading, loadMoreFeedItems]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore]);

  return (
    <div className="space-y-4 mt-4">
      {feedItems.length > 0 ? (
        feedItems.map((item) => (
          <Card key={item.id} className="mb-4">
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-accent-30 flex items-center justify-center text-white font-bold">
                {item.anonymousId.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-white">Anonymous {item.anonymousId}</h4>
                <p className="text-xs text-text-secondary">
                  {isClient ? formatRelativeTime(item.timestamp) : 'Loading...'}
                </p>
              </div>
            </div>
            
            <p className="text-text-primary mb-4">{item.content}</p>
            
            {item.mediaUrl && item.mediaType === 'image' && (
              <div className="mb-4 rounded overflow-hidden">
                <img 
                  src={item.mediaUrl} 
                  alt="Post media" 
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}
            
            {item.mediaUrl && item.mediaType === 'video' && (
              <div className="mb-4 rounded overflow-hidden">
                <video 
                  src={item.mediaUrl} 
                  controls 
                  className="w-full h-auto"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            {item.mediaUrl && item.mediaType === 'audio' && (
              <div className="mb-4 rounded overflow-hidden bg-accent-30 p-3">
                <audio 
                  src={item.mediaUrl} 
                  controls 
                  className="w-full"
                />
              </div>
            )}
            
            <div className="flex justify-between text-text-secondary text-sm pt-3 border-t border-accent-30">
              <div className="flex gap-4">
                <button 
                  className="flex items-center gap-1 hover:text-accent"
                  onClick={() => handleUpvote(item.id)}
                >
                  <FaThumbsUp /> <span>{item.upvotes}</span>
                </button>
                <button 
                  className="flex items-center gap-1 hover:text-accent"
                  onClick={() => handleDownvote(item.id)}
                >
                  <FaThumbsDown /> <span>{item.downvotes}</span>
                </button>
                <button 
                  className="flex items-center gap-1 hover:text-accent"
                  onClick={() => toggleComments(item.id)}
                >
                  <FaComment /> <span>{item.comments.length}</span>
                </button>
              </div>
              <button 
                className="hover:text-accent"
                onClick={() => handleShare(item.id)}
              >
                <FaShare />
              </button>
            </div>
            
            {/* Comments section */}
            {expandedComments[item.id] && (
              <div className="mt-3 pt-2 border-t border-accent-30">
                <h5 className="text-sm font-medium text-white mb-2">Comments</h5>
                
                {item.comments.length === 0 ? (
                  <p className="text-text-secondary text-sm">No comments yet. Be the first!</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {/* Render top-level comments (those with parentId === postId) */}
                    {item.comments
                      .filter((comment: Comment) => comment.parentId === item.id)
                      .map((comment: Comment) => (
                        <div key={comment.id} className="flex items-start">
                          <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-accent-30 flex items-center justify-center text-white text-xs font-bold">
                            {comment.anonymousId.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="bg-accent-30 rounded-lg p-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-white">Anonymous {comment.anonymousId}</span>
                                <span className="text-xs text-text-secondary">
                                  {isClient ? formatRelativeTime(comment.timestamp) : 'Loading...'}
                                </span>
                              </div>
                              <p className="text-sm text-text-primary">{comment.content}</p>
                            </div>
                            
                            {/* Reply button */}
                            <button 
                              className="text-xs text-accent mt-1 hover:underline"
                              onClick={() => handleReplyClick(item.id, comment.id)}
                            >
                              Reply
                            </button>
                            
                            {/* Render replies to this comment */}
                            <div className="ml-4 mt-2 space-y-2">
                              {item.comments
                                .filter((reply: Comment) => reply.parentId === comment.id)
                                .map((reply: Comment) => (
                                  <div key={reply.id} className="flex items-start">
                                    <div className="w-5 h-5 rounded-full overflow-hidden mr-2 bg-accent-30 flex items-center justify-center text-white text-xs font-bold">
                                      {reply.anonymousId.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="bg-accent-30 rounded-lg p-2">
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs font-medium text-white">Anonymous {reply.anonymousId}</span>
                                          <span className="text-xs text-text-secondary">
                                            {isClient ? formatRelativeTime(reply.timestamp) : 'Loading...'}
                                          </span>
                                        </div>
                                        <p className="text-sm text-text-primary">{reply.content}</p>
                                      </div>
                                      <button 
                                        className="text-xs text-accent mt-1 hover:underline"
                                        onClick={() => handleReplyClick(item.id, reply.id)}
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                
                {/* Add comment form */}
                <div className="mt-3">
                  {replyingTo[item.id] && (
                    <div className="flex justify-between items-center mb-1 bg-accent-30 rounded p-1 text-xs">
                      <span className="text-text-secondary">
                        Replying to comment from Anonymous {item.comments.find(c => c.id === replyingTo[item.id])?.anonymousId || ''}
                      </span>
                      <button 
                        onClick={() => setReplyingTo(prev => ({ ...prev, [item.id]: '' }))}
                        className="text-accent hover:text-accent-hover"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <form className="flex" onSubmit={(e) => submitComment(item.id, e)}>
                    <input 
                      id={`comment-input-${item.id}`}
                      type="text" 
                      placeholder={replyingTo[item.id] ? "Write a reply..." : "Write a comment..."} 
                      className="flex-1 bg-accent-30 text-white rounded-l-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                      value={commentText[item.id] || ''}
                      onChange={(e) => handleCommentChange(item.id, e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="bg-accent text-white px-3 py-2 rounded-r-lg text-sm"
                    >
                      {replyingTo[item.id] ? "Reply" : "Post"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </Card>
        ))
      ) : (
        <Card className="mb-4">
          <div className="text-center py-8">
            <p className="text-text-secondary">No posts to show yet.</p>
            <p className="text-text-secondary text-sm mt-2">Be the first to create a post!</p>
          </div>
        </Card>
      )}
      
      {/* Loading indicator and infinite scroll trigger */}
      <div ref={observerTarget} className="py-4 text-center">
        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : (
          <span className="text-text-secondary text-sm">Loading more posts...</span>
        )}
      </div>
    </div>
  );
};

export default FeedContent;
