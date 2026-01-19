
import React from 'react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40">
      <div className="max-w-4xl mx-auto px-4 h-12 md:h-14 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
            <i className="fas fa-book-open text-white text-[10px]"></i>
          </div>
          <span className="text-base font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tighter">
            Sinonimoak
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <button 
            onClick={() => setView('quiz')}
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all ${currentView === 'quiz' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Denak
          </button>
          <button 
            onClick={() => setView('class')}
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all ${currentView === 'class' ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Eskolakoak
          </button>
          <button 
            onClick={() => setView('browse')}
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all ${currentView === 'browse' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Bilatu
          </button>
          <button 
            onClick={() => setView('add')}
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all ${currentView === 'add' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Gehitu
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;