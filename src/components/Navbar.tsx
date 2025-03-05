import React from 'react';
import { Sun, Moon, Newspaper, TrendingUp, Zap } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  storyType: 'top' | 'new' | 'best';
  setStoryType: (type: 'top' | 'new' | 'best') => void;
  viewingComments: boolean;
  onLogoClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  darkMode, 
  toggleDarkMode, 
  storyType, 
  setStoryType, 
  viewingComments,
  onLogoClick
}) => {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 
                className="text-lg sm:text-xl font-bold text-neon-600 dark:text-neon-400 flex items-center cursor-pointer hover:text-neon-500 dark:hover:text-neon-300 transition-colors"
                onClick={onLogoClick}
              >
                <Newspaper className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                <span>HackerNews</span>
              </h1>
            </div>
            {!viewingComments && (
              <nav className="ml-4 sm:ml-6 flex space-x-2 sm:space-x-4">
                <button
                  onClick={() => setStoryType('top')}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                    storyType === 'top'
                      ? 'bg-neon-100 dark:bg-neon-900/30 text-neon-700 dark:text-neon-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>Top</span>
                  </div>
                </button>
                <button
                  onClick={() => setStoryType('new')}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                    storyType === 'new'
                      ? 'bg-neon-100 dark:bg-neon-900/30 text-neon-700 dark:text-neon-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Newspaper className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>New</span>
                  </div>
                </button>
                <button
                  onClick={() => setStoryType('best')}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
                    storyType === 'best'
                      ? 'bg-neon-100 dark:bg-neon-900/30 text-neon-700 dark:text-neon-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>Best</span>
                  </div>
                </button>
              </nav>
            )}
          </div>
          <div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;