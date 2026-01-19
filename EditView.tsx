
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
    <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h2 className="text-xl font-bold">{initialData ? 'Editatu hitza' : 'Hitz berria gehitu'}</h2>
          <p className="text-indigo-100 text-xs mt-1">Zure hiztegi pertsonala osatu.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Hitza</label>
            <input 
              type="text" 
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Adibidez: Polita"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-bold"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Sinonimoak (Komaz bereizita)</label>
            <textarea 
              value={synonyms}
              onChange={(e) => setSynonyms(e.target.value)}
              placeholder="ederra, polita, liraina..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none font-medium"
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-600 shadow-sm">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800 block leading-tight">Klaseko hitza?</span>
                <span className="text-[10px] text-amber-700">Gaitu "Klasekoak" atalean agertzeko.</span>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsClass(!isClass)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isClass ? 'bg-amber-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isClass ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="flex space-x-3 pt-2">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Utzi
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 text-sm"
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
