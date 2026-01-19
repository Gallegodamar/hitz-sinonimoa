
import React, { useState } from 'react';
import { ViewMode, ClassSubMode } from '../types';

interface HomeViewProps {
  onSelectMode: (mode: ViewMode) => void;
  onSelectClassMode: (subMode: ClassSubMode) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onSelectMode, onSelectClassMode }) => {
  const [showClassOptions, setShowClassOptions] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-200 mb-6 rotate-3">
          <i className="fas fa-book-open text-white text-3xl"></i>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-2">
          Sinonimoak <br/><span className="text-indigo-600">Ikasi</span>
        </h1>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {!showClassOptions ? (
          <>
            <button 
              onClick={() => onSelectMode('quiz')}
              className="group w-full p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100 transition-all flex items-center space-x-5 text-left"
            >
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <i className="fas fa-gamepad text-2xl"></i>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900">Denak</div>
                <div className="text-xs font-bold text-slate-400">Hiztegi osoa lantzeko</div>
              </div>
            </button>

            <button 
              onClick={() => setShowClassOptions(true)}
              className="group w-full p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm hover:border-amber-500 hover:shadow-xl hover:shadow-amber-100 transition-all flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <i className="fas fa-graduation-cap text-2xl"></i>
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">Eskolakoak</div>
                  <div className="text-xs font-bold text-slate-400">Zerrenda bereziak</div>
                </div>
              </div>
              <i className="fas fa-chevron-right text-slate-300"></i>
            </button>
          </>
        ) : (
          <div className="space-y-3 animate-in zoom-in-95 fade-in duration-300">
            <div className="flex items-center justify-between mb-4 px-2">
              <button onClick={() => setShowClassOptions(false)} className="text-slate-400 hover:text-slate-600 flex items-center space-x-2 font-bold text-sm">
                <i className="fas fa-arrow-left"></i>
                <span>Atzera</span>
              </button>
              <span className="font-black text-amber-600 uppercase text-xs tracking-widest">Aukeratu zerrenda</span>
            </div>

            <button 
              onClick={() => onSelectClassMode('first')}
              className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-amber-500 transition-all text-left flex items-center space-x-4"
            >
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-black">1</div>
              <div className="text-lg font-black text-slate-800">Lehengo zerrenda</div>
            </button>

            <button 
              onClick={() => onSelectClassMode('second')}
              className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-amber-500 transition-all text-left flex items-center space-x-4"
            >
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-black">2</div>
              <div className="text-lg font-black text-slate-800">Bigarren zerrenda</div>
            </button>

            <button 
              onClick={() => onSelectClassMode('all')}
              className="w-full p-5 bg-amber-600 text-white border-2 border-amber-600 rounded-2xl shadow-xl shadow-amber-100 hover:bg-amber-700 transition-all text-left flex items-center space-x-4"
            >
              <div className="w-10 h-10 bg-white/20 text-white rounded-xl flex items-center justify-center font-black">
                <i className="fas fa-list-ul"></i>
              </div>
              <div className="text-lg font-black">Zerrenda osoa</div>
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 flex space-x-6">
        <button onClick={() => onSelectMode('browse')} className="text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors uppercase tracking-widest">
          <i className="fas fa-list mr-2"></i> Zerrenda
        </button>
        <button onClick={() => onSelectMode('add')} className="text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors uppercase tracking-widest">
          <i className="fas fa-plus mr-2"></i> Gehitu
        </button>
      </div>
    </div>
  );
};

export default HomeView;
