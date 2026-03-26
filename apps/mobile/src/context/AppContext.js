import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getToken, getDeviceId, getMode } from '../storage';
import { setToken } from '../api/client';

const AppContext = createContext(null);

const initialState = {
  deviceToken: null,
  deviceId: null,
  mode: null,
  affiliation: null,
  isLoading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DEVICE_INFO':
      return {
        ...state,
        deviceToken: action.payload.deviceToken,
        deviceId: action.payload.deviceId,
      };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_AFFILIATION':
      return { ...state, affiliation: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function init() {
      try {
        const token = await getToken();
        const deviceId = await getDeviceId();
        const mode = await getMode();

        if (token) {
          setToken(token);
          dispatch({ type: 'SET_DEVICE_INFO', payload: { deviceToken: token, deviceId } });
        }
        if (mode) {
          dispatch({ type: 'SET_MODE', payload: mode });
        }
      } catch (error) {
        console.error('AppContext init error:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    init();
  }, []);

  const setDeviceInfo = (deviceToken, deviceId) => {
    dispatch({ type: 'SET_DEVICE_INFO', payload: { deviceToken, deviceId } });
  };

  const setMode = (mode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  const setAffiliation = (affiliation) => {
    dispatch({ type: 'SET_AFFILIATION', payload: affiliation });
  };

  const resetApp = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <AppContext.Provider value={{ state, setDeviceInfo, setMode, setAffiliation, resetApp }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
