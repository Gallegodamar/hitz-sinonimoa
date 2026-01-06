
import React from 'react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="shrink-0 bg-white border-b border-slate-200 z-40">
      <div className="max-w-4xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('quiz')}>
          <div className="w-7 h-7 md:w-8 md:h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-100 shadow-lg">
            <i className="fas fa-book-open text-white text-[12px] md:text-sm"></i>
          </div>
          <span className="text-lg md:text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
            Sinonimoak
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <button 
            onClick={() => setView('quiz')}
            className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${currentView === 'quiz' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Jolastu
          </button>
          <button 
            onClick={() => setView('browse')}
            className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${currentView === 'browse' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Zerrenda
          </button>
          <button 
            onClick={() => setView('add')}
            className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${currentView === 'add' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <i className="fas fa-plus-circle mr-1"></i> Gehitu
          </button>
          <button 
            onClick={() => setView('stats')}
            className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${currentView === 'stats' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Estatistikoak
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
