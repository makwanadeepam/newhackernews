import React, { useState, useEffect } from 'react';
import { Story, Comment } from '../types';
import { formatTimeAgo } from '../utils';
import { ExternalLink, ChevronUp, MessageSquare, Clock, User } from 'lucide-react';
import CommentItem from './CommentItem';

interface CommentSectionProps {
  story: Story;
}

const CommentSection: React.FC<CommentSectionProps> = ({ story }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchComments = async () => {
      if (!story.kids || story.kids.length === 0) {
        setComments([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const commentPromises = story.kids.slice(0, 30).map(async (id) => {
          const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          if (!response.ok) throw new Error(`Failed to fetch comment ${id}`);
          return response.json();
        });
        
        const fetchedComments = await Promise.all(commentPromises);
        setComments(fetchedComments.filter(comment => !comment.deleted && !comment.dead));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [story]);
  
  const domain = story.url ? new URL(story.url).hostname.replace(/^www\./, '') : null;
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(39,230,39,0.2)] dark:hover:shadow-[0_0_20px_rgba(39,230,39,0.25)]">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{story.title}</h1>
        
        {story.url && (
          <a 
            href={story.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-neon-600 dark:text-neon-400 hover:text-neon-800 dark:hover:text-neon-300 text-sm mb-4 transition-colors duration-200"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            {domain}
          </a>
        )}
        
        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
          <div className="flex items-center">
            <ChevronUp className="h-4 w-4 text-neon-500 mr-1" />
            <span>{story.score} points</span>
          </div>
          
          <span className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {story.by}
          </span>
          
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatTimeAgo(story.time)}
          </span>
          
          <span className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            {story.descendants || 0} comments
          </span>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Comments</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">No comments yet.</p>
        ) : (
          <div className="space-y-6">
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} level={0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;