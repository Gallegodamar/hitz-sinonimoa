
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, ViewMode, SynonymItem, ClassSubMode } from './types';
import { generateRound, shuffleArray } from './utils';
import QuizView from './components/QuizView';
import BrowseView from './components/BrowseView';
import StatsView from './components/StatsView';
import EditView from './components/EditView';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('home');
  const [classSubMode, setClassSubMode] = useState<ClassSubMode>('all');
  const [staticData, setStaticData] = useState<SynonymItem[]>([]);
  const [staticClassData1, setStaticClassData1] = useState<SynonymItem[]>([]);
  const [staticClassData2, setStaticClassData2] = useState<SynonymItem[]>([]);
  const [localData, setLocalData] = useState<SynonymItem[]>([]);
  const [editingWord, setEditingWord] = useState<SynonymItem | null>(null);
  const [loading, setLoading] = useState(true);
  
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resAll, resClass1, resClass2] = await Promise.all([
          fetch('./synonyms.json'),
          fetch('./class_synonyms.json'),
          fetch('./class_synonyms_2.json')
        ]);
        
        const dataAll = (await resAll.json()) as SynonymItem[];
        const dataClass1 = (await resClass1.json()) as SynonymItem[];
        const dataClass2 = (await resClass2.json()) as SynonymItem[];
        
        setStaticData(dataAll);
        setStaticClassData1(dataClass1);
        setStaticClassData2(dataClass2);

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

  const allWordsPool = useMemo(() => {
    const poolMap = new Map<string, SynonymItem>();
    staticData.forEach(item => poolMap.set(item.hitza.toLowerCase(), item));
    staticClassData1.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
    staticClassData2.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
    localData.forEach(item => poolMap.set(item.hitza.toLowerCase(), item));
    return Array.from(poolMap.values());
  }, [staticData, staticClassData1, staticClassData2, localData]);

  const currentClassPool = useMemo(() => {
    if (classSubMode === 'first') {
      return staticClassData1.map(item => ({ ...item, isClass: true }));
    }
    
    if (classSubMode === 'second') {
      const poolMap = new Map<string, SynonymItem>();
      staticClassData2.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
      localData.filter(i => i.isClass).forEach(item => poolMap.set(item.hitza.toLowerCase(), item));
      return Array.from(poolMap.values());
    }

    const poolMap = new Map<string, SynonymItem>();
    staticClassData1.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
    staticClassData2.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
    localData.filter(i => i.isClass).forEach(item => poolMap.set(item.hitza.toLowerCase(), item));
    return Array.from(poolMap.values());
  }, [staticClassData1, staticClassData2, localData, classSubMode]);

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
      pool = staticClassData1.map(item => ({ ...item, isClass: true }));
    } else if (subMode === 'second') {
      const poolMap = new Map<string, SynonymItem>();
      staticClassData2.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
      localData.filter(i => i.isClass).forEach(item => poolMap.set(item.hitza.toLowerCase(), item));
      pool = Array.from(poolMap.values());
    } else {
      const poolMap = new Map<string, SynonymItem>();
      staticClassData1.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
      staticClassData2.forEach(item => poolMap.set(item.hitza.toLowerCase(), { ...item, isClass: true }));
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
  }, [staticClassData1, staticClassData2, localData, allWordsPool]);

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

  if (loading) {
    return (
      <div className="h-dvh w-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Kargatzen...</p>
      </div>
    );
  }

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
