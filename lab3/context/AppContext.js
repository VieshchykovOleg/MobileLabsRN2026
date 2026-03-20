import React, { createContext, useContext, useState, useCallback } from 'react';

export const THEMES = {
  light: {
    bg: '#F0F4FF',
    card: '#FFFFFF',
    text: '#1A1A2E',
    subtext: '#666680',
    accent: '#4F6EF7',
    accentLight: '#E8EEFF',
    border: '#E0E4F0',
    success: '#22C55E',
    successLight: '#DCFCE7',
    danger: '#EF4444',
    tabBar: '#FFFFFF',
    header: '#4F6EF7',
    headerText: '#FFFFFF',
    buttonText: '#FFFFFF',
    shadow: '#00000020',
    objectBg: '#4F6EF7',
    scoreText: '#4F6EF7',
  },
  dark: {
    bg: '#0F0F1A',
    card: '#1E1E30',
    text: '#F0F0FF',
    subtext: '#9090B0',
    accent: '#7B8FFF',
    accentLight: '#2A2A45',
    border: '#2A2A45',
    success: '#22C55E',
    successLight: '#14532D',
    danger: '#EF4444',
    tabBar: '#1E1E30',
    header: '#1E1E30',
    headerText: '#F0F0FF',
    buttonText: '#FFFFFF',
    shadow: '#00000060',
    objectBg: '#7B8FFF',
    scoreText: '#7B8FFF',
  },
};

const ThemeContext = createContext(null);
const GameContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const toggle = useCallback(() => setIsDark(v => !v), []);
  const theme = isDark ? THEMES.dark : THEMES.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

const INITIAL_CHALLENGES = [
  { id: 'ch1', label: 'Зробити 10 кліків',         desc: 'Натисни на об\'єкт 10 разів',          icon: '👆', goal: 10,  current: 0, type: 'tap'      },
  { id: 'ch2', label: 'Подвійний клік 5 разів',    desc: 'Зроби 5 подвійних кліків',             icon: '✌️', goal: 5,   current: 0, type: 'doubletap'},
  { id: 'ch3', label: 'Утримати 3 секунди',         desc: 'Утримуй об\'єкт 3 секунди',            icon: '⏱️', goal: 1,   current: 0, type: 'longpress'},
  { id: 'ch4', label: 'Перетягнути об\'єкт',        desc: 'Перемісти об\'єкт по екрану',           icon: '↔️', goal: 1,   current: 0, type: 'pan'      },
  { id: 'ch5', label: 'Свайп вправо',               desc: 'Зроби швидкий свайп вправо',           icon: '👉', goal: 1,   current: 0, type: 'flingR'   },
  { id: 'ch6', label: 'Свайп вліво',                desc: 'Зроби швидкий свайп вліво',            icon: '👈', goal: 1,   current: 0, type: 'flingL'   },
  { id: 'ch7', label: 'Змінити розмір об\'єкта',    desc: 'Використай pinch для масштабування',   icon: '🔍', goal: 1,   current: 0, type: 'pinch'    },
  { id: 'ch8', label: 'Набрати 100 очок',           desc: 'Зароби загалом 100 очок',              icon: '🏆', goal: 100, current: 0, type: 'score'    },
  { id: 'ch9', label: 'Набрати 500 очок',           desc: 'Стань майстром — зароби 500 очок',     icon: '🌟', goal: 500, current: 0, type: 'score'    },
];

export function GameProvider({ children }) {
  const [score, setScore]           = useState(0);
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [lastAction, setLastAction] = useState('');

  const updateChallenge = useCallback((type, amount = 1) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.type !== type) return ch;
      const next = Math.min(ch.current + amount, ch.goal);
      return { ...ch, current: next };
    }));
  }, []);

  const addScore = useCallback((pts, action, type) => {
    setScore(prev => {
      const next = prev + pts;
      // оновлюємо score-завдання
      setChallenges(chs => chs.map(ch => {
        if (ch.type !== 'score') return ch;
        return { ...ch, current: Math.min(next, ch.goal) };
      }));
      return next;
    });
    setLastAction(action);
    if (type) updateChallenge(type);
  }, [updateChallenge]);

  const resetGame = useCallback(() => {
    setScore(0);
    setLastAction('');
    setChallenges(INITIAL_CHALLENGES.map(c => ({ ...c, current: 0 })));
  }, []);

  return (
    <GameContext.Provider value={{ score, challenges, lastAction, addScore, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
