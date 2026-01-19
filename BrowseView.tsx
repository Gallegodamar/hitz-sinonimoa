
import React, { useState, useMemo } from 'react';
import { SynonymItem } from '../types';

interface BrowseViewProps {
  data: SynonymItem[];
  onPractice: (word: SynonymItem) => void;
  onEdit: (word: SynonymItem) => void;
}

const BrowseView: React.FC<BrowseViewProps> = ({ data, onPractice, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return data.filter(item => 
      item.hitza.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sinonimoak.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Search Header fixed */}
      <div className="shrink-0 pb-4">
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text"
            placeholder="Hitz bat bilatu..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable list area */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-auto">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">{item.hitza}</h3>
                    <a 
                      href={`https://hiztegiak.elhuyar.eus/eu/${item.hitza}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-indigo-500 transition-colors"
                    >
                      <i className="fas fa-external-link-alt text-[10px]"></i>
                    </a>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => onEdit(item)}
                      className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onPractice(item)}
                      className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100"
                    >
                      Play
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.sinonimoak.map((sin, idx) => (
                    <span key={idx} className="bg-slate-50 text-slate-500 text-[10px] px-1.5 py-0.5 rounded border border-slate-100">
                      {sin}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <i className="fas fa-ghost text-5xl text-slate-200"></i>
              <p className="text-slate-400 font-medium text-sm">Ez dugu hitz hori aurkitu...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseView;
