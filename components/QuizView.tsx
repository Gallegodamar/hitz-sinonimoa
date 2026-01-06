
import React from 'react';
import { GameState } from '../types';

interface QuizViewProps {
  gameState: GameState;
  onOptionToggle: (id: string) => void;
  onCheck: () => void;
  onNext: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ gameState, onOptionToggle, onCheck, onNext }) => {
  if (!gameState.currentWord) return null;

  const correctCount = gameState.options.filter(o => o.isCorrect).length;
  const isWinning = gameState.checked && gameState.selectedIds.length === correctCount && gameState.selectedIds.every(id => gameState.options.find(o => o.id === id)?.isCorrect);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Header compact */}
      <div className="shrink-0 text-center space-y-2 mb-4">
        <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Aurkitu honen sinonimoak:</h2>
        <div className="flex items-center justify-center space-x-3">
          <div className="text-3xl md:text-5xl font-black text-slate-900 drop-shadow-sm">
            {gameState.currentWord.hitza}
          </div>
          <a 
            href={`https://hiztegiak.elhuyar.eus/eu/${gameState.currentWord.hitza}`} 
            target="_blank" 
            rel="noopener noreferrer"
            title="Elhuyar Hiztegian bilatu"
            className="text-indigo-400 hover:text-indigo-600 transition-colors text-xl"
          >
            <i className="fas fa-book-open"></i>
          </a>
        </div>
        <p className="text-slate-400 text-xs italic">
          Guztira {correctCount} sinonimo daude.
        </p>
      </div>

      {/* Scrollable grid area if very small, but usually fits */}
      <div className="flex-1 overflow-y-auto min-h-0 px-1 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
          {gameState.options.map((option) => {
            const isSelected = gameState.selectedIds.includes(option.id);
            const isCorrect = option.isCorrect;
            
            let cardClasses = "relative p-3 md:p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ";
            
            if (!gameState.checked) {
              cardClasses += isSelected 
                ? "border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200" 
                : "border-slate-200 bg-white hover:border-slate-300 shadow-sm";
            } else {
              if (isCorrect) {
                cardClasses += "border-green-500 bg-green-50 shadow-inner";
              } else if (isSelected && !isCorrect) {
                cardClasses += "border-red-500 bg-red-50";
              } else {
                cardClasses += "border-slate-100 bg-slate-50 opacity-60";
              }
            }

            return (
              <div 
                key={option.id}
                onClick={() => onOptionToggle(option.id)}
                className={cardClasses}
              >
                <span className="font-semibold text-base md:text-lg">{option.text}</span>
                <div className="flex items-center">
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

      {/* Fixed Footer for Buttons and Feedback */}
      <div className="shrink-0 pt-4 flex flex-col space-y-3 bg-slate-50">
        <div className="flex justify-center">
          {!gameState.checked ? (
            <button
              onClick={onCheck}
              disabled={gameState.selectedIds.length === 0}
              className={`w-full md:w-auto px-10 py-3 md:py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${gameState.selectedIds.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              Egiaztatu
            </button>
          ) : (
            <button
              onClick={onNext}
              className="w-full md:w-auto px-10 py-3 md:py-4 rounded-xl font-bold text-white bg-slate-900 shadow-lg hover:bg-slate-800 transition-all transform active:scale-95"
            >
              Hurrengoa <i className="fas fa-arrow-right ml-2"></i>
            </button>
          )}
        </div>

        {gameState.checked && (
          <div className={`p-3 md:p-4 rounded-xl text-center border-l-4 animate-in slide-in-from-bottom-2 duration-300 ${
            isWinning ? 'bg-green-100 border-green-600 text-green-800' : 'bg-amber-100 border-amber-600 text-amber-800'
          }`}>
            <div className="text-sm font-bold mb-1">
              {isWinning ? 'Bikain! Asmatu duzu!' : 'Kasik! Begiratu erantzunak.'}
            </div>
            <div className="flex flex-wrap justify-center gap-x-2 text-[10px] md:text-xs">
              <span className="font-bold underline">{gameState.currentWord.hitza}:</span>
              {gameState.currentWord.sinonimoak.map((sin, idx) => (
                <span key={idx} className="opacity-80">{sin}{idx < gameState.currentWord!.sinonimoak.length - 1 ? ',' : ''}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
