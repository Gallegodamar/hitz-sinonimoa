
import React from 'react';
import { GameState } from '../types';

interface QuizViewProps {
  gameState: GameState;
  onOptionToggle: (id: string) => void;
  onCheck: () => void;
  onNext: () => void;
  sessionInfo?: {
    remaining: number;
    hits: number;
    misses: number;
    total: number;
  };
  onRestartSession?: () => void;
  onExit: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ 
  gameState, 
  onOptionToggle, 
  onCheck, 
  onNext, 
  sessionInfo,
  onRestartSession,
  onExit
}) => {
  
  if (!gameState.currentWord && sessionInfo) {
    const score = Math.round((sessionInfo.hits / sessionInfo.total) * 100);
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500 px-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 text-amber-600 rounded-full mb-2">
            <i className="fas fa-graduation-cap text-4xl"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Saioa amaitu da!</h2>
          <p className="text-slate-500 font-medium">Hitz guztiak errepasatu dituzu.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 text-center shadow-sm">
            <div className="text-3xl font-black text-green-600">{sessionInfo.hits}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Asmatuak</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 text-center shadow-sm">
            <div className="text-3xl font-black text-red-500">{sessionInfo.misses}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Hutsak</div>
          </div>
          <div className="col-span-2 bg-indigo-600 p-6 rounded-3xl text-center shadow-xl shadow-indigo-100">
            <div className="text-4xl font-black text-white">{score}%</div>
            <div className="text-[11px] font-bold text-indigo-200 uppercase tracking-[0.2em] mt-1">Zehaztasuna</div>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-3">
          <button 
            onClick={onRestartSession}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all transform active:scale-95 text-lg"
          >
            Berriro hasi
          </button>
          <button 
            onClick={onExit}
            className="w-full py-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-sm"
          >
            Hasierara bueltatu
          </button>
        </div>
      </div>
    );
  }

  if (!gameState.currentWord) return null;

  const correctCount = gameState.options.filter(o => o.isCorrect).length;
  const isWinning = gameState.checked && gameState.selectedIds.length === correctCount && gameState.selectedIds.every(id => gameState.options.find(o => o.id === id)?.isCorrect);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Session Header */}
      <div className="shrink-0 flex items-center justify-between mb-4">
        {sessionInfo ? (
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-1">
              <i className="fas fa-layer-group text-indigo-500 text-xs"></i>
              <span className="text-xs font-black text-slate-700">Falta: {sessionInfo.remaining + 1}</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-100"></div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-green-600">{sessionInfo.hits}✓</span>
              <span className="text-xs font-black text-red-500">{sessionInfo.misses}✗</span>
            </div>
          </div>
        ) : <div/>}
        <button onClick={onExit} className="w-9 h-9 flex items-center justify-center bg-white rounded-full border border-slate-200 text-slate-400 hover:text-red-500 transition-colors">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Target Word - Bold and Clear */}
      <div className="shrink-0 text-center mb-5">
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Aurkitu sinonimoak:</span>
        <div className="flex items-center justify-center space-x-3 px-2">
          <h1 className="text-4xl md:text-6xl font-black text-slate-950 leading-none tracking-tight">
            {gameState.currentWord.hitza}
          </h1>
          <a 
            href={`https://hiztegiak.elhuyar.eus/eu_es/${gameState.currentWord.hitza}`} 
            target="_blank" rel="noopener noreferrer"
            className="text-indigo-300 hover:text-indigo-600 transition-colors text-2xl"
          >
            <i className="fas fa-book-open"></i>
          </a>
        </div>
        <p className="text-slate-500 font-bold text-xs mt-3 bg-slate-100 inline-block px-3 py-1 rounded-full">
          {correctCount} erantzun zuzen
        </p>
      </div>

      {/* Scrollable Grid - Larger font */}
      <div className="flex-1 overflow-y-auto min-h-0 px-0.5 custom-scrollbar mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-4">
          {gameState.options.map((option) => {
            const isSelected = gameState.selectedIds.includes(option.id);
            const isCorrect = option.isCorrect;
            
            let cardClasses = "relative px-5 py-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between shadow-sm active:scale-[0.98] ";
            
            if (!gameState.checked) {
              cardClasses += isSelected 
                ? "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50" 
                : "border-white bg-white hover:border-slate-200";
            } else {
              if (isCorrect) {
                cardClasses += "border-green-500 bg-green-50/70";
              } else if (isSelected && !isCorrect) {
                cardClasses += "border-red-500 bg-red-50/70";
              } else {
                cardClasses += "border-slate-100 bg-white opacity-40";
              }
            }

            return (
              <div key={option.id} onClick={() => onOptionToggle(option.id)} className={cardClasses}>
                <span className={`font-black text-[18px] md:text-xl ${isSelected || (gameState.checked && isCorrect) ? 'text-slate-950' : 'text-slate-700'}`}>
                  {option.text}
                </span>
                <div className="flex items-center shrink-0 ml-3">
                  {gameState.checked ? (
                    isCorrect ? (
                      <i className="fas fa-check-circle text-green-600 text-xl"></i>
                    ) : isSelected ? (
                      <i className="fas fa-times-circle text-red-600 text-xl"></i>
                    ) : null
                  ) : (
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'}`}>
                      {isSelected && <i className="fas fa-check text-white text-[10px]"></i>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="shrink-0 space-y-3 bg-slate-50/80 backdrop-blur-sm pt-2">
        {!gameState.checked ? (
          <button
            onClick={onCheck}
            disabled={gameState.selectedIds.length === 0}
            className={`w-full py-4.5 rounded-2xl font-black text-lg text-white shadow-xl transition-all transform active:scale-95 ${gameState.selectedIds.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}
          >
            EGIAZTATU
          </button>
        ) : (
          <button
            onClick={onNext}
            className="w-full py-4.5 rounded-2xl font-black text-lg text-white bg-slate-950 shadow-xl hover:bg-slate-800 transition-all transform active:scale-95"
          >
            HURRENGOA <i className="fas fa-arrow-right ml-2 text-sm"></i>
          </button>
        )}

        {gameState.checked && (
          <div className={`px-4 py-3 rounded-2xl text-center border-l-8 animate-in slide-in-from-bottom-2 duration-300 ${
            isWinning ? 'bg-green-100 border-green-600 text-green-900 shadow-lg shadow-green-100' : 'bg-amber-100 border-amber-600 text-amber-900 shadow-lg shadow-amber-100'
          }`}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-1">
              {isWinning ? 'Oso ondo!' : 'Sinonimoak:'}
            </div>
            <div className="flex flex-wrap justify-center gap-x-2 text-sm md:text-base font-black">
              {gameState.currentWord.sinonimoak.map((sin, idx) => (
                <React.Fragment key={idx}>
                  <a 
                    href={`https://hiztegiak.elhuyar.eus/eu_es/${sin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-950 hover:text-indigo-600 transition-colors underline decoration-slate-300 decoration-1 underline-offset-4"
                  >
                    {sin}
                  </a>
                  {idx < gameState.currentWord!.sinonimoak.length - 1 && <span className="opacity-30">,</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default QuizView;
