import React from 'react';
import { ExternalLink, ChevronUp, MessageSquare, Clock, User } from 'lucide-react';
import { Story } from '../types';
import { formatTimeAgo, getDomainFromUrl } from '../utils';

interface NewsItemProps {
  story: Story;
  index: number;
  onCommentClick: (story: Story) => void;
}

const NewsItem: React.FC<NewsItemProps> = ({ story, index, onCommentClick }) => {
  if (!story) return null;
  
  const domain = story.url ? getDomainFromUrl(story.url) : null;
  
  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:border-neon-300 dark:hover:border-neon-700 transition-all duration-300 cursor-pointer hover:shadow-[0_0_15px_rgba(39,230,39,0.15)] dark:hover:shadow-[0_0_15px_rgba(39,230,39,0.2)]"
      onClick={() => onCommentClick(story)}
    >
      <div className="p-4 flex">
        <div className="flex-shrink-0 mr-4 flex flex-col items-center justify-start">
          <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">
            {index + 1}
          </span>
          <div className="mt-2 flex flex-col items-center">
            <ChevronUp className="h-5 w-5 text-neon-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {story.score}
            </span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col">
            <div className="flex items-start">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                <a 
                  href={story.url || `#`} 
                  target={story.url ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="hover:text-neon-600 dark:hover:text-neon-400 transition-colors duration-200"
                  onClick={(e) => {
                    if (story.url) {
                      e.stopPropagation();
                    } else {
                      e.preventDefault();
                      onCommentClick(story);
                    }
                  }}
                >
                  {story.title}
                </a>
              </h2>
            </div>
            
            {domain && (
              <div className="mt-1 flex items-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  {domain}
                </span>
              </div>
            )}
            
            <div className="mt-2 flex items-center text-sm text-slate-500 dark:text-slate-400 space-x-4">
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {story.by}
              </span>
              
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimeAgo(story.time)}
              </span>
              
              <span className="flex items-center text-neon-600 dark:text-neon-400">
                <MessageSquare className="h-3 w-3 mr-1" />
                {story.descendants || 0} comments
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;