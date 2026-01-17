
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, ViewMode, SynonymItem } from './types';
import { generateRound, shuffleArray } from './utils';
import QuizView from './components/QuizView';
import BrowseView from './components/BrowseView';
import StatsView from './components/StatsView';
import EditView from './components/EditView';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('quiz');
  const [staticData, setStaticData] = useState<SynonymItem[]>([]);
  const [classData, setClassData] = useState<SynonymItem[]>([]);
  const [localData, setLocalData] = useState<SynonymItem[]>([]);
  const [editingWord, setEditingWord] = useState<SynonymItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Class mode session state
  const [classQueue, setClassQueue] = useState<SynonymItem[]>([]);
  const [classSessionStats, setClassSessionStats] = useState({ hits: 0, misses: 0, totalSession: 0 });

  const [gameState, setGameState] = useState<GameState>({
    currentWord: null,
    options: [],
    score: 0,
    totalAttempts: 0,
    checked: false,
    selectedIds: []
  });

  // Load external JSONs and local storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resAll, resClass] = await Promise.all([
          fetch('./synonyms.json'),
          fetch('./class_synonyms.json')
        ]);
        
        const dataAll = (await resAll.json()) as SynonymItem[];
        const dataClass = (await resClass.json()) as SynonymItem[];
        
        setStaticData(dataAll);
        setClassData(dataClass);

        const saved = localStorage.getItem('user_synonyms');
        if (saved) {
          setLocalData(JSON.parse(saved) as SynonymItem[]);
        }
      } catch (e) {
        console.error("Datuak kargatzean errorea:", e);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const allWords = useMemo(() => {
    const merged = [...staticData];
    localData.forEach(localItem => {
      const index = merged.findIndex(i => i.hitza.toLowerCase() === localItem.hitza.toLowerCase());
      if (index !== -1) {
        const combinedSyns = Array.from(new Set([...merged[index].sinonimoak, ...localItem.sinonimoak]));
        merged[index] = { ...merged[index], sinonimoak: combinedSyns };
      } else {
        merged.push(localItem);
      }
    });
    return merged;
  }, [staticData, localData]);

  const startNewRound = useCallback((specificWord?: SynonymItem) => {
    let targetWord: SynonymItem | undefined = specificWord;
    let pool = allWords;

    if (view === 'class') {
      pool = classData;
      if (!targetWord) {
        if (classQueue.length > 0) {
          const newQueue = [...classQueue];
          targetWord = newQueue.shift();
          setClassQueue(newQueue);
        } else {
          // Sesión terminada
          setGameState(prev => ({ ...prev, currentWord: null }));
          return;
        }
      }
    }

    if (pool.length === 0 && !targetWord) return;

    const { word, options } = generateRound(pool, targetWord);
    setGameState(prev => ({
      ...prev,
      currentWord: word,
      options,
      checked: false,
      selectedIds: []
    }));
  }, [allWords, classData, classQueue, view]);

  // Initialize class session: Shuffle everything and start first word
  const initClassSession = useCallback(() => {
    if (classData.length === 0) return;
    const shuffled = shuffleArray(classData);
    const first = shuffled.shift()!;
    setClassQueue(shuffled);
    setClassSessionStats({ hits: 0, misses: 0, totalSession: classData.length });
    
    const { word, options } = generateRound(classData, first);
    setGameState(prev => ({
      ...prev,
      currentWord: word,
      options,
      checked: false,
      selectedIds: []
    }));
  }, [classData]);

  // View switch handling
  useEffect(() => {
    if (view === 'class') {
      initClassSession();
    } else if (view === 'quiz') {
      startNewRound();
    }
  }, [view, initClassSession]);

  const handleOptionToggle = (id: string) => {
    if (gameState.checked) return;
    setGameState(prev => ({
      ...prev,
      selectedIds: prev.selectedIds.includes(id)
        ? prev.selectedIds.filter(i => i !== id)
        : [...prev.selectedIds, id]
      }));
  };

  const checkAnswer = () => {
    if (!gameState.currentWord) return;

    const correctIds = gameState.options.filter(o => o.isCorrect).map(o => o.id);
    const selectedAreAllCorrect = 
      gameState.selectedIds.length === correctIds.length &&
      gameState.selectedIds.every(id => correctIds.includes(id));

    if (view === 'class') {
      setClassSessionStats(prev => ({
        ...prev,
        hits: selectedAreAllCorrect ? prev.hits + 1 : prev.hits,
        misses: !selectedAreAllCorrect ? prev.misses + 1 : prev.misses
      }));
    }

    setGameState(prev => ({
      ...prev,
      checked: true,
      score: selectedAreAllCorrect ? prev.score + 1 : prev.score,
      totalAttempts: prev.totalAttempts + 1
    }));
  };

  const handleSaveWord = (word: string, synonyms: string[]) => {
    const newItem: SynonymItem = {
      id: Date.now().toString(),
      hitza: word.trim(),
      sinonimoak: synonyms.map(s => s.trim()).filter(s => s !== "")
    };

    const updatedLocal = [...localData];
    const existingIndex = updatedLocal.findIndex(i => i.hitza.toLowerCase() === newItem.hitza.toLowerCase());
    
    if (existingIndex !== -1) {
      updatedLocal[existingIndex] = newItem;
    } else {
      updatedLocal.push(newItem);
    }

    setLocalData(updatedLocal);
    localStorage.setItem('user_synonyms', JSON.stringify(updatedLocal));
    setView('browse');
    setEditingWord(null);
  };

  if (loading) {
    return (
      <div className="h-dvh w-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">Kargatzen...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-slate-50 overflow-hidden">
      <Navbar currentView={view} setView={(v) => { setView(v); setEditingWord(null); }} />
      
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col px-4 pt-4 pb-20 md:pb-4 overflow-hidden">
          {(view === 'quiz' || view === 'class') && (
            <QuizView 
              gameState={gameState}
              onOptionToggle={handleOptionToggle}
              onCheck={checkAnswer}
              onNext={() => startNewRound()}
              sessionInfo={view === 'class' ? {
                remaining: classQueue.length,
                hits: classSessionStats.hits,
                misses: classSessionStats.misses,
                total: classSessionStats.totalSession
              } : undefined}
              onRestartSession={view === 'class' ? initClassSession : undefined}
            />
          )}
          
          {view === 'browse' && (
            <BrowseView 
              data={allWords}
              onPractice={(word) => {
                setView('quiz');
                startNewRound(word);
              }} 
              onEdit={(word) => {
                setEditingWord(word);
                setView('add');
              }}
            />
          )}

          {view === 'add' && (
            <div className="flex-1 overflow-y-auto">
              <EditView 
                initialData={editingWord} 
                onSave={handleSaveWord} 
                onCancel={() => { setView('browse'); setEditingWord(null); }} 
              />
            </div>
          )}

          {view === 'stats' && (
            <div className="flex-1 overflow-y-auto">
              <StatsView score={gameState.score} total={gameState.totalAttempts} />
            </div>
          )}
        </div>
      </main>

      {/* Mobile persistent navigation */}
      <div className="md:hidden flex shrink-0 bg-white border-t border-slate-200 justify-around py-3 z-50">
        <button 
          onClick={() => setView('quiz')}
          className={`flex flex-col items-center space-y-1 transition-colors ${view === 'quiz' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <i className="fas fa-gamepad text-lg"></i>
          <span className="text-[10px] font-bold">Denak</span>
        </button>
        <button 
          onClick={() => setView('class')}
          className={`flex flex-col items-center space-y-1 transition-colors ${view === 'class' ? 'text-amber-600' : 'text-slate-400'}`}
        >
          <i className="fas fa-graduation-cap text-lg"></i>
          <span className="text-[10px] font-bold">Klasekoak</span>
        </button>
        <button 
          onClick={() => setView('browse')}
          className={`flex flex-col items-center space-y-1 transition-colors ${view === 'browse' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <i className="fas fa-search text-lg"></i>
          <span className="text-[10px] font-bold">Bilatu</span>
        </button>
        <button 
          onClick={() => { setView('add'); setEditingWord(null); }}
          className={`flex flex-col items-center space-y-1 transition-colors ${view === 'add' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <i className="fas fa-plus-circle text-lg"></i>
          <span className="text-[10px] font-bold">Gehitu</span>
        </button>
        <button 
          onClick={() => setView('stats')}
          className={`flex flex-col items-center space-y-1 transition-colors ${view === 'stats' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <i className="fas fa-chart-pie text-lg"></i>
          <span className="text-[10px] font-bold">Estat.</span>
        </button>
      </div>
    </div>
  );
};

export default App;
