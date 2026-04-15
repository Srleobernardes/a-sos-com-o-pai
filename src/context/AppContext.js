import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MEDALHAS } from '../data/medalhas';

const AppContext = createContext();

const STORAGE_KEY = '@sos_com_o_pai';
const TOTAL_DAILY_TASKS = 4;

const defaultState = {
  streak: 0,
  maxStreak: 0,
  lastActiveDate: null,
  completedDays: {},
  completedTasks: {},
  jejumAtivo: null,
  jejumDias: {},
  oracoesLidas: [],
  totalOracoes: 0,
  totalDevocionais: 0,
  primeiroAcesso: true,
  unlockedMedals: [],
};

export function AppProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [loading, setLoading] = useState(true);
  const [newMedalUnlocked, setNewMedalUnlocked] = useState(null);

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState({ ...defaultState, ...JSON.parse(saved) });
      }
    } catch (e) {
      console.log('Erro ao carregar dados:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveState = async (newState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.log('Erro ao salvar dados:', e);
    }
  };

  const updateState = useCallback((updates) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      saveState(newState);
      return newState;
    });
  }, []);

  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const completeTask = useCallback((taskId) => {
    const today = getToday();
    setState((prev) => {
      const todayTasks = prev.completedTasks[today] || [];
      if (todayTasks.includes(taskId)) return prev;

      const newTodayTasks = [...todayTasks, taskId];
      const newCompletedTasks = { ...prev.completedTasks, [today]: newTodayTasks };

      let newStreak = prev.streak;
      let newMaxStreak = prev.maxStreak;
      const newCompletedDays = { ...prev.completedDays };
      let newUnlockedMedals = [...(prev.unlockedMedals || [])];

      if (newTodayTasks.length >= TOTAL_DAILY_TASKS) {
        newCompletedDays[today] = true;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

        if (prev.lastActiveDate === yesterdayStr || prev.lastActiveDate === today) {
          newStreak = prev.lastActiveDate === today ? prev.streak : prev.streak + 1;
        } else {
          newStreak = 1;
        }
        newMaxStreak = Math.max(newMaxStreak, newStreak);

        // Check if a new medal was unlocked
        const newMedal = MEDALHAS.find(
          (m) => m.diasNecessarios === newStreak && !newUnlockedMedals.includes(m.id)
        );
        if (newMedal) {
          newUnlockedMedals = [...newUnlockedMedals, newMedal.id];
          setTimeout(() => setNewMedalUnlocked(newMedal), 500);
        }
      }

      const newState = {
        ...prev,
        completedTasks: newCompletedTasks,
        completedDays: newCompletedDays,
        streak: newStreak,
        maxStreak: newMaxStreak,
        lastActiveDate: today,
        unlockedMedals: newUnlockedMedals,
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const uncompleteTask = useCallback((taskId) => {
    const today = getToday();
    setState((prev) => {
      const todayTasks = prev.completedTasks[today] || [];
      if (!todayTasks.includes(taskId)) return prev;

      const newTodayTasks = todayTasks.filter((t) => t !== taskId);
      const newCompletedTasks = { ...prev.completedTasks, [today]: newTodayTasks };
      const newCompletedDays = { ...prev.completedDays };

      // If day was marked complete but now has fewer than 4, unmark it
      if (newTodayTasks.length < TOTAL_DAILY_TASKS) {
        delete newCompletedDays[today];
      }

      const newState = {
        ...prev,
        completedTasks: newCompletedTasks,
        completedDays: newCompletedDays,
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const isTaskCompleted = useCallback((taskId) => {
    const today = getToday();
    const todayTasks = state.completedTasks[today] || [];
    return todayTasks.includes(taskId);
  }, [state.completedTasks]);

  const startJejum = useCallback((tipo) => {
    const today = getToday();
    updateState({
      jejumAtivo: { tipo, inicio: today },
      jejumDias: {},
    });
  }, [updateState]);

  const toggleJejumDia = useCallback((dia) => {
    setState((prev) => {
      const newJejumDias = { ...prev.jejumDias };
      newJejumDias[dia] = !newJejumDias[dia];
      const newState = { ...prev, jejumDias: newJejumDias };
      saveState(newState);
      return newState;
    });
  }, []);

  const markOracaoLida = useCallback((oracaoId) => {
    setState((prev) => {
      const newLidas = prev.oracoesLidas.includes(oracaoId)
        ? prev.oracoesLidas
        : [...prev.oracoesLidas, oracaoId];
      const newState = { ...prev, oracoesLidas: newLidas, totalOracoes: newLidas.length };
      saveState(newState);
      return newState;
    });
  }, []);

  const incrementDevocionais = useCallback(() => {
    setState((prev) => {
      const newState = { ...prev, totalDevocionais: prev.totalDevocionais + 1 };
      saveState(newState);
      return newState;
    });
  }, []);

  const finishOnboarding = useCallback(() => {
    updateState({ primeiroAcesso: false });
  }, [updateState]);

  const clearNewMedal = useCallback(() => {
    setNewMedalUnlocked(null);
  }, []);

  const resetData = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }, []);

  const getDayOfWeek = () => {
    const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    return days[new Date().getDay()];
  };

  const getWeekDays = () => {
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() - diaSemana + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({
        label: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'][i],
        date: d.getDate(),
        dateStr,
        isToday: i === diaSemana,
        isPast: i < diaSemana,
        isCompleted: !!state.completedDays[dateStr],
      });
    }
    return days;
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loading,
        newMedalUnlocked,
        completeTask,
        uncompleteTask,
        isTaskCompleted,
        startJejum,
        toggleJejumDia,
        markOracaoLida,
        incrementDevocionais,
        finishOnboarding,
        clearNewMedal,
        resetData,
        getWeekDays,
        getDayOfWeek,
        getToday,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
