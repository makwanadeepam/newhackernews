import React, { useState, useEffect } from 'react';
import { Sun, Moon, ArrowLeft, ChevronRight } from 'lucide-react';
import NewsItem from './components/NewsItem';
import Navbar from './components/Navbar';
import CommentSection from './components/CommentSection';
import { Story } from './types';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storyType, setStoryType] = useState<'top' | 'new' | 'best'>('top');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [viewingComments, setViewingComments] = useState(false);
  const [page, setPage] = useState(0);
  const [allStoryIds, setAllStoryIds] = useState<number[]>([]);
  const storiesPerPage = 20;

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchStoryIds = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/${storyType}stories.json`);
        if (!response.ok) throw new Error('Failed to fetch stories');
        
        const ids = await response.json();
        setAllStoryIds(ids);
        setPage(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      }
    };

    fetchStoryIds();
  }, [storyType]);

  useEffect(() => {
    const fetchPageStories = async () => {
      if (allStoryIds.length === 0) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const startIdx = page * storiesPerPage;
        const endIdx = startIdx + storiesPerPage;
        const pageStoryIds = allStoryIds.slice(startIdx, endIdx);
        
        const storyPromises = pageStoryIds.map(async (id: number) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          if (!storyResponse.ok) throw new Error(`Failed to fetch story ${id}`);
          return storyResponse.json();
        });
        
        const fetchedStories = await Promise.all(storyPromises);
        setStories(fetchedStories.filter(story => story !== null));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageStories();
  }, [allStoryIds, page]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCommentClick = (story: Story) => {
    setSelectedStory(story);
    setViewingComments(true);
    window.scrollTo(0, 0);
  };

  const handleBackToStories = () => {
    setViewingComments(false);
    setSelectedStory(null);
  };

  const handleNextPage = () => {
    const maxPages = Math.ceil(allStoryIds.length / storiesPerPage);
    if (page < maxPages - 1) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleLogoClick = () => {
    setStoryType('top');
    setPage(0);
    setViewingComments(false);
    setSelectedStory(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        storyType={storyType}
        setStoryType={setStoryType}
        viewingComments={viewingComments}
        onLogoClick={handleLogoClick}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {viewingComments && selectedStory ? (
          <div>
            <button 
              onClick={handleBackToStories}
              className="mb-4 flex items-center text-neon-600 dark:text-neon-400 hover:text-neon-800 dark:hover:text-neon-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back to stories</span>
            </button>
            <CommentSection story={selectedStory} />
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {stories.map((story, index) => (
                <NewsItem 
                  key={story.id} 
                  story={story} 
                  index={page * storiesPerPage + index} 
                  onCommentClick={handleCommentClick}
                />
              ))}
            </div>
            
            <div className="mt-8 flex justify-between items-center">
              <button 
                onClick={handlePrevPage}
                disabled={page === 0}
                className={`px-4 py-2 rounded-md flex items-center ${
                  page === 0 
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                    : 'bg-neon-100 dark:bg-neon-900/30 text-neon-700 dark:text-neon-300 hover:bg-neon-200 dark:hover:bg-neon-800/50'
                }`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
              
              <span className="text-slate-600 dark:text-slate-400">
                Page {page + 1}
              </span>
              
              <button 
                onClick={handleNextPage}
                disabled={(page + 1) * storiesPerPage >= allStoryIds.length}
                className={`px-4 py-2 rounded-md flex items-center ${
                  (page + 1) * storiesPerPage >= allStoryIds.length
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                    : 'bg-neon-100 dark:bg-neon-900/30 text-neon-700 dark:text-neon-300 hover:bg-neon-200 dark:hover:bg-neon-800/50'
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </>
        )}
      </main>
      
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4 mt-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
            Modern HackerNews UI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;