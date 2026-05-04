import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MEDALHAS } from '../data/medalhas';
import { temAcesso } from '../data/planos';
import { buscarAssinante, assinaturaAtiva } from '../lib/supabase';

const AppContext = createContext();

const STORAGE_KEY = '@sos_com_o_pai';
const AUTH_KEY = '@sos_auth';
const PENDING_PLANO_KEY = '@sos_pending_plano';
const TOTAL_DAILY_TASKS = 4;

const defaultState = {
  streak: 0,
  maxStreak: 0,
  lastActiveDate: null,
  completedDays: {},
  completedTasks: {},
  jejumAtivo: null,
  jejumDias: {},
  jejumOracoes: {},
  oracoesLidas: [],
  oracoesUltimaData: null,
  oracoesConcluidasDias: {},
  totalOracoes: 0,
  totalDevocionais: 0,
  totalJejuns: 0,
  jejunsHistorico: [],
  devocionaisHistorico: [],
  primeiroAcesso: true,
  unlockedMedals: [],
};

export function AppProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [loading, setLoading] = useState(true);
  const [newMedalUnlocked, setNewMedalUnlocked] = useState(null);
  const [jejumConcluido, setJejumConcluido] = useState(false);
  const [planoConcluido, setPlanoConcluido] = useState(false);
  const [todasOracoesCompletas, setTodasOracoesCompletas] = useState(false);

  // Auth state
  const [auth, setAuth] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    loadState();
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const saved = await AsyncStorage.getItem(AUTH_KEY);
      if (saved) setAuth(JSON.parse(saved));
    } catch (e) {
      console.log('Erro ao carregar auth:', e);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email) => {
    const assinante = await buscarAssinante(email);

    if (!assinante) {
      throw new Error('Email não encontrado. Verifique se usou o mesmo email do checkout.');
    }

    if (!assinaturaAtiva(assinante)) {
      throw new Error('Sua assinatura está inativa ou expirada. Entre em contato com o suporte.');
    }

    const authData = {
      email: assinante.email,
      plano: assinante.plano,
      status: assinante.status,
      trialFim: assinante.trial_fim,
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    await AsyncStorage.removeItem(PENDING_PLANO_KEY);
    setAuth(authData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setAuth(null);
  };

  const savePendingPlano = async (planoId) => {
    await AsyncStorage.setItem(PENDING_PLANO_KEY, planoId);
  };

  const getPendingPlano = async () => {
    return await AsyncStorage.getItem(PENDING_PLANO_KEY);
  };

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getYesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const loadState = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      let loaded = saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;

      const today = getTodayStr();
      if (loaded.lastActiveDate !== today) {
        const yesterday = getYesterdayStr();
        const newStreak = loaded.lastActiveDate === yesterday
          ? (loaded.streak || 0) + 1
          : 1;
        const newMaxStreak = Math.max(loaded.maxStreak || 0, newStreak);

        // Check medal on login streak
        let newUnlockedMedals = [...(loaded.unlockedMedals || [])];
        const newMedal = MEDALHAS.find(
          (m) => m.diasNecessarios === newStreak && !newUnlockedMedals.includes(m.id)
        );
        if (newMedal) {
          newUnlockedMedals = [...newUnlockedMedals, newMedal.id];
          setTimeout(() => setNewMedalUnlocked(newMedal), 1500);
        }

        loaded = { ...loaded, streak: newStreak, maxStreak: newMaxStreak, lastActiveDate: today, unlockedMedals: newUnlockedMedals };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
      }

      // Reset daily prayers when the day changes
      if (loaded.oracoesUltimaData !== today) {
        loaded = { ...loaded, oracoesLidas: [], oracoesUltimaData: today };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
      }

      setState(loaded);
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

      const newCompletedDays = { ...prev.completedDays };
      if (newTodayTasks.length >= TOTAL_DAILY_TASKS) {
        newCompletedDays[today] = true;
        setTimeout(() => setPlanoConcluido(true), 400);
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
      jejumOracoes: {},
    });
  }, [updateState]);

  const startJejumNormal = useCallback((causaId, refeicaoId) => {
    const today = getToday();
    updateState({
      jejumAtivo: { tipo: 'normal', causaId, refeicaoId, inicio: today },
      jejumDias: {},
      jejumOracoes: {},
    });
  }, [updateState]);

  const startJejumProposito = useCallback((propositoId, nivelId) => {
    const today = getToday();
    updateState({
      jejumAtivo: { tipo: 'proposito', propositoId, nivelId, inicio: today },
      jejumDias: {},
      jejumOracoes: {},
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

  const toggleJejumOracao = useCallback((key) => {
    setState((prev) => {
      const newJejumOracoes = { ...prev.jejumOracoes, [key]: !prev.jejumOracoes[key] };
      const newState = { ...prev, jejumOracoes: newJejumOracoes };
      saveState(newState);
      return newState;
    });
  }, []);

  const TOTAL_ORACOES = 6;

  const markOracaoLida = useCallback((oracaoId) => {
    const today = getToday();
    setState((prev) => {
      if (prev.oracoesLidas.includes(oracaoId)) return prev;
      const newLidas = [...prev.oracoesLidas, oracaoId];
      const jaConcluidoHoje = prev.oracoesConcluidasDias?.[today];
      const todasLidas = newLidas.length >= TOTAL_ORACOES;
      const newConcluidasDias = { ...(prev.oracoesConcluidasDias || {}) };
      let newTotal = prev.totalOracoes;
      if (todasLidas && !jaConcluidoHoje) {
        newConcluidasDias[today] = true;
        newTotal = (prev.totalOracoes || 0) + 1;
        setTimeout(() => setTodasOracoesCompletas(true), 400);
      }
      const newState = { ...prev, oracoesLidas: newLidas, oracoesConcluidasDias: newConcluidasDias, totalOracoes: newTotal };
      saveState(newState);
      return newState;
    });
  }, []);

  const unmarkOracaoLida = useCallback((oracaoId) => {
    setState((prev) => {
      const newLidas = prev.oracoesLidas.filter((id) => id !== oracaoId);
      const newState = { ...prev, oracoesLidas: newLidas, totalOracoes: newLidas.length };
      saveState(newState);
      return newState;
    });
  }, []);

  const incrementDevocionais = useCallback((titulo) => {
    setState((prev) => {
      const entry = { data: getToday(), titulo: titulo || 'Devocional' };
      const newState = {
        ...prev,
        totalDevocionais: prev.totalDevocionais + 1,
        devocionaisHistorico: [...(prev.devocionaisHistorico || []), entry],
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const completarJejum = useCallback(() => {
    setState((prev) => {
      const tipoLabels = {
        normal: 'Jejum Normal',
        parcial: 'Jejum Parcial',
        daniel: 'Jejum de Daniel',
        ester: 'Jejum de Ester',
        proposito: 'Jejum com Propósito',
      };
      const tipo = prev.jejumAtivo?.tipo || 'normal';
      const entry = { data: getToday(), tipo, label: tipoLabels[tipo] || 'Jejum' };
      const newState = {
        ...prev,
        totalJejuns: (prev.totalJejuns || 0) + 1,
        jejunsHistorico: [...(prev.jejunsHistorico || []), entry],
        jejumAtivo: null,
        jejumDias: {},
        jejumOracoes: {},
      };
      saveState(newState);
      return newState;
    });
    setTimeout(() => setJejumConcluido(true), 400);
  }, []);

  const clearJejumConcluido = useCallback(() => {
    setJejumConcluido(false);
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
        startJejumNormal,
        startJejumProposito,
        toggleJejumDia,
        toggleJejumOracao,
        markOracaoLida,
        unmarkOracaoLida,
        todasOracoesCompletas,
        clearTodasOracoesCompletas: () => setTodasOracoesCompletas(false),
        incrementDevocionais,
        completarJejum,
        jejumConcluido,
        clearJejumConcluido,
        planoConcluido,
        clearPlanoConcluido: () => setPlanoConcluido(false),
        finishOnboarding,
        clearNewMedal,
        resetData,
        getWeekDays,
        getDayOfWeek,
        getToday,
        // Auth
        auth,
        authLoading,
        isAuthenticated: !!auth,
        login,
        logout,
        savePendingPlano,
        getPendingPlano,
        temAcesso: (recurso) => temAcesso(auth?.plano, recurso),
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
