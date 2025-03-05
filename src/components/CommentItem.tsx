import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import { formatTimeAgo } from '../utils';
import { User, Clock, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
  level: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, level }) => {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [showReplies, setShowReplies] = useState(level < 2);
  
  useEffect(() => {
    const fetchReplies = async () => {
      if (!comment.kids || comment.kids.length === 0) {
        return;
      }
      
      setLoading(true);
      
      try {
        const replyPromises = comment.kids.map(async (id) => {
          const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          if (!response.ok) throw new Error(`Failed to fetch reply ${id}`);
          return response.json();
        });
        
        const fetchedReplies = await Promise.all(replyPromises);
        setReplies(fetchedReplies.filter(reply => !reply.deleted && !reply.dead));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (showReplies && comment.kids && comment.kids.length > 0) {
      fetchReplies();
    }
  }, [comment, showReplies]);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };
  
  // Adjust indentation to be smaller and cap at a reasonable maximum
  const indentSize = Math.min(level * 12, 48);
  const indentStyle = {
    borderLeft: level > 0 ? '2px solid' : 'none',
    borderColor: level % 2 === 0 ? 'rgb(226, 232, 240)' : 'rgb(39, 230, 39, 0.3)',
    paddingLeft: level > 0 ? `${indentSize}px` : '0',
  };
  
  const indentClass = level > 0 ? (level % 2 === 0 ? 'dark:border-slate-700' : 'dark:border-neon-700/30') : '';
  const glowClass = level % 2 === 0 
    ? 'hover:shadow-[0_0_15px_rgba(39,230,39,0.15)] dark:hover:shadow-[0_0_15px_rgba(39,230,39,0.2)]' 
    : 'hover:shadow-[0_0_20px_rgba(39,230,39,0.25)] dark:hover:shadow-[0_0_20px_rgba(39,230,39,0.3)]';
  
  if (comment.deleted || comment.dead) {
    return null;
  }
  
  return (
    <div className={`${indentClass} transition-all duration-200`} style={indentStyle}>
      <div 
        className={`${level % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-neon-50/30 dark:bg-slate-800/80'} 
          rounded-lg p-3 sm:p-4 border ${level % 2 === 0 ? 'border-slate-100 dark:border-slate-700/50' : 'border-neon-100 dark:border-neon-900/20'} 
          transition-all duration-300 ${glowClass} overflow-hidden break-words w-auto`}
      >
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-[13px] sm:text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center font-medium text-slate-700 dark:text-slate-300 min-w-0">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{comment.by}</span>
            </span>
            
            <span className="flex items-center whitespace-nowrap">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              {formatTimeAgo(comment.time)}
            </span>
          </div>
          
          <button 
            onClick={toggleExpanded}
            className="text-slate-500 dark:text-slate-400 hover:text-neon-600 dark:hover:text-neon-400 transition-colors duration-200 p-1 flex-shrink-0 -mr-1"
          >
            {expanded ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
        
        {expanded && (
          <div 
            className="prose prose-sm sm:prose-base dark:prose-invert max-w-none break-words overflow-hidden"
            dangerouslySetInnerHTML={{ __html: comment.text || '' }}
          />
        )}
        
        {comment.kids && comment.kids.length > 0 && expanded && (
          <div className="mt-3 sm:mt-4">
            <button
              onClick={toggleReplies}
              className="text-[13px] sm:text-sm flex items-center text-neon-600 dark:text-neon-400 hover:text-neon-800 dark:hover:text-neon-300 transition-colors duration-200"
            >
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              {showReplies ? 'Hide' : 'Show'} {comment.kids.length} {comment.kids.length === 1 ? 'reply' : 'replies'}
            </button>
            
            {showReplies && (
              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 w-full">
                {loading ? (
                  <div className="flex justify-center items-center h-8">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-t-2 border-b-2 border-neon-500"></div>
                  </div>
                ) : (
                  replies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} level={level + 1} />
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;