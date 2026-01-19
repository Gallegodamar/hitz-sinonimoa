
import React, { useState, useEffect } from 'react';
import { SynonymItem } from '../types';

interface EditViewProps {
  initialData: SynonymItem | null;
  onSave: (word: string, synonyms: string[], isClass: boolean) => void;
  onCancel: () => void;
}

const EditView: React.FC<EditViewProps> = ({ initialData, onSave, onCancel }) => {
  const [word, setWord] = useState('');
  const [synonyms, setSynonyms] = useState('');
  const [isClass, setIsClass] = useState(false);

  useEffect(() => {
    if (initialData) {
      setWord(initialData.hitza);
      setSynonyms(initialData.sinonimoak.join(', '));
      setIsClass(!!initialData.isClass);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !synonyms.trim()) return;
    
    const synList = synonyms.split(',').map(s => s.trim()).filter(s => s !== "");
    onSave(word, synList, isClass);
  };

  return (
    <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 px-2">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-50 border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black">{initialData ? 'Editatu hitza' : 'Hitz berria gehitu'}</h2>
            <p className="text-indigo-100 text-sm mt-1 font-medium">Zure hiztegi pertsonala osatu.</p>
          </div>
          <i className="fas fa-plus absolute -bottom-4 -right-4 text-7xl text-white/10 rotate-12"></i>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Hitza</label>
            <input 
              type="text" 
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Adibidez: Polita"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-black text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Sinonimoak (Komaz bereizita)</label>
            <textarea 
              value={synonyms}
              onChange={(e) => setSynonyms(e.target.value)}
              placeholder="ederra, polita, liraina..."
              rows={3}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none font-bold text-lg"
              required
            ></textarea>
          </div>

          <button 
            type="button"
            onClick={() => setIsClass(!isClass)}
            className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${isClass ? 'bg-amber-50 border-amber-400 shadow-lg shadow-amber-50' : 'bg-slate-50 border-slate-50 opacity-60'}`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isClass ? 'bg-amber-500 text-white' : 'bg-white text-slate-400'}`}>
                <i className="fas fa-graduation-cap text-xl"></i>
              </div>
              <div className="text-left">
                <span className={`text-base font-black block leading-none ${isClass ? 'text-amber-900' : 'text-slate-600'}`}>Eskolako hitza</span>
                <span className={`text-[11px] font-bold ${isClass ? 'text-amber-600' : 'text-slate-400'}`}>Gaitu "Eskolakoak" atalean agertzeko</span>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${isClass ? 'bg-amber-400' : 'bg-slate-200'}`}>
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isClass ? 'left-7' : 'left-1'}`}></div>
            </div>
          </button>

          <div className="flex space-x-4 pt-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-4.5 bg-slate-50 text-slate-500 font-black rounded-2xl hover:bg-slate-100 transition-all text-sm uppercase tracking-widest"
            >
              Utzi
            </button>
            <button 
              type="submit"
              className="flex-1 py-4.5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all active:scale-95 text-sm uppercase tracking-widest"
            >
              Gorde
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditView;