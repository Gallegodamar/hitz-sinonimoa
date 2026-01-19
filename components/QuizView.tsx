
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
}

const QuizView: React.FC<QuizViewProps> = ({ 
  gameState, 
  onOptionToggle, 
  onCheck, 
  onNext, 
  sessionInfo,
  onRestartSession
}) => {
  
  if (!gameState.currentWord && sessionInfo) {
    const score = Math.round((sessionInfo.hits / sessionInfo.total) * 100);
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500 px-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full mb-2">
            <i className="fas fa-graduation-cap text-3xl"></i>
          </div>
          <h2 className="text-2xl font-black text-slate-900">Saioa amaitu da!</h2>
          <p className="text-sm text-slate-500">Zorionak! Hitz guztiak errepasatu dituzu.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
            <div className="text-2xl font-black text-green-600">{sessionInfo.hits}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Asmatuak</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
            <div className="text-2xl font-black text-red-500">{sessionInfo.misses}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Hutsak</div>
          </div>
          <div className="col-span-2 bg-indigo-600 p-4 rounded-2xl text-center shadow-lg">
            <div className="text-2xl font-black text-white">{score}%</div>
            <div className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">Zehaztasuna</div>
          </div>
        </div>

        <button 
          onClick={onRestartSession}
          className="w-full max-w-xs py-4 bg-slate-900 text-white font-black rounded-xl shadow-xl hover:bg-slate-800 transition-all transform active:scale-95"
        >
          Berriro hasi
        </button>
      </div>
    );
  }

  if (!gameState.currentWord) return null;

  const correctCount = gameState.options.filter(o => o.isCorrect).length;
  const isWinning = gameState.checked && gameState.selectedIds.length === correctCount && gameState.selectedIds.every(id => gameState.options.find(o => o.id === id)?.isCorrect);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Mini Progress - Only in Session Mode */}
      {sessionInfo && (
        <div className="shrink-0 flex items-center justify-between mb-2 bg-indigo-50/50 backdrop-blur px-3 py-1 rounded-xl border border-indigo-100/50">
          <div className="flex items-center space-x-1">
            <i className="fas fa-layer-group text-indigo-500 text-[10px]"></i>
            <span className="text-[10px] font-black text-indigo-700">Hurrengoak: {sessionInfo.remaining + 1}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-green-600"><i className="fas fa-check"></i> {sessionInfo.hits}</span>
            <span className="text-[10px] font-bold text-red-500"><i className="fas fa-times"></i> {sessionInfo.misses}</span>
          </div>
        </div>
      )}

      {/* Ultra Compact Header */}
      <div className="shrink-0 text-center mb-2">
        <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest block mb-0.5">Aurkitu sinonimoak:</span>
        <div className="flex items-center justify-center space-x-2">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
            {gameState.currentWord.hitza}
          </h1>
          <a 
            href={`https://hiztegiak.elhuyar.eus/eu/${gameState.currentWord.hitza}`} 
            target="_blank" rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-600 transition-colors text-xl"
          >
            <i className="fas fa-book-open"></i>
          </a>
        </div>
        <p className="text-slate-400 text-[10px] italic">
          {correctCount} sinonimo aurkitu behar dituzu.
        </p>
      </div>

      {/* Optimized Grid Area */}
      <div className="flex-1 overflow-y-auto min-h-0 px-0.5 py-1 custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
          {gameState.options.map((option) => {
            const isSelected = gameState.selectedIds.includes(option.id);
            const isCorrect = option.isCorrect;
            
            let cardClasses = "relative px-4 py-3 md:p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between shadow-sm ";
            
            if (!gameState.checked) {
              cardClasses += isSelected 
                ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-200" 
                : "border-slate-200 bg-white hover:border-slate-300";
            } else {
              if (isCorrect) {
                cardClasses += "border-green-500 bg-green-50/50";
              } else if (isSelected && !isCorrect) {
                cardClasses += "border-red-500 bg-red-50/50";
              } else {
                cardClasses += "border-slate-100 bg-slate-50 opacity-50";
              }
            }

            return (
              <div key={option.id} onClick={() => onOptionToggle(option.id)} className={cardClasses}>
                <span className={`font-bold text-[16px] md:text-lg ${isSelected || (gameState.checked && isCorrect) ? 'text-slate-900' : 'text-slate-700'}`}>
                  {option.text}
                </span>
                <div className="flex items-center shrink-0 ml-2">
                  {gameState.checked ? (
                    isCorrect ? (
                      <i className="fas fa-check-circle text-green-600 text-lg"></i>
                    ) : isSelected ? (
                      <i className="fas fa-times-circle text-red-600 text-lg"></i>
                    ) : null
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                      {isSelected && <i className="fas fa-check text-white text-[8px]"></i>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer and Feedback */}
      <div className="shrink-0 pt-2 bg-slate-50 border-t border-slate-100">
        <div className="flex justify-center mb-2">
          {!gameState.checked ? (
            <button
              onClick={onCheck}
              disabled={gameState.selectedIds.length === 0}
              className={`w-full py-3.5 rounded-xl font-black text-sm text-white shadow-lg transition-all transform active:scale-95 ${gameState.selectedIds.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              Egiaztatu
            </button>
          ) : (
            <button
              onClick={onNext}
              className="w-full py-3.5 rounded-xl font-black text-sm text-white bg-slate-900 shadow-lg hover:bg-slate-800 transition-all transform active:scale-95"
            >
              Hurrengoa <i className="fas fa-arrow-right ml-2"></i>
            </button>
          )}
        </div>

        {gameState.checked && (
          <div className={`px-3 py-2 rounded-xl text-center border-l-4 animate-in slide-in-from-bottom-1 duration-300 ${
            isWinning ? 'bg-green-100 border-green-600 text-green-800' : 'bg-amber-100 border-amber-600 text-amber-800'
          }`}>
            <div className="text-[10px] font-black uppercase mb-0.5 leading-none">
              {isWinning ? 'Bikain!' : 'Sinonimoak:'}
            </div>
            <div className="flex flex-wrap justify-center gap-x-1.5 text-[11px] md:text-xs font-semibold">
              {gameState.currentWord.sinonimoak.map((sin, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-slate-900">{sin}</span>
                  {idx < gameState.currentWord!.sinonimoak.length - 1 && <span className="opacity-40">,</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default QuizView;
