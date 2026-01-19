
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, ViewMode, SynonymItem, ClassSubMode } from './types';
import { generateRound, shuffleArray } from './utils';
import { ALL_SYNONYMS, CLASS_LIST_1, CLASS_LIST_2 } from './data';
import QuizView from './components/QuizView';
import BrowseView from './components/BrowseView';
import StatsView from './components/StatsView';
import EditView from './components/EditView';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('home');
  const [classSubMode, setClassSubMode] = useState<ClassSubMode>('all');
  const [localData, setLocalData] = useState<SynonymItem[]>([]);
  const [editingWord, setEditingWord] = useState<SynonymItem | null>(null);
  
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

  // Cargar datos locales guardados por el usuario
  useEffect(() => {
    const saved = localStorage.getItem('user_synonyms');
    if (saved) {
      setLocalData(JSON.parse(saved) as SynonymItem[]);
    }
  }, []);

  // Pool de todas las palabras (estáticas + locales)
  const allWordsPool = useMemo(() => {
    const poolMap = new Map<string, SynonymItem>();
    ALL_SYNONYMS.forEach(item => poolMap.set(item.hitza.toLowerCase(), item));
    CLASS_LIST_1.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
    CLASS_LIST_2.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
    localData.forEach(item => poolMap.set(item.hitza.toLowerCase(), item));
    return Array.from(poolMap.values());
  }, [localData]);

  // Pool específico para los modos escolares
  const currentClassPool = useMemo(() => {
    if (classSubMode === 'first') {
      return CLASS_LIST_1;
    }
    
    if (classSubMode === 'second') {
      const poolMap = new Map<string, SynonymItem>();
      // Lista 2 de las imágenes
      CLASS_LIST_2.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
      // Palabras del usuario marcadas como escolares
      localData.filter(i => i.isClass).forEach(item => poolMap.set(item.hitza.toLowerCase(), item));
      return Array.from(poolMap.values());
    }

    // "Zerrenda osoa" (Lista 1 + Lista 2 + Escolares locales)
    const poolMap = new Map<string, SynonymItem>();
    CLASS_LIST_1.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
    CLASS_LIST_2.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
    localData.filter(i => i.isClass).forEach(item => poolMap.set(item.hitza.toLowerCase(), item));
    return Array.from(poolMap.values());
  }, [localData, classSubMode]);

  const startNewRound = useCallback((specificWord?: SynonymItem) => {
    let targetWord: SynonymItem | undefined = specificWord;
    let targetPool = (view === 'class') ? currentClassPool : allWordsPool;

    if (view === 'class' && !targetWord) {
      if (classQueue.length > 0) {
        const newQueue = [...classQueue];
        targetWord = newQueue.shift() as SynonymItem;
        setClassQueue(newQueue);
      } else {
        setGameState(prev => ({ ...prev, currentWord: null }));
        return;
      }
    }

    if (targetPool.length === 0 && !targetWord) return;

    // Usamos allWordsPool para distractores para que siempre haya suficientes opciones incluso en listas cortas
    const { word, options } = generateRound(targetPool, targetWord, allWordsPool);
    
    setGameState(prev => ({
      ...prev,
      currentWord: word,
      options,
      checked: false,
      selectedIds: []
    }));
  }, [allWordsPool, currentClassPool, classQueue, view]);

  const initClassSession = useCallback((subMode: ClassSubMode) => {
    let pool: SynonymItem[] = [];
    if (subMode === 'first') {
      pool = CLASS_LIST_1;
    } else if (subMode === 'second') {
      const poolMap = new Map<string, SynonymItem>();
      CLASS_LIST_2.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
      localData.filter(i => i.isClass).forEach(item => poolMap.set(item.hitza.toLowerCase(), item));
      pool = Array.from(poolMap.values());
    } else {
      const poolMap = new Map<string, SynonymItem>();
      CLASS_LIST_1.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
      CLASS_LIST_2.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
      localData.filter(i => i.isClass).forEach(item => poolMap.set(item.hitza.toLowerCase(), item));
      pool = Array.from(poolMap.values());
    }

    if (pool.length === 0) {
      alert("Zerrenda hau hutsik dago!");
      setView('home');
      return;
    }

    const shuffled = shuffleArray(pool);
    const first = shuffled.shift() as SynonymItem;
    setClassQueue(shuffled);
    setClassSessionStats({ hits: 0, misses: 0, totalSession: pool.length });
    
    const { word, options } = generateRound(pool, first, allWordsPool);
    
    setGameState(prev => ({
      ...prev,
      currentWord: word,
      options,
      checked: false,
      selectedIds: []
    }));
  }, [localData, allWordsPool]);

  useEffect(() => {
    if (view === 'quiz') {
      startNewRound();
    }
  }, [view, startNewRound]);

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

  const handleSaveWord = (word: string, synonyms: string[], isClass: boolean) => {
    const wordKey = word.trim().toLowerCase();
    const updatedLocal = [...localData];
    const existingIndex = updatedLocal.findIndex(i => i.hitza.toLowerCase() === wordKey);

    const newItem: SynonymItem = {
      id: existingIndex !== -1 ? updatedLocal[existingIndex].id : Date.now().toString(),
      hitza: word.trim(),
      sinonimoak: synonyms.map(s => s.trim()).filter(s => s !== ""),
      isClass: isClass
    };
    
    if (existingIndex !== -1) updatedLocal[existingIndex] = newItem;
    else updatedLocal.push(newItem);

    setLocalData(updatedLocal);
    localStorage.setItem('user_synonyms', JSON.stringify(updatedLocal));
    setView('browse');
    setEditingWord(null);
  };

  return (
    <div className="h-dvh flex flex-col bg-slate-50 overflow-hidden font-sans">
      {view !== 'home' && <Navbar currentView={view} setView={(v) => { setView(v); setEditingWord(null); }} />}
      
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col px-4 pt-2 md:pt-6 pb-2 overflow-hidden">
          
          {view === 'home' && (
            <HomeView 
              onSelectMode={(mode) => setView(mode)} 
              onSelectClassMode={(subMode) => {
                setClassSubMode(subMode);
                setView('class');
                initClassSession(subMode);
              }}
            />
          )}

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
              onRestartSession={view === 'class' ? () => initClassSession(classSubMode) : undefined}
              onExit={() => setView('home')}
            />
          )}
          
          {view === 'browse' && (
            <BrowseView 
              data={allWordsPool}
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
                onCancel={() => { setView('home'); setEditingWord(null); }} 
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

      {view !== 'home' && (
        <div className="md:hidden flex shrink-0 bg-white border-t border-slate-200 justify-around py-2.5 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <button onClick={() => setView('home')} className="flex flex-col items-center space-y-1 text-slate-400">
            <i className="fas fa-home text-lg"></i>
            <span className="text-[10px] font-black">Hasiera</span>
          </button>
          <button onClick={() => setView('browse')} className={`flex flex-col items-center space-y-1 ${view === 'browse' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <i className="fas fa-search text-lg"></i>
            <span className="text-[10px] font-black">Bilatu</span>
          </button>
          <button onClick={() => { setView('add'); setEditingWord(null); }} className={`flex flex-col items-center space-y-1 ${view === 'add' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <i className="fas fa-plus-circle text-lg"></i>
            <span className="text-[10px] font-black">Gehitu</span>
          </button>
          <button onClick={() => setView('stats')} className={`flex flex-col items-center space-y-1 ${view === 'stats' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <i className="fas fa-chart-pie text-lg"></i>
            <span className="text-[10px] font-black">Estat.</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
