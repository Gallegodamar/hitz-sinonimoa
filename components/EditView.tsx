
import React, { useState, useEffect } from 'react';
import { SynonymItem } from '../types';

interface EditViewProps {
  initialData: SynonymItem | null;
  onSave: (word: string, synonyms: string[]) => void;
  onCancel: () => void;
}

const EditView: React.FC<EditViewProps> = ({ initialData, onSave, onCancel }) => {
  const [word, setWord] = useState('');
  const [synonyms, setSynonyms] = useState('');

  useEffect(() => {
    if (initialData) {
      setWord(initialData.hitza);
      setSynonyms(initialData.sinonimoak.join(', '));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !synonyms.trim()) return;
    
    const synList = synonyms.split(',').map(s => s.trim()).filter(s => s !== "");
    onSave(word, synList);
  };

  return (
    <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
          <h2 className="text-2xl font-bold">{initialData ? 'Editatu hitza' : 'Hitz berria gehitu'}</h2>
          <p className="text-indigo-100 text-sm mt-1">Zure hiztegi pertsonala osatu eta praktikatu.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">Hitza (Palabra)</label>
            <input 
              type="text" 
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Adibidez: Polita"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">Sinonimoak (Comas por comas)</label>
            <textarea 
              value={synonyms}
              onChange={(e) => setSynonyms(e.target.value)}
              placeholder="ederra, polita, liraina..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none"
              required
            ></textarea>
            <p className="text-xs text-slate-400 italic">Bereizi hitzak komaz (,).</p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Utzi
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              Gorde
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3">
        <i className="fas fa-info-circle text-amber-500 mt-1"></i>
        <p className="text-sm text-amber-800">
          Gehitutako hitzak zure nabigatzailean gordeko dira. Datu hauek lehendik daudenekin nahastuko dira jolastean.
        </p>
      </div>
    </div>
  );
};

export default EditView;
